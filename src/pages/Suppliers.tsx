import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash, Phone, Mail, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, type Supplier, type CreateSupplierData } from '@/services/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newSupplier, setNewSupplier] = useState<CreateSupplierData>({
    name: '',
    category: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    active: true,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
  
  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to fetch suppliers');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format full address
  const formatAddress = (supplier: Supplier) => {
    return `${supplier.address}, ${supplier.city}, ${supplier.state}, ${supplier.postalCode}, ${supplier.country}`;
  };
  
  // Handle adding a new supplier
  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.phoneNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const addedSupplier = await addSupplier(newSupplier);
      setSuppliers([...suppliers, addedSupplier]);
      setNewSupplier({
        name: '',
        category: '',
        contactPerson: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        active: true,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error('Failed to add supplier');
    }
  };
  
  // Handle editing a supplier
  const handleEditSupplier = async () => {
    if (!editingSupplierId) return;
    
    try {
      const updatedSupplier = await updateSupplier(editingSupplierId, newSupplier);
      setSuppliers(suppliers.map(supplier => 
        supplier.id === editingSupplierId ? updatedSupplier : supplier
      ));
      setEditingSupplierId(null);
      setNewSupplier({
        name: '',
        category: '',
        contactPerson: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        active: true,
      });
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Failed to update supplier');
    }
  };
  
  // Start editing a supplier
  const startEditing = (supplier: Supplier) => {
    setEditingSupplierId(supplier.id);
    setNewSupplier({
      name: supplier.name,
      category: supplier.category,
      contactPerson: supplier.contactPerson,
      phoneNumber: supplier.phoneNumber,
      email: supplier.email,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      postalCode: supplier.postalCode,
      country: supplier.country,
      active: supplier.active,
    });
  };
  
  // Handle deleting a supplier
  const handleDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id);
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Failed to delete supplier');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading suppliers...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships and contact information.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Supplier</DialogTitle>
              <DialogDescription>
                Enter the details of your new supplier. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Supplier Name*</Label>
                <Input 
                  id="name" 
                  value={newSupplier.name} 
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={newSupplier.category} 
                  onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                  placeholder="e.g., Food, Electronics"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Person*</Label>
                <Input 
                  id="contact" 
                  value={newSupplier.contactPerson} 
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  placeholder="Enter contact person's name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input 
                  id="phone" 
                  value={newSupplier.phoneNumber} 
                  onChange={(e) => setNewSupplier({...newSupplier, phoneNumber: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newSupplier.email} 
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              {/* Address Fields */}
              <div className="grid gap-2">
                <Label>Address</Label>
                <div className="grid gap-3">
                  <Input 
                    id="address" 
                    placeholder="Street Address"
                    value={newSupplier.address} 
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      id="city" 
                      placeholder="City"
                      value={newSupplier.city} 
                      onChange={(e) => setNewSupplier({...newSupplier, city: e.target.value})}
                    />
                    <Input 
                      id="state" 
                      placeholder="State/Province"
                      value={newSupplier.state} 
                      onChange={(e) => setNewSupplier({...newSupplier, state: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      id="postalCode" 
                      placeholder="Postal/ZIP Code"
                      value={newSupplier.postalCode} 
                      onChange={(e) => setNewSupplier({...newSupplier, postalCode: e.target.value})}
                    />
                    <Input 
                      id="country" 
                      placeholder="Country"
                      value={newSupplier.country} 
                      onChange={(e) => setNewSupplier({...newSupplier, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSupplier}>
                Save Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingSupplierId} onOpenChange={(open) => !open && setEditingSupplierId(null)}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Supplier</DialogTitle>
              <DialogDescription>
                Update the details of this supplier. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Supplier Name*</Label>
                <Input 
                  id="edit-name" 
                  value={newSupplier.name} 
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input 
                  id="edit-category" 
                  value={newSupplier.category} 
                  onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact">Contact Person*</Label>
                <Input 
                  id="edit-contact" 
                  value={newSupplier.contactPerson} 
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number*</Label>
                <Input 
                  id="edit-phone" 
                  value={newSupplier.phoneNumber} 
                  onChange={(e) => setNewSupplier({...newSupplier, phoneNumber: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={newSupplier.email} 
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                />
              </div>
              
              {/* Address Fields */}
              <div className="grid gap-2">
                <Label>Address</Label>
                <div className="grid gap-3">
                  <Input 
                    id="edit-address" 
                    placeholder="Street Address"
                    value={newSupplier.address} 
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      id="edit-city" 
                      placeholder="City"
                      value={newSupplier.city} 
                      onChange={(e) => setNewSupplier({...newSupplier, city: e.target.value})}
                    />
                    <Input 
                      id="edit-state" 
                      placeholder="State/Province"
                      value={newSupplier.state} 
                      onChange={(e) => setNewSupplier({...newSupplier, state: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      id="edit-postalCode" 
                      placeholder="Postal/ZIP Code"
                      value={newSupplier.postalCode} 
                      onChange={(e) => setNewSupplier({...newSupplier, postalCode: e.target.value})}
                    />
                    <Input 
                      id="edit-country" 
                      placeholder="Country"
                      value={newSupplier.country} 
                      onChange={(e) => setNewSupplier({...newSupplier, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={newSupplier.active ? 'active' : 'inactive'}
                  onChange={(e) => setNewSupplier({...newSupplier, active: e.target.value === 'active'})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingSupplierId(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSupplier}>
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
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-full sm:w-[180px]"
          defaultValue="all"
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-full sm:w-[150px]"
          defaultValue="all"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Suppliers list */}
      <div className="grid gap-6">
        {filteredSuppliers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No suppliers found</h3>
              <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
                We couldn't find any suppliers matching your search. Try adjusting your filters.
              </p>
              <Button onClick={() => setSearchTerm('')}>Clear filters</Button>
            </CardContent>
          </Card>
        ) : (
          filteredSuppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      {supplier.category}
                      <Badge 
                        variant={supplier.active ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {supplier.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => startEditing(supplier)}
                    >
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
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove {supplier.name} from your suppliers list. 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="my-3" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center">
                    <div className="bg-muted rounded-full p-2 mr-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{supplier.contactPerson}</p>
                      <p className="text-xs text-muted-foreground">Contact Person</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-muted rounded-full p-2 mr-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{supplier.phoneNumber}</p>
                      <p className="text-xs text-muted-foreground">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-muted rounded-full p-2 mr-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{supplier.email || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center sm:col-span-2 lg:col-span-3">
                    <div className="bg-muted rounded-full p-2 mr-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{formatAddress(supplier)}</p>
                      <p className="text-xs text-muted-foreground">Address</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Suppliers;
