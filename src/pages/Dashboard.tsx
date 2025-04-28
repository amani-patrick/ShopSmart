/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Clock3, 
  ArrowDown, 
  ArrowUp, 
  Plus, 
  BarChart 
} from 'lucide-react';
import { BarChartComponent, LineChartComponent } from '@/components/Charts';
import { getSales, getDebts, getInventoryByCategory,getInventories } from '@/services/api';

const Dashboard = () => {
  const { t } = useTranslation();

  // State for dynamic data
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [activeInventory, setActiveInventory] = useState(0);
  const [activeDebts, setActiveDebts] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales data
        const sales = await getSales();
        const revenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const salesCount = sales.length;

        setTotalRevenue(revenue);
        setTotalSales(salesCount);

        // Fetch inventory data
        const inventory = await getInventories(); 
        const inventoryCount = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);

        setActiveInventory(inventoryCount);

        // Fetch debts data
        const debts = await getDebts();
        const unpaidDebts = debts.filter((debt) => !debt.paid); // Filter out paid debts
        const totalUnpaidDebts = unpaidDebts.reduce((sum, debt) => sum + debt.amount, 0);

        setActiveDebts(totalUnpaidDebts);

        // Fetch recent activities
        const recentSales = sales
          .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()) // Sort by latest saleDate
          .slice(0, 3) // Get the latest 3 sales
          .map((sale) => ({
            type: 'sale',
            description: `${sale.quantitySold} items sold for $${sale.totalAmount.toFixed(2)}`,
            time: new Date(sale.saleDate).toLocaleString(),
          }));

        const recentDebts = debts
          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()) // Sort by latest createdDate
          .slice(0, 2) // Get the latest 2 debts
          .map((debt) => ({
            type: 'debt',
            description: `$${debt.amount.toFixed(2)} debt for ${debt.customerName}`,
            time: new Date(debt.createdDate).toLocaleString(),
          }));

        const recentInventory = inventory
          .slice(-3) // Get the last 3 items in the array
          .map((item) => ({
            type: 'inventory',
            description: `Added ${item.stockQuantity} ${item.unit} of ${item.name} to inventory`,
            time: 'N/A', // No date available
          }));

        setRecentActivity([...recentSales, ...recentDebts, ...recentInventory]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <BarChart className="mr-2 h-4 w-4" />
            {t('dashboard.downloadReport')}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.newSale')}
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +20.1% <ArrowUp className="h-3 w-3 ml-1" />
              </span> {t('dashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.sales')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +8.2% <ArrowUp className="h-3 w-3 ml-1" />
              </span> {t('dashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.activeInventory')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInventory} {t('dashboard.items')}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                -3.2% <ArrowDown className="h-3 w-3 ml-1" />
              </span> {t('dashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.activeDebts')}</CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${activeDebts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                +12.5% <ArrowUp className="h-3 w-3 ml-1" />
              </span> {t('dashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">{t('dashboard.overview')}</TabsTrigger>
          <TabsTrigger value="sales">{t('dashboard.sales')}</TabsTrigger>
          <TabsTrigger value="inventory">{t('dashboard.inventory')}</TabsTrigger>
          <TabsTrigger value="debts">{t('dashboard.debts')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Your sales performance for the past 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product Category</CardTitle>
              <CardDescription>
                Top selling categories in the last month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Levels</CardTitle>
              <CardDescription>
                Current inventory levels by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="debts">
          <Card>
            <CardHeader>
              <CardTitle>Debt Aging</CardTitle>
              <CardDescription>
                Outstanding debts by age range.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>
            {t('dashboard.recentActivityDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className={`mr-4 p-2 rounded-full ${activity.type === 'sale' ? 'bg-brand-100' : activity.type === 'inventory' ? 'bg-green-100' : activity.type === 'debt' ? 'bg-amber-100' : 'bg-red-100'}`}>
                    {activity.type === 'sale' && <ShoppingCart className="h-4 w-4 text-brand-600" />}
                    {activity.type === 'inventory' && <Package className="h-4 w-4 text-green-600" />}
                    {activity.type === 'debt' && <Clock3 className="h-4 w-4 text-amber-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.type === 'sale' ? 'Sale completed' : activity.type === 'inventory' ? 'Inventory updated' : 'New debt recorded'}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
