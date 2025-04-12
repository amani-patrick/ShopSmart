
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, Search, Clock, User, Package, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Sample products data (would be fetched from inventory in a real app)
const inventoryProducts = [
  {
    id: 1,
    name: 'Rice',
    category: 'Grains',
    quantity: 50,
    unit: 'kg',
    sellingPrice: 3.5,
  },
  {
    id: 2,
    name: 'Sugar',
    category: 'Sweeteners',
    quantity: 30,
    unit: 'kg',
    sellingPrice: 2.5,
  },
  {
    id: 3,
    name: 'Beans',
    category: 'Legumes',
    quantity: 25,
    unit: 'kg',
    sellingPrice: 4.5,
  },
];

// Sample categories
const categories = ['Grains', 'Sweeteners', 'Legumes', 'Beverages', 'Snacks', 'Dairy'];

// Sample sales
const initialSales = [
  {
    id: 1,
    date: '2023-04-12',
    items: [
      { name: 'Rice', quantity: 5, unit: 'kg', price: 3.5, total: 17.5 }
    ],
    totalAmount: 17.5,
    paymentType: 'cash',
    status: 'completed',
    customerName: '',
  },
  {
    id: 2,
    date: '2023-04-11',
    items: [
      { name: 'Sugar', quantity: 2, unit: 'kg', price: 2.5, total: 5 },
      { name: 'Beans', quantity: 3, unit: 'kg', price: 4.5, total: 13.5 }
    ],
    totalAmount: 18.5,
    paymentType: 'cash',
    status: 'completed',
    customerName: '',
  },
  {
    id: 3,
    date: '2023-04-10',
    items: [
      { name: 'Rice', quantity: 10, unit: 'kg', price: 3.5, total: 35 },
    ],
    totalAmount: 35,
    paymentType: 'credit',
    status: 'pending',
    customerName: 'John Doe',
    dueDate: '2023-04-20',
  },
];

const Sales = () => {
  const [sales, setSales] = useState(initialSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  
  // Cart state for new sale
  const [cart, setCart] = useState<{
    productId: number;
    name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
  }[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Filter sales based on search and status
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Add product to cart
  const addToCart = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    
    if (productQuantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    
    const product = inventoryProducts.find(p => p.id === Number(selectedProduct));
    if (!product) return;
    
    if (productQuantity > product.quantity) {
      toast.error(`Only ${product.quantity} ${product.unit} available in stock`);
      return;
    }
    
    const existingItemIndex = cart.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item in cart
      const updatedCart = [...cart];
      const newQuantity = updatedCart[existingItemIndex].quantity + productQuantity;
      
      if (newQuantity > product.quantity) {
        toast.error(`Cannot add more. Only ${product.quantity} ${product.unit} available in stock`);
        return;
      }
      
      updatedCart[existingItemIndex].quantity = newQuantity;
      updatedCart[existingItemIndex].total = newQuantity * product.sellingPrice;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        quantity: productQuantity,
        unit: product.unit,
        price: product.sellingPrice,
        total: productQuantity * product.sellingPrice
      }]);
    }
    
    setSelectedProduct('');
    setProductQuantity(1);
    toast.success(`${product.name} added to cart`);
  };
  
  // Remove item from cart
  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  
  // Complete the sale
  const completeSale = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty. Add products to complete sale.");
      return;
    }
    
    if (paymentType === 'credit' && !customerName) {
      toast.error("Please provide customer name for credit sale");
      return;
    }
    
    if (paymentType === 'credit' && !dueDate) {
      toast.error("Please provide due date for credit sale");
      return;
    }
    
    const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    
    const newSale = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        total: item.total
      })),
      totalAmount: cartTotal,
      paymentType,
      status: paymentType === 'cash' ? 'completed' : 'pending',
      customerName: paymentType === 'credit' ? customerName : '',
      dueDate: paymentType === 'credit' ? dueDate : undefined,
    };
    
    setSales([newSale, ...sales]);
    
    // Reset the form
    setCart([]);
    setSelectedProduct('');
    setProductQuantity(1);
    setPaymentType('cash');
    setCustomerName('');
    setDueDate('');
    setIsNewSaleOpen(false);
    
    toast.success("Sale completed successfully");
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Tracking</h1>
          <p className="text-muted-foreground">
            Record sales transactions and track performance.
          </p>
        </div>
        <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>
                Add products to cart and complete the sale.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="product">Product</Label>
                  <select
                    id="product"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">Select product</option>
                    {inventoryProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.sellingPrice.toFixed(2)} - ({product.quantity} {product.unit} available)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      value={productQuantity} 
                      onChange={(e) => setProductQuantity(Number(e.target.value))}
                      className="w-full"
                    />
                    <Button onClick={addToCart}>Add</Button>
                  </div>
                </div>
              </div>
              
              {/* Cart */}
              <div className="border rounded-md mt-2">
                <div className="bg-muted p-2 font-medium">Shopping Cart</div>
                {cart.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <ShoppingCart className="mx-auto h-6 w-6 mb-2" />
                    Cart is empty. Add products to proceed.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity} {item.unit}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>${item.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFromCart(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                <div className="p-4 flex justify-between items-center bg-muted/50">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Payment options */}
              <div>
                <Label className="mb-2 block">Payment Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="cash" 
                      name="paymentType" 
                      value="cash"
                      checked={paymentType === 'cash'}
                      onChange={() => setPaymentType('cash')}
                      className="mr-2" 
                    />
                    <Label htmlFor="cash">Cash</Label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="credit" 
                      name="paymentType" 
                      value="credit"
                      checked={paymentType === 'credit'}
                      onChange={() => setPaymentType('credit')}
                      className="mr-2" 
                    />
                    <Label htmlFor="credit">Credit (Debt)</Label>
                  </div>
                </div>
              </div>
              
              {paymentType === 'credit' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customerName">Customer Name*</Label>
                    <Input 
                      id="customerName" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date*</Label>
                    <Input 
                      id="dueDate" 
                      type="date" 
                      value={dueDate} 
                      onChange={(e) => setDueDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewSaleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={completeSale} disabled={cart.length === 0}>
                Complete Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-full sm:w-[180px]"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending (Credit)</option>
        </select>
      </div>
      
      {/* Sales List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            Showing your {filterStatus === 'all' ? 'recent' : filterStatus} sales transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sales found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all'
                  ? "Try adjusting your filters"
                  : "Get started by recording a new sale."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSales.map((sale) => (
                <Card key={sale.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={sale.status === 'completed' ? 'default' : 'secondary'}
                          className={sale.status === 'completed' ? 'bg-green-500' : ''}
                        >
                          {sale.status === 'completed' ? 'Paid' : 'Credit'}
                        </Badge>
                        <span className="font-normal text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> 
                          {sale.date}
                        </span>
                      </div>
                      <div className="text-xl font-bold">${sale.totalAmount.toFixed(2)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sale.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity} {item.unit}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {sale.paymentType === 'credit' && (
                      <div className="mt-4 pt-4 border-t flex gap-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            <span className="font-medium">Customer:</span> {sale.customerName}
                          </span>
                        </div>
                        {sale.dueDate && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>
                              <span className="font-medium">Due date:</span> {sale.dueDate}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
