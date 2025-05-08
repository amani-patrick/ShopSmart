/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { toast } from 'sonner';
import type { User, AuthResponse, SignupCredentials, UserCredentials } from './auth';
import { number, string } from 'zod';

const BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – adds token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handles 401s and other errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Your session has expired. Please login again.');
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

// ----------------------------
// 🔐 Auth API Functions
// ----------------------------

interface ForgotPasswordResponse {
  token: string | null;
  message: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>('api/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await api.post('api/auth/reset-password', data);
};

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user, message } = response.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    toast.success(message);
    window.location.href = '/dashboard';
    return { token, user, message };
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const signup = async (userData: SignupCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', userData); 
  const { token, user } = response.data;

  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token, user };
};

//-----------------------------------------
// Sales API functions                        |
//-----------------------------------------

// Fetch all sales
export const getSales = async (): Promise<
  {
    id: number;
    productId: number;
    quantitySold: number;
    totalAmount: number;
    saleDate: string;
  }[]
> => {
  const response = await api.get('../sales');
  return response.data;
};

// Add a new sale
export const addSale = async (saleData: {
  productId: number;
  quantitySold: number;
  totalAmount: number;
}): Promise<any> => {
  const response = await api.post('../sales', saleData);
  toast.success('Sale added successfully!');
  return response.data;
};

// Delete a sale by ID
export const deleteSale = async (saleId: number): Promise<any> => {
  const response = await api.delete(`../sales/${saleId}`);
  toast.success('Sale deleted successfully!');
  return response.data;
};

export const getSalesWithProductDetails = async (): Promise<
  {
    id: number;
    productId: number;
    product: {
      id: number;
      name: string;
      category: string;
      unit: string;
      costPrice: number;
      sellingPrice: number;
      supplier: string;
      stockAlertLevel: number;
      stockQuantity: number;
      imageUrl?: string;
    };
    quantitySold: number;
    totalAmount: number;
    saleDate: string;
  }[]
> => {
  const sales = await getSales();

  // Fetch product details for each sale
  const salesWithProductDetails = await Promise.all(
    sales.map(async (sale) => {
      const product = await getInventoryById(sale.productId);
      return {
        ...sale,
        product,
      };
    })
  );

  return salesWithProductDetails;
};

// Fetch sales summary
export const getSalesSummary = async (): Promise<{
  totalSalesToday: number;
  totalSalesThisWeek: number;
  totalSalesThisMonth: number;
  totalItemsSoldToday: number;
}> => {
  const response = await api.get('../sales/summary');
  return response.data;
};

//-----------------------------------------
// Supplier API functions                   |
//-----------------------------------------

// Supplier interfaces
export interface Supplier {
  id: number;
  name: string;
  category: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  active: boolean;
}

export interface CreateSupplierData {
  name: string;
  category: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  active: boolean;
}

// Add a new supplier
export const addSupplier = async (supplierData: CreateSupplierData): Promise<Supplier> => {
  const response = await api.post<Supplier>('../suppliers', supplierData);
  toast.success('Supplier added successfully!');
  return response.data;
};

// Update an existing supplier by ID
export const updateSupplier = async (
  id: number,
  supplierData: CreateSupplierData
): Promise<Supplier> => {
  const response = await api.put<Supplier>(`../suppliers/${id}`, supplierData);
  toast.success('Supplier updated successfully!');
  return response.data;
};

// Fetch all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>('../suppliers');
  return response.data;
};

// Fetch a single supplier by ID
export const getSupplierById = async (id: number): Promise<Supplier> => {
  const response = await api.get<Supplier>(`/suppliers/${id}`);
  return response.data;
};

// Delete a supplier
export const deleteSupplier = async (id: number): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
  toast.success('Supplier deleted successfully!');
};

//-----------------------------------------
// Debts API functions                       |
//-----------------------------------------

// Fetch all debts
export const getDebts = async (): Promise<
  {
    id: number;
    customerName: string;
    amount: number;
    createdDate: string;
    dueDate: string;
    paid: boolean;
  }[]
> => {
  const response = await api.get('../debts');
  return response.data;
};

// Fetch a single debt by ID
export const getDebtById = async (id: number): Promise<{
  id: number;
  customerName: string;
  amount: number;
  createdDate: string;
  dueDate: string;
  paid: boolean;
}> => {
  const response = await api.get(`../debts/${id}`);
  return response.data;
};

// Add a new debt
export const addDebt = async (debtData: {
  customerName: string;
  amount: number;
  createdDate: string;
  dueDate: string;
  isPaid: boolean;
}): Promise<any> => {
  const response = await api.post('../debts', debtData);
  toast.success('Debt added successfully!');
  return response.data;
};

// Update an existing debt by ID
export const updateDebt = async (id: number, debtData: {
  customerName: string;
  amount: number;
  createdDate: string;
  dueDate: string;
  isPaid: boolean;
}): Promise<any> => {
  const response = await api.put(`../debts/${id}`, debtData);
  toast.success('Debt updated successfully!');
  return response.data;
};

//-----------------------------------------
// Inventory API functions                |
//-----------------------------------------

// Add a new inventory item
export const addInventoryItem = async (inventoryData: {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  stockAlertLevel: number;
  image?: File;
}): Promise<any> => {
  const formData = new FormData();

  formData.append('name', inventoryData.name);
  formData.append('category', inventoryData.category);
  formData.append('quantity', inventoryData.quantity.toString());
  formData.append('unit', inventoryData.unit);
  formData.append('costPrice', inventoryData.costPrice.toString());
  formData.append('sellingPrice', inventoryData.sellingPrice.toString());
  formData.append('supplier', inventoryData.supplier);
  formData.append('stockAlertLevel', inventoryData.stockAlertLevel.toString());

  if (inventoryData.image) {
    formData.append('image', inventoryData.image);
  }

  const response = await api.post('../inventory/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  toast.success('Inventory item added successfully!');
  return response.data;
};

export const getInventories = async (): Promise<
{
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  stockQuantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  stockAlertLevel: number;
  price: number; 
}[]
> => {
  const response = await api.get('../inventory/all');
  return response.data;
};

// Update an existing inventory item by ID
export const updateInventoryItem = async (
  id: number,
  inventoryData: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    supplier: string;
    stockAlertLevel: number;
  }
): Promise<any> => {
  const response = await api.put(`../inventory/${id}`, inventoryData);
  toast.success('Inventory item updated successfully!');
  return response.data;
};

// Fetch inventory items by category
export const getInventoryByCategory = async (category: string): Promise<
  {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    supplier: string;
    stockAlertLevel: number;
    imageUrl?: string;
  }[]
> => {
  const response = await api.get(`../inventory/category/${category}`);
  return response.data;
};

//Fetch inventory items by id
export const getInventoryById = async (id: number): Promise<{
  id: number;
  name: string;
  category: string;
  stockQuantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  stockAlertLevel: number;
  imageUrl?: string;
}> => {
  const response = await api.get(`../inventory/${id}`);
  return response.data;
};

export const getProductByid = async (id: number): Promise<{
  id: number;
  name: string;
  category: string;
  stockQuantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  stockAlertLevel: number;
  imageUrl?: string;
}> => {
  const response = await api.get(`../inventory/${id}`);
  return response.data;
};

// Fetch inventory items by supplier
export const getInventoryBySupplier = async (supplier: string): Promise<
  {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    supplier: string;
    stockAlertLevel: number;
    imageUrl?: string;
  }[]
> => {
  const response = await api.get(`../inventory/supplier/${supplier}`);
  return response.data;
};

// Search inventory items by category and supplier
export const searchInventory = async (query: {
  category?: string;
  supplier?: string;
}): Promise<
  {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    supplier: string;
    stockAlertLevel: number;
    imageUrl?: string;
  }[]
> => {
  const response = await api.get('../inventory/search', { params: query });
  return response.data;
};

export const deleteInventoryItem = async (id: number): Promise<any> => {
  const response = await api.delete(`../inventory/${id}`);
  toast.success('Inventory item deleted successfully!');
  return response.data;
};

//-----------------------------------------
// Reports API functions                    |
//-----------------------------------------

// Generate a report
export const generateReport = async (reportData: {
  period: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
}): Promise<any> => {
  const response = await api.get('../reports/generate', { params: reportData });
  toast.success('Report generated successfully!');
  return response.data;
};

//-----------------------------------------
// Profile API functions                    |
//-----------------------------------------

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  shopName: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface UpdateProfileResponse {
  token: string | null;
  user: UserProfile;
  message: string;
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/auth/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  const response = await api.put<UpdateProfileResponse>('/auth/update-profile', {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    address: {
      street: data.address.street,
      city: data.address.city,
      postalCode: data.address.postalCode,
      country: data.address.country
    }
  });
  const { user: updatedUser } = response.data;
  
  // Update the user data in localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUserData = { ...currentUser, ...updatedUser };
  localStorage.setItem('user', JSON.stringify(updatedUserData));
  
  return updatedUser;
};