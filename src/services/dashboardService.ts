
import { api } from './api';

// Define interfaces for our data
export interface SalesData {
  id: string;
  date: string;
  amount: number;
  customer: string;
  products: Array<{ id: string; name: string; quantity: number; price: number }>;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  costPrice: number;
  supplier: string;
  lastRestocked: string;
}

export interface DebtRecord {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  notes?: string;
}

// Dashboard stats
export const getDashboardStats = async () => {
  try {
    // In a real app, this would call your actual API
    // return await api.get('/dashboard/stats');
    
    // For now, return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        totalRevenue: 15231.89,
        totalSales: 573,
        growthRate: 20.1,
        salesGrowth: 8.2,
        activeInventory: 345,
        inventoryChange: -3.2,
        activeDebts: 2350,
        debtsChange: 12.5
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Sales data
export const getSalesData = async () => {
  try {
    // In a real app: return await api.get('/sales');
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const mockSales: SalesData[] = Array(20).fill(null).map((_, i) => ({
      id: `sale-${i + 1}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      amount: Math.floor(Math.random() * 500) + 10,
      customer: `Customer ${i + 1}`,
      products: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, j) => ({
        id: `product-${j}`,
        name: `Product ${j + 1}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 100) + 5
      }))
    }));
    
    return { data: mockSales };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

// Inventory data
export const getInventoryItems = async () => {
  try {
    // In a real app: return await api.get('/inventory');
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const categories = ['Electronics', 'Groceries', 'Clothing', 'Household', 'Office'];
    const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];
    
    const mockInventory: InventoryItem[] = Array(30).fill(null).map((_, i) => ({
      id: `item-${i + 1}`,
      name: `Item ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      quantity: Math.floor(Math.random() * 100),
      price: Math.floor(Math.random() * 200) + 10,
      costPrice: Math.floor(Math.random() * 150) + 5,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return { data: mockInventory };
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    throw error;
  }
};

// Debts data
export const getDebts = async () => {
  try {
    // In a real app: return await api.get('/debts');
    await new Promise(resolve => setTimeout(resolve, 550));
    
    const mockDebts: DebtRecord[] = Array(15).fill(null).map((_, i) => {
      const date = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
      const dueDate = new Date(date);
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 15);
      
      const isPastDue = dueDate < new Date();
      const isRandomlyPaid = Math.random() > 0.7;
      
      let status: 'pending' | 'paid' | 'overdue';
      if (isRandomlyPaid) {
        status = 'paid';
      } else if (isPastDue) {
        status = 'overdue';
      } else {
        status = 'pending';
      }
      
      return {
        id: `debt-${i + 1}`,
        customerName: `Customer ${i + 1}`,
        amount: Math.floor(Math.random() * 500) + 50,
        date: date.toISOString(),
        dueDate: dueDate.toISOString(),
        status,
        notes: Math.random() > 0.5 ? `Note for debt ${i + 1}` : undefined
      };
    });
    
    return { data: mockDebts };
  } catch (error) {
    console.error('Error fetching debts data:', error);
    throw error;
  }
};
