/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { toast } from 'sonner';
import type { User, AuthResponse, SignupCredentials, UserCredentials } from './auth';

const BASE_URL = 'http://localhost:8080/';

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

// ------------------------
// 🔐 Auth API Functions
// ------------------------

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', credentials);
  const { token, user } = response.data;

  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  const { message } = response.data;
  toast.success(message);
  window.location.href = '/dashboard';
  return { token, user, message };
};

export const signup = async (userData: SignupCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/signup', userData);
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
    product: {
      id: number;
      imageUrl: string | null;
      name: string;
      category: string;
      unit: string;
      costPrice: number;
      sellingPrice: number;
      supplier: string;
      stockAlertLevel: number;
      stockQuantity: number;
      price: number;
    };
    quantitySold: number;
    totalAmount: number;
    saleDate: string;
  }[]
> => {
  const response = await api.get('/sales');
  return response.data;
};

// Add a new sale
export const addSale = async (saleData: {
  productId: number;
  quantitySold: number;
  totalAmount: number;
}): Promise<any> => {
  const response = await api.post('/sales', saleData);
  toast.success('Sale added successfully!');
  return response.data;
};

// Delete a sale by ID
export const deleteSale = async (saleId: number): Promise<any> => {
  const response = await api.delete(`/sales/${saleId}`);
  toast.success('Sale deleted successfully!');
  return response.data;
};

//-----------------------------------------
// Supplier API functions                   |
//-----------------------------------------

// Add a new supplier
export const addSupplier = async (supplierData: {
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
  isActive: boolean;
}): Promise<any> => {
  const response = await api.post('/suppliers/add', supplierData);
  toast.success('Supplier added successfully!');
  return response.data;
};

// Update an existing supplier by ID
export const updateSupplier = async (
  id: number,
  supplierData: {
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
    isActive: boolean;
  }
): Promise<any> => {
  const response = await api.put(`/suppliers/${id}`, supplierData);
  toast.success('Supplier updated successfully!');
  return response.data;
};

// Fetch a single supplier by ID
export const getSupplierById = async (id: number): Promise<{
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
}> => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

// Fetch all suppliers
export const getAllSuppliers = async (): Promise<
  {
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
  }[]
> => {
  const response = await api.get('/suppliers/all');
  return response.data;
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
  const response = await api.get('/debts');
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
  const response = await api.get(`/debts/${id}`);
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
  const response = await api.post('/debts/add', debtData);
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
  const response = await api.put(`/debts/${id}`, debtData);
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
  image?: string; // Optional image field
}): Promise<any> => {
  const response = await api.post('/inventory/add', inventoryData);
  toast.success('Inventory item added successfully!');
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
  const response = await api.put(`/inventory/${id}`, inventoryData);
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
  const response = await api.get(`/inventory/category/${category}`);
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
  const response = await api.get(`/inventory/supplier/${supplier}`);
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
  const response = await api.get('/inventory/search', { params: query });
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
  const response = await api.get('/reports/generate', { params: reportData });
  toast.success('Report generated successfully!');
  return response.data;
};