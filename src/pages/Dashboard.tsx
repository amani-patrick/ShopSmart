import React from 'react';
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

const Dashboard = () => {
  const { t } = useTranslation();
  
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
            <div className="text-2xl font-bold">$15,231.89</div>
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
            <div className="text-2xl font-bold">+573</div>
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
            <div className="text-2xl font-bold">345 {t('dashboard.items')}</div>
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
            <div className="text-2xl font-bold">$2,350.00</div>
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
            {/* Activity 1 */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <div className="mr-4 bg-brand-100 p-2 rounded-full">
                  <ShoppingCart className="h-4 w-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium">Sale completed</p>
                  <p className="text-sm text-muted-foreground">3 items sold for $152.00</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            
            {/* Activity 2 */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <div className="mr-4 bg-green-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Inventory updated</p>
                  <p className="text-sm text-muted-foreground">Added 24 new items to inventory</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">5 hours ago</div>
            </div>
            
            {/* Activity 3 */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <div className="mr-4 bg-amber-100 p-2 rounded-full">
                  <Clock3 className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">New debt recorded</p>
                  <p className="text-sm text-muted-foreground">$85.00 debt for John Doe</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Yesterday</div>
            </div>
            
            {/* Activity 4 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 bg-red-100 p-2 rounded-full">
                  <Package className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Low stock alert</p>
                  <p className="text-sm text-muted-foreground">Rice (5kg) is running low on stock</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Yesterday</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
