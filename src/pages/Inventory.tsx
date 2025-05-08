/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Search, Plus, Edit, Trash, Package, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getInventories, addInventoryItem, updateInventoryItem,getInventoryById,deleteInventoryItem,getAllSuppliers,type Supplier } from '@/services/api';

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    costPrice: 0,
    sellingPrice: 0,
    supplier: '',
    stockAlertLevel: 0,
    image: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // Fetch both products and suppliers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, suppliersData] = await Promise.all([
          getInventories(),
          getAllSuppliers()
        ]);
        setProducts(productsData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Filter products based on search term, category, and stock level
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStock = showLowStock ? product.stockQuantity <= product.stockAlertLevel : true;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle adding a new product
  const handleAddProduct = async () => {
    // Validate required fields
    if (
      !newProduct.name ||
      !newProduct.category ||
      newProduct.quantity < 0 ||
      !newProduct.unit ||
      newProduct.costPrice <= 0 ||
      newProduct.sellingPrice <= 0 ||
      !newProduct.supplier ||
      newProduct.stockAlertLevel < 0
    ) {
      toast.error("Please fill all required fields correctly");
      return;
    }
  
    try {
      // Get the file from the file input
      const imageFile = fileInputRef.current?.files?.[0] || undefined;
  
      // Call the API to add the product
      const addedProduct = await addInventoryItem({
        ...newProduct,
        image: imageFile, // Pass the File object
      });
  
      // Update the products state with the new product
      setProducts([...products, addedProduct]);
  
      // Reset the form
      setNewProduct({
        name: '',
        category: '',
        quantity: 0,
        unit: 'kg',
        costPrice: 0,
        sellingPrice: 0,
        supplier: '',
        stockAlertLevel: 0,
        image: '',
      });
      setImagePreview(null);
      setIsAddDialogOpen(false);
  
      toast.success("Product added successfully");
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    }
  };

  // Handle editing a product
  const handleEditProduct = async () => {
    if (!editingProductId) return;

    try {
      const updatedProduct = await updateInventoryItem(editingProductId, newProduct); // Call the API function to update the product
      setProducts(
        products.map((product) =>
          product.id === editingProductId ? updatedProduct : product
        )
      );
      setEditingProductId(null);
      setNewProduct({
        name: "",
        category: "",
        quantity: 0,
        unit: "kg",
        costPrice: 0,
        sellingPrice: 0,
        supplier: "",
        stockAlertLevel: 0,
        image: "",
      });
      setEditImagePreview(null);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  // Start editing a product
  const startEditing = async (product: any) => {
    try {
      const fullProductDetails = await getInventoryById(product.id); // Fetch full product details
      setEditingProductId(product.id);
      setNewProduct({
        name: fullProductDetails.name,
        category: fullProductDetails.category,
        quantity: fullProductDetails.stockQuantity,
        unit: fullProductDetails.unit,
        costPrice: fullProductDetails.costPrice,
        sellingPrice: fullProductDetails.sellingPrice,
        supplier: fullProductDetails.supplier,
        stockAlertLevel: fullProductDetails.stockAlertLevel,
        image: fullProductDetails.imageUrl || "",
      });
      setEditImagePreview(fullProductDetails.imageUrl || null);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details. Please try again.");
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id: number) => {
        try {
      await deleteInventoryItem(id); 
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product removed successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };


  const isLowStock = (product: any) => {
    return product.stockQuantity <= product.stockAlertLevel;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track your stock levels, add new products, and manage inventory.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Enter the details of your new product. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Product Name */}
              <div className="grid gap-2">
                <Label htmlFor="product-name">Product Name*</Label>
                <Input
                  id="product-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label htmlFor="product-category">Category*</Label>
                <Input
                  id="product-category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="Enter product category"
                />
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product-quantity">Quantity*</Label>
                  <Input
                    id="product-quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value, 10) })}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-unit">Unit*</Label>
                  <Input
                    id="product-unit"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="e.g., kg, pcs"
                  />
                </div>
              </div>

              {/* Cost Price and Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product-cost-price">Cost Price*</Label>
                  <Input
                    id="product-cost-price"
                    type="number"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) })}
                    placeholder="Enter cost price"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-selling-price">Selling Price*</Label>
                  <Input
                    id="product-selling-price"
                    type="number"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) })}
                    placeholder="Enter selling price"
                  />
                </div>
              </div>

              {/* Supplier */}
              <div className="grid gap-2">
                <Label htmlFor="product-supplier">Supplier*</Label>
                <select
                  id="product-supplier"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={newProduct.supplier}
                  onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Alert Level */}
              <div className="grid gap-2">
                <Label htmlFor="product-stock-alert-level">Stock Alert Level*</Label>
                <Input
                  id="product-stock-alert-level"
                  type="number"
                  value={newProduct.stockAlertLevel}
                  onChange={(e) => setNewProduct({ ...newProduct, stockAlertLevel: parseInt(e.target.value, 10) })}
                  placeholder="Enter stock alert level"
                />
              </div>

              {/* Product Image */}
              <div className="grid gap-2">
                <Label htmlFor="product-image">Product Image</Label>
                <div className="flex flex-col items-center justify-center gap-4">
                  {imagePreview ? (
                    <div className="relative rounded-md overflow-hidden w-40 h-40 border border-gray-200">
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1"
                        onClick={() => {
                          setImagePreview(null);
                          setNewProduct({ ...newProduct, image: '' });
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string); // Update the preview
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Save Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingProductId} onOpenChange={() => setEditingProductId(null)}>
          <DialogContent className="sm:max-w-[550px] max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of your product. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Label htmlFor="product-category">Category</Label>
              <Input
                id="product-category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <Label htmlFor="product-quantity">Quantity</Label>
              <Input
                id="product-quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value, 10) })}
              />
              <Label htmlFor="product-unit">Unit</Label>
              <Input
                id="product-unit"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              />
              <Label htmlFor="product-cost-price">Cost Price</Label>
              <Input
                id="product-cost-price"
                type="number"
                value={newProduct.costPrice}
                onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) })}
              />
              <Label htmlFor="product-selling-price">Selling Price</Label>
              <Input
                id="product-selling-price"
                type="number"
                value={newProduct.sellingPrice}
                onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) })}
              />
              <Label htmlFor="product-supplier">Supplier</Label>
              <select
                id="edit-product-supplier"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newProduct.supplier}
                onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <Label htmlFor="product-stock-alert-level">Stock Alert Level</Label>
              <Input
                id="product-stock-alert-level"
                type="number"
                value={newProduct.stockAlertLevel}
                onChange={(e) => setNewProduct({ ...newProduct, stockAlertLevel: parseInt(e.target.value, 10) })}
              />
              <div className="grid gap-2">
                <Label htmlFor="product-image">Product Image</Label>
                <div className="flex flex-col items-center justify-center gap-4">
                  {editImagePreview ? (
                    <div className="relative rounded-md overflow-hidden w-40 h-40 border border-gray-200">
                      <img 
                        src={editImagePreview} 
                        alt="Product preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1"
                        onClick={() => {
                          setEditImagePreview(null);
                          setNewProduct({ ...newProduct, image: '' });
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => editFileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={editFileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const result = reader.result as string;
                          setEditImagePreview(result);
                          setNewProduct({ ...newProduct, image: result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProductId(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            You have {products.length} products in your inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-6">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterCategory !== 'all' || showLowStock
                  ? "Try adjusting your filters"
                  : "Get started by adding a new product."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {product.imageUrl && (
                            <div className="rounded-md overflow-hidden w-10 h-10 flex-shrink-0">
                              <img 
                                src={`http://localhost:8080${product.imageUrl}`} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.stockQuantity} {product.unit}
                          {isLowStock(product) && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Low</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => startEditing(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-destructive">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {product.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
