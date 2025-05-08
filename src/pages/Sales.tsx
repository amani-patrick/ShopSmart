/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSalesWithProductDetails, deleteSale, addSale, getInventories, addDebt } from '@/services/api';
import { Plus} from 'lucide-react';
import { toast } from 'sonner';

const Sales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]); 
  const [cart, setCart] = useState<any[]>([]); 
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentType: 'cash', 
    customerName: '',
    dueDate: '',
  });

  const BASE_URL = 'http://localhost:8080'; // Backend base URL

  // Fetch sales with product details on component mount
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesData = await getSalesWithProductDetails();
        setSales(salesData);
      } catch (error) {
        console.error('Error fetching sales:', error);
        toast.error('Failed to fetch sales. Please try again.');
      }
    };

    fetchSales();
  }, []);

  // Fetch available products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getInventories();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products. Please try again.');
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (productId: number, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      toast.error('Invalid product selected.');
      return;
    }

    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, totalAmount: (item.quantity + quantity) * product.sellingPrice }
            : item
        )
      );
    } else {
      // Add new product to the cart
      setCart([
        ...cart,
        {
          productId,
          productName: product.name,
          quantity,
          unit: product.unit,
          sellingPrice: product.sellingPrice,
          totalAmount: quantity * product.sellingPrice,
        },
      ]);
    }
  };

  // Add new function to increment quantity
  const incrementQuantity = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1, totalAmount: (item.quantity + 1) * product.sellingPrice }
          : item
      )
    );
  };

  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // Handle submitting the sale
  const handleSubmitSale = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty. Please add products to the cart.');
      return;
    }

    try {
      // Add each product in the cart as a sale
      for (const item of cart) {
        const saleData = {
          productId: item.productId,
          quantitySold: item.quantity,
          totalAmount: item.totalAmount,
        };
        await addSale(saleData);
      }

      // If payment type is credit, add a debt
      if (paymentDetails.paymentType === 'credit') {
        if (!paymentDetails.customerName || !paymentDetails.dueDate) {
          toast.error('Please provide customer name and due date for credit sales.');
          return;
        }

        const totalDebtAmount = cart.reduce((sum, item) => sum + item.totalAmount, 0);
        const debtData = {
          customerName: paymentDetails.customerName,
          amount: totalDebtAmount,
          createdDate: new Date().toISOString().split('T')[0],
          dueDate: paymentDetails.dueDate,
          isPaid: false,
        };
        await addDebt(debtData);
        toast.success('Debt recorded successfully!');
      }

      // Refresh sales data
      const updatedSales = await getSalesWithProductDetails();
      setSales(updatedSales);

      // Reset the cart and payment details
      setCart([]);
      setPaymentDetails({
        paymentType: 'cash',
        customerName: '',
        dueDate: '',
      });
      setIsAddDialogOpen(false);

      toast.success('Sale added successfully!');
    } catch (error) {
      console.error('Error submitting sale:', error);
      toast.error('Failed to submit sale. Please try again.');
    }
  };

  // Handle deleting a sale
  const handleDeleteSale = async (saleId: number) => {
    try {
      await deleteSale(saleId);
      setSales(sales.filter((sale) => sale.id !== saleId));
      toast.success('Sale deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-screen overflow-y-auto">
            <DialogHeader> 
              <DialogTitle> Add New Sale</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Product Selection */}
              <div className="grid gap-2">
                <Label htmlFor="product-id">Product*</Label>
                <select
                  id="product-id"
                  onChange={(e) => {
                    const productId = parseInt(e.target.value, 10);
                    const product = products.find((p) => p.id === productId);
                    if (product) {
                      addToCart(productId, 1);
                    }
                  }}
                  className="border rounded p-2"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.sellingPrice.toFixed(2)} ({product.stockQuantity} {product.unit} available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Cart */}
              <div className="grid gap-2">
                <Label>Cart</Label>
                {cart.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {item.quantity}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => incrementQuantity(item.productId)}
                                className="h-6 w-6 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>${item.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.productId)}
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
              </div>

              {/* Payment Details */}
              <div className="grid gap-2">
                <Label htmlFor="payment-type">Payment Type*</Label>
                <select
                  id="payment-type"
                  value={paymentDetails.paymentType}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentType: e.target.value })}
                  className="border rounded p-2"
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
              {paymentDetails.paymentType === 'credit' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="customer-name">Customer Name*</Label>
                    <Input
                      id="customer-name"
                      value={paymentDetails.customerName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due-date">Due Date*</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={paymentDetails.dueDate}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, dueDate: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitSale}>
                Submit Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No sales found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity Sold</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {sale.product.imageUrl ? (
                          <img
                            src={`${BASE_URL}${sale.product.imageUrl}`} // Prepend BASE_URL to imageUrl
                            alt={sale.product.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                        <span>{sale.product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{sale.product.category}</TableCell>
                    <TableCell>{sale.quantitySold}</TableCell>
                    <TableCell>{sale.product.unit}</TableCell>
                    <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSale(sale.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
