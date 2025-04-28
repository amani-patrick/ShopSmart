/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Settings, Users, Shield, ChevronDown, Package, Truck, Cog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InventoryItem, SalesData } from '@/services/dashboardService';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Import dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Import drawer components for mobile views
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Import forms
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

const Admin = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [systemHealth, setSystemHealth] = useState<string>('Good');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<InventoryItem[]>([]);
  const [ordersList, setOrdersList] = useState<SalesData[]>([]);
  
  // System settings state
  const [settings, setSettings] = useState({
    enableNotifications: true,
    darkMode: false,
    maintenanceMode: false,
    debugMode: false,
    backupFrequency: "daily",
  });

  // Function to handle settings changes
  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast.success(t('admin.settingUpdated', 'Setting updated successfully'));
  };

  // Handle actions
  const handleUserAction = (action: string, userId: string) => {
    toast.success(`${action} action performed on user ${userId}`);
  };

  const handleProductAction = (action: string, productId: string) => {
    toast.success(`${action} action performed on product ${productId}`);
  };

  const handleOrderAction = (action: string, orderId: string) => {
    toast.success(`${action} action performed on order ${orderId}`);
  };

  // Simulate fetching admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      // In a real app, these would be actual API calls
      try {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        setActiveUsers(Math.floor(Math.random() * 100) + 50);
        setPendingOrders(Math.floor(Math.random() * 20) + 5);
        setSystemHealth(['Good', 'Warning', 'Critical'][Math.floor(Math.random() * 3)]);
        
        // Mock users
        const mockUsers = Array(20).fill(null).map((_, i) => ({
          id: `user-${i + 1}`,
          name: `User ${i + 1}`,
          email: `user${i+1}@example.com`,
          role: i === 0 ? 'admin' : 'user',
          lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          status: Math.random() > 0.2 ? 'active' : 'inactive'
        }));
        setUsersList(mockUsers);
        
        // Mock products for inventory management
        const categories = ['Electronics', 'Groceries', 'Clothing', 'Household', 'Office'];
        const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];
        
        const mockProducts = Array(30).fill(null).map((_, i) => ({
          id: `item-${i + 1}`,
          name: `Product ${i + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          quantity: Math.floor(Math.random() * 100),
          price: Math.floor(Math.random() * 200) + 10,
          costPrice: Math.floor(Math.random() * 150) + 5,
          supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
          lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        }));
        setProductsList(mockProducts);
        
        // Mock orders
        const mockOrders = Array(15).fill(null).map((_, i) => ({
          id: `order-${i + 1}`,
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
        setOrdersList(mockOrders);
        
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
    
    fetchAdminData();
  }, []);
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertTitle>{t('admin.accessDenied')}</AlertTitle>
        <AlertDescription>
          {t('admin.noPermission')}
        </AlertDescription>
      </Alert>
    );
  }

  // Use either Dialog or Drawer based on screen size
  const DialogOrDrawer = isMobile ? Drawer : Dialog;
  const DialogOrDrawerTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const DialogOrDrawerContent = isMobile ? DrawerContent : DialogContent;
  const DialogOrDrawerHeader = isMobile ? DrawerHeader : DialogHeader;
  const DialogOrDrawerFooter = isMobile ? DrawerFooter : DialogFooter;
  const DialogOrDrawerTitle = isMobile ? DrawerTitle : DialogTitle;
  const DialogOrDrawerDescription = isMobile ? DrawerDescription : DialogDescription;
  const DialogOrDrawerClose = isMobile ? DrawerClose : DialogClose;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.subtitle')}
          </p>
        </div>
        <DialogOrDrawer>
          <DialogOrDrawerTrigger asChild>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              {t('admin.systemSettings')}
            </Button>
          </DialogOrDrawerTrigger>
          <DialogOrDrawerContent className="sm:max-w-[425px]">
            <DialogOrDrawerHeader>
              <DialogOrDrawerTitle>{t('admin.systemSettings')}</DialogOrDrawerTitle>
              <DialogOrDrawerDescription>
                {t('admin.configureSystem', 'Configure system settings and preferences.')}
              </DialogOrDrawerDescription>
            </DialogOrDrawerHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">{t('admin.enableNotifications', 'Notifications')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.notificationsDescription', 'Enable system notifications')}
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={settings.enableNotifications}
                  onCheckedChange={(value) => handleSettingChange('enableNotifications', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">{t('admin.darkMode', 'Dark Mode')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.darkModeDescription', 'Enable dark mode across the application')}
                  </p>
                </div>
                <Switch 
                  id="darkMode" 
                  checked={settings.darkMode}
                  onCheckedChange={(value) => handleSettingChange('darkMode', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">{t('admin.maintenanceMode', 'Maintenance Mode')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.maintenanceDescription', 'Put the application in maintenance mode')}
                  </p>
                </div>
                <Switch 
                  id="maintenance" 
                  checked={settings.maintenanceMode}
                  onCheckedChange={(value) => handleSettingChange('maintenanceMode', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="debug">{t('admin.debugMode', 'Debug Mode')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.debugDescription', 'Enable additional logging and debugging')}
                  </p>
                </div>
                <Switch 
                  id="debug" 
                  checked={settings.debugMode}
                  onCheckedChange={(value) => handleSettingChange('debugMode', value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup">{t('admin.backupFrequency', 'Backup Frequency')}</Label>
                <select 
                  id="backup" 
                  className="w-full bg-background border border-input rounded-md h-10 px-3" 
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                >
                  <option value="hourly">{t('admin.hourly', 'Hourly')}</option>
                  <option value="daily">{t('admin.daily', 'Daily')}</option>
                  <option value="weekly">{t('admin.weekly', 'Weekly')}</option>
                  <option value="monthly">{t('admin.monthly', 'Monthly')}</option>
                </select>
              </div>
            </div>
            <DialogOrDrawerFooter>
              <DialogOrDrawerClose asChild>
                <Button type="submit">{t('common.save')}</Button>
              </DialogOrDrawerClose>
            </DialogOrDrawerFooter>
          </DialogOrDrawerContent>
        </DialogOrDrawer>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.activeUsers', 'Active Users')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.loggedInUsers', 'Currently logged in users')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.pendingOrders', 'Pending Orders')}</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.needApproval', 'Orders waiting for approval')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.systemHealth', 'System Health')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{systemHealth}</div>
              <div className="ml-2">
                <Badge 
                  variant={
                    systemHealth === 'Good' ? 'default' : 
                    systemHealth === 'Warning' ? 'outline' : 
                    'destructive'
                  }
                >
                  {systemHealth}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.serverStatus', 'Server status and performance')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.databaseUsage', 'Database Usage')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.storageUsed', 'Storage space utilized')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Features */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 h-auto">
          <TabsTrigger value="users">{t('admin.userManagement')}</TabsTrigger>
          <TabsTrigger value="inventory">{t('admin.inventoryManagement')}</TabsTrigger>
          <TabsTrigger value="orders">{t('admin.orderTracking')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('admin.userManagement')}</CardTitle>
                  <CardDescription>
                    {t('admin.manageAccounts')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {t('admin.exportUsers')}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        {t('admin.addUser')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('admin.addUser')}</DialogTitle>
                        <DialogDescription>
                          {t('admin.addNewUser', 'Create a new user account in the system.')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="firstName" className="text-right">
                            {t('common.firstName')}
                          </Label>
                          <Input id="firstName" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="lastName" className="text-right">
                            {t('common.lastName')}
                          </Label>
                          <Input id="lastName" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            {t('common.email')}
                          </Label>
                          <Input id="email" type="email" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right">
                            {t('admin.role')}
                          </Label>
                          <select 
                            id="role" 
                            className="col-span-3 bg-background border border-input rounded-md h-10 px-3"
                          >
                            <option value="user">{t('admin.user', 'User')}</option>
                            <option value="admin">{t('admin.adminRole', 'Admin')}</option>
                          </select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => toast.success(t('admin.userAdded', 'User added successfully'))}>
                            {t('admin.createUser', 'Create User')}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-10 px-4 text-left font-medium">{t('admin.userName')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.email')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.role')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.lastLogin')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.status')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                            {t(`admin.${user.status}`)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {t('admin.actions')} <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUserAction('edit', user.id)}>
                                {t('admin.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction('resetPassword', user.id)}>
                                {t('admin.resetPassword')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction('deactivate', user.id)}>
                                {t('admin.deactivate')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('admin.inventoryManagement')}</CardTitle>
                  <CardDescription>
                    {t('admin.manageProducts')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {t('admin.exportProducts')}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Package className="mr-2 h-4 w-4" />
                        {t('admin.addProduct')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('admin.addProduct')}</DialogTitle>
                        <DialogDescription>
                          {t('admin.addNewProduct', 'Add a new product to inventory.')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="productName" className="text-right">
                            {t('admin.productName')}
                          </Label>
                          <Input id="productName" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            {t('admin.category')}
                          </Label>
                          <Input id="category" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            {t('admin.price')}
                          </Label>
                          <Input id="price" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="stock" className="text-right">
                            {t('admin.stock')}
                          </Label>
                          <Input id="stock" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="supplier" className="text-right">
                            {t('admin.supplier')}
                          </Label>
                          <Input id="supplier" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => toast.success(t('admin.productAdded', 'Product added successfully'))}>
                            {t('admin.addToInventory', 'Add to Inventory')}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-10 px-4 text-left font-medium">{t('admin.productName')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.category')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.price')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.stock')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.supplier')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.slice(0, 10).map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-4">{product.name}</td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">${product.price.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge variant={product.quantity > 10 ? 'default' : 'destructive'}>
                            {product.quantity}
                          </Badge>
                        </td>
                        <td className="p-4">{product.supplier}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {t('admin.actions')} <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleProductAction('edit', product.id)}>
                                {t('admin.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProductAction('restock', product.id)}>
                                {t('admin.restock')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProductAction('delete', product.id)}>
                                {t('admin.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('admin.orderTracking')}</CardTitle>
                  <CardDescription>
                    {t('admin.viewOrders')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {t('admin.exportOrders')}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Truck className="mr-2 h-4 w-4" />
                        {t('admin.bulkActions')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('admin.bulkActions')}</DialogTitle>
                        <DialogDescription>
                          {t('admin.performBulkActions', 'Perform actions on multiple orders at once.')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>{t('admin.selectAction', 'Select Action')}</Label>
                          <select className="w-full bg-background border border-input rounded-md h-10 px-3">
                            <option value="mark_shipped">{t('admin.markShipped', 'Mark as Shipped')}</option>
                            <option value="mark_delivered">{t('admin.markDelivered', 'Mark as Delivered')}</option>
                            <option value="cancel">{t('admin.cancelOrders', 'Cancel Orders')}</option>
                            <option value="export">{t('admin.exportSelected', 'Export Selected')}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('admin.selectOrders', 'Select Orders')}</Label>
                          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                            {ordersList.slice(0, 5).map(order => (
                              <div key={order.id} className="flex items-center space-x-2 py-1">
                                <input type="checkbox" id={`order-${order.id}`} className="rounded border-gray-300" />
                                <Label htmlFor={`order-${order.id}`}>
                                  {order.id} - {order.customer} (${order.amount.toFixed(2)})
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => toast.success(t('admin.actionsApplied', 'Actions applied successfully'))}>
                            {t('admin.applyActions', 'Apply Actions')}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-10 px-4 text-left font-medium">{t('admin.orderId')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.customer')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.date')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.amount')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.items')}</th>
                      <th className="h-10 px-4 text-left font-medium">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="p-4">{order.id}</td>
                        <td className="p-4">{order.customer}</td>
                        <td className="p-4">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">${order.amount.toFixed(2)}</td>
                        <td className="p-4">{order.products.length}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {t('admin.actions')} <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOrderAction('view', order.id)}>
                                {t('admin.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOrderAction('track', order.id)}>
                                {t('admin.trackDelivery')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOrderAction('cancel', order.id)}>
                                {t('admin.cancelOrder')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
