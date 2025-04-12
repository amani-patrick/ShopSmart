
import React, { useState, useRef } from 'react';
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

// Sample product images
const defaultProductImages = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1514963629718-4f9795ee8c27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1517081719645-0456073ca84d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
];

// Sample products data with added image URLs
const initialProducts = [
  {
    id: 1,
    name: 'Rice',
    category: 'Grains',
    quantity: 50,
    unit: 'kg',
    costPrice: 2.5,
    sellingPrice: 3.5,
    supplier: 'Global Foods Inc.',
    stockAlert: 10,
    lastRestocked: '2023-04-01',
    image: defaultProductImages[0],
  },
  {
    id: 2,
    name: 'Sugar',
    category: 'Sweeteners',
    quantity: 30,
    unit: 'kg',
    costPrice: 1.8,
    sellingPrice: 2.5,
    supplier: 'Global Foods Inc.',
    stockAlert: 5,
    lastRestocked: '2023-04-05',
    image: defaultProductImages[1],
  },
  {
    id: 3,
    name: 'Beans',
    category: 'Legumes',
    quantity: 25,
    unit: 'kg',
    costPrice: 3.2,
    sellingPrice: 4.5,
    supplier: 'Global Foods Inc.',
    stockAlert: 8,
    lastRestocked: '2023-04-10',
    image: defaultProductImages[2],
  },
];

// Sample categories
const categories = ['Grains', 'Sweeteners', 'Legumes', 'Beverages', 'Snacks', 'Dairy'];

const Inventory = () => {
  const [products, setProducts] = useState(initialProducts);
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
    stockAlert: 0,
    lastRestocked: new Date().toISOString().split('T')[0],
    image: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  
  // Filter products based on search term, category, and stock level
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStock = showLowStock ? product.quantity <= product.stockAlert : true;
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  // Handle file selection for new product
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setNewProduct({...newProduct, image: result});
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle file selection for editing product
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditImagePreview(result);
        setNewProduct({...newProduct, image: result});
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Trigger file input click for edit
  const handleEditUploadClick = () => {
    if (editFileInputRef.current) {
      editFileInputRef.current.click();
    }
  };
  
  // Handle adding a new product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || newProduct.quantity < 0) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Use a default image if none was uploaded
    const productImage = newProduct.image || 'https://images.unsplash.com/photo-1553395572-53de71bbcfe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
    
    setProducts([...products, { ...newProduct, id: newId, image: productImage }]);
    setNewProduct({
      name: '',
      category: '',
      quantity: 0,
      unit: 'kg',
      costPrice: 0,
      sellingPrice: 0,
      supplier: '',
      stockAlert: 0,
      lastRestocked: new Date().toISOString().split('T')[0],
      image: '',
    });
    
    setImagePreview(null);
    setIsAddDialogOpen(false);
    toast.success("Product added successfully");
  };
  
  // Handle editing a product
  const handleEditProduct = () => {
    if (!editingProductId) return;
    
    setProducts(products.map(product => 
      product.id === editingProductId ? { ...newProduct, id: editingProductId } : product
    ));
    
    setEditingProductId(null);
    setNewProduct({
      name: '',
      category: '',
      quantity: 0,
      unit: 'kg',
      costPrice: 0,
      sellingPrice: 0,
      supplier: '',
      stockAlert: 0,
      lastRestocked: new Date().toISOString().split('T')[0],
      image: '',
    });
    
    setEditImagePreview(null);
    toast.success("Product updated successfully");
  };
  
  // Start editing a product
  const startEditing = (product: typeof initialProducts[0]) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      supplier: product.supplier,
      stockAlert: product.stockAlert,
      lastRestocked: product.lastRestocked,
      image: product.image,
    });
    setEditImagePreview(product.image);
  };
  
  // Handle deleting a product
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Product removed successfully");
  };
  
  // Check if product is low on stock
  const isLowStock = (product: typeof initialProducts[0]) => {
    return product.quantity <= product.stockAlert;
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
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Enter the details of your new product. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Product Image Upload */}
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
                          setNewProduct({...newProduct, image: ''});
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={handleUploadClick}
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
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    type="button"
                    className="w-fit"
                    onClick={handleUploadClick}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name*</Label>
                  <Input 
                    id="name" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category*</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity*</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={newProduct.quantity} 
                    onChange={(e) => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="l">Liter (l)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input 
                    id="costPrice" 
                    type="number" 
                    value={newProduct.costPrice} 
                    onChange={(e) => setNewProduct({...newProduct, costPrice: Number(e.target.value)})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sellingPrice">Selling Price*</Label>
                  <Input 
                    id="sellingPrice" 
                    type="number" 
                    value={newProduct.sellingPrice} 
                    onChange={(e) => setNewProduct({...newProduct, sellingPrice: Number(e.target.value)})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input 
                    id="supplier" 
                    value={newProduct.supplier} 
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    placeholder="Supplier name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stockAlert">Stock Alert Level</Label>
                  <Input 
                    id="stockAlert" 
                    type="number" 
                    value={newProduct.stockAlert} 
                    onChange={(e) => setNewProduct({...newProduct, stockAlert: Number(e.target.value)})}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setImagePreview(null);
                setNewProduct({
                  name: '',
                  category: '',
                  quantity: 0,
                  unit: 'kg',
                  costPrice: 0,
                  sellingPrice: 0,
                  supplier: '',
                  stockAlert: 0,
                  lastRestocked: new Date().toISOString().split('T')[0],
                  image: '',
                });
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Save Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingProductId} onOpenChange={(open) => {
          if (!open) {
            setEditingProductId(null);
            setEditImagePreview(null);
          }
        }}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of this product. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Edit Product Image Upload */}
              <div className="grid gap-2">
                <Label htmlFor="edit-product-image">Product Image</Label>
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
                          setNewProduct({...newProduct, image: ''});
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={handleEditUploadClick}
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
                    onChange={handleEditFileChange}
                  />
                  <Button 
                    variant="outline" 
                    type="button"
                    className="w-fit"
                    onClick={handleEditUploadClick}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name*</Label>
                  <Input 
                    id="edit-name" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category*</Label>
                  <select
                    id="edit-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              {/* Same fields as in the Add dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-quantity">Quantity*</Label>
                  <Input 
                    id="edit-quantity" 
                    type="number" 
                    value={newProduct.quantity} 
                    onChange={(e) => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <select
                    id="edit-unit"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="l">Liter (l)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-costPrice">Cost Price</Label>
                  <Input 
                    id="edit-costPrice" 
                    type="number" 
                    value={newProduct.costPrice} 
                    onChange={(e) => setNewProduct({...newProduct, costPrice: Number(e.target.value)})}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-sellingPrice">Selling Price*</Label>
                  <Input 
                    id="edit-sellingPrice" 
                    type="number" 
                    value={newProduct.sellingPrice} 
                    onChange={(e) => setNewProduct({...newProduct, sellingPrice: Number(e.target.value)})}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Input 
                    id="edit-supplier" 
                    value={newProduct.supplier} 
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stockAlert">Stock Alert Level</Label>
                  <Input 
                    id="edit-stockAlert" 
                    type="number" 
                    value={newProduct.stockAlert} 
                    onChange={(e) => setNewProduct({...newProduct, stockAlert: Number(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProductId(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct}>
                Save Changes
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
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-full sm:w-[180px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="lowStock"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="lowStock">Low Stock Only</Label>
        </div>
      </div>

      {/* Low Stock Alert */}
      {products.some(isLowStock) && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-800 text-lg">Low Stock Alert</CardTitle>
            <CardDescription className="text-yellow-700">
              Some products are running low on stock. Consider restocking soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {products.filter(isLowStock).map(product => (
                <li key={product.id} className="text-sm text-yellow-800">
                  <span className="font-medium">{product.name}:</span> {product.quantity} {product.unit} left (Alert level: {product.stockAlert})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

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
                          {product.image && (
                            <div className="rounded-md overflow-hidden w-10 h-10 flex-shrink-0">
                              <img 
                                src={product.image} 
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
                          {product.quantity} {product.unit}
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
