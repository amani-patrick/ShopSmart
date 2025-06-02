import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    id?: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    costPrice: number;
    sellingPrice: number;
    supplier: string;
    stockAlertLevel: number;
    imageUrl?: string;
  };
}

export const ProductDialog = ({ isOpen, onOpenChange, onSubmit, initialData }: ProductDialogProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || 'kg',
    costPrice: initialData?.costPrice || 0,
    sellingPrice: initialData?.sellingPrice || 0,
    supplier: initialData?.supplier || '',
    stockAlertLevel: initialData?.stockAlertLevel || 0,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString());
      });
      if (file) {
        form.append('image', file);
      }
      await onSubmit(form);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit. Please try again.');
    }
  };

  const title = initialData ? 'Edit Product' : 'Add Product';
  const buttonText = initialData ? 'Update' : 'Add';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edit your product details' : 'Add a new product'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="w-full">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="pcs">pcs</SelectItem>
                  <SelectItem value="ltr">ltr</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Supplier */}
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              placeholder="Enter supplier name"
              required
            />
          </div>

          {/* Stock Alert Level */}
          <div className="space-y-2">
            <Label htmlFor="stockAlertLevel">Stock Alert Level</Label>
            <Input
              id="stockAlertLevel"
              type="number"
              min="0"
              value={formData.stockAlertLevel}
              onChange={(e) => handleInputChange('stockAlertLevel', parseInt(e.target.value))}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};