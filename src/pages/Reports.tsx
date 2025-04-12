
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Line, PieChart, Pie } from 'recharts';
import { 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp,
  Package, 
  ShoppingCart, 
  BadgeDollarSign,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

// Sample sales data for reports
const dailySalesData = [
  { name: 'Mon', sales: 120, profit: 45 },
  { name: 'Tue', sales: 150, profit: 60 },
  { name: 'Wed', sales: 180, profit: 72 },
  { name: 'Thu', sales: 90, profit: 35 },
  { name: 'Fri', sales: 200, profit: 80 },
  { name: 'Sat', sales: 250, profit: 100 },
  { name: 'Sun', sales: 130, profit: 52 },
];

const weeklySalesData = [
  { name: 'Week 1', sales: 1200, profit: 480 },
  { name: 'Week 2', sales: 1500, profit: 600 },
  { name: 'Week 3', sales: 1350, profit: 540 },
  { name: 'Week 4', sales: 1800, profit: 720 },
];

const monthlySalesData = [
  { name: 'Jan', sales: 5000, profit: 2000 },
  { name: 'Feb', sales: 6000, profit: 2400 },
  { name: 'Mar', sales: 5500, profit: 2200 },
  { name: 'Apr', sales: 6200, profit: 2480 },
  { name: 'May', sales: 7000, profit: 2800 },
  { name: 'Jun', sales: 6800, profit: 2720 },
];

// Sample category performance data
const categoryPerformanceData = [
  { name: 'Grains', value: 35 },
  { name: 'Sweeteners', value: 20 },
  { name: 'Legumes', value: 15 },
  { name: 'Beverages', value: 10 },
  { name: 'Snacks', value: 15 },
  { name: 'Others', value: 5 },
];

// Sample colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Top selling product data
const topSellingProducts = [
  { name: 'Rice', quantity: 85, sales: 297.5 },
  { name: 'Sugar', quantity: 55, sales: 137.5 },
  { name: 'Beans', quantity: 45, sales: 202.5 },
  { name: 'Salt', quantity: 35, sales: 183.75 },
  { name: 'Flour', quantity: 30, sales: 150 },
];

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('day');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Get appropriate data based on selected period
  const getSalesData = () => {
    switch (reportPeriod) {
      case 'day':
        return dailySalesData;
      case 'week':
        return weeklySalesData;
      case 'month':
        return monthlySalesData;
      default:
        return dailySalesData;
    }
  };
  
  // Calculate summary numbers
  const salesData = getSalesData();
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
  const profitMargin = Math.round((totalProfit / totalSales) * 100);
  
  // Handle report generation
  const generateReport = () => {
    toast.success(`${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)}ly report generated!`, {
      description: `Report for period ${startDate} to ${endDate}`
    });
  };
  
  // Download report
  const downloadReport = () => {
    toast.success(`${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)}ly report is being downloaded!`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate reports and analyze your business performance.
        </p>
      </div>
      
      {/* Report Period Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>
            Select time period and date range for your report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Label className="mb-2 block">Report Period</Label>
              <Tabs defaultValue="day" value={reportPeriod} onValueChange={setReportPeriod} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">Daily</TabsTrigger>
                  <TabsTrigger value="week">Weekly</TabsTrigger>
                  <TabsTrigger value="month">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-1 flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="startDate" className="mb-2 block">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate" className="mb-2 block">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={generateReport}>Generate Report</Button>
              <Button variant="outline" onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+12%</span> since last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+8%</span> since last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">-2%</span> since last period
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Sales and profit for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getSalesData()}
                margin={{
                  top: 10,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#1e40af" name="Sales ($)" />
                <Bar dataKey="profit" fill="#4ade80" name="Profit ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Category Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Distribution of sales across product categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>
            Best performing products during the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left font-medium">Product</th>
                  <th className="h-10 px-4 text-right font-medium">Quantity Sold</th>
                  <th className="h-10 px-4 text-right font-medium">Sales Amount</th>
                  <th className="h-10 px-4 text-right font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4 align-middle font-medium">{product.name}</td>
                    <td className="p-4 align-middle text-right">{product.quantity}</td>
                    <td className="p-4 align-middle text-right">${product.sales.toFixed(2)}</td>
                    <td className="p-4 align-middle text-right">
                      {Math.round((product.sales / totalSales) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Trend Analysis Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trends</CardTitle>
          <CardDescription>
            Performance over time with trend analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={reportPeriod === 'month' ? monthlySalesData : reportPeriod === 'week' ? weeklySalesData : dailySalesData}
              margin={{
                top: 10,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#1e40af" 
                activeDot={{ r: 8 }} 
                name="Sales ($)"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#4ade80" 
                name="Profit ($)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
