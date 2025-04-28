/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  LineChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  Line,
  PieChart,
  Pie,
} from 'recharts';
import { toast } from 'sonner';
import { getSales, getInventories, generateReport, getSalesSummary } from '@/services/api';

// Define types for clarity
type ReportPeriod = 'daily' | 'weekly' | 'monthly';

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('daily');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesData, setSalesData] = useState<
    Array<{ name: string; sales: number; profit: number }>
  >([]);
  const [categoryPerformanceData, setCategoryPerformanceData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [topSellingProducts, setTopSellingProducts] = useState<
    Array<{ name: string; quantity: number; sales: number }>
  >([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [salesSummary, setSalesSummary] = useState({
    totalSalesToday: 0,
    totalSalesThisWeek: 0,
    totalSalesThisMonth: 0,
    totalItemsSoldToday: 0,
  });

  // Fetch sales summary
  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        const summary = await getSalesSummary();
        setSalesSummary(summary);
      } catch (error) {
        console.error('Error fetching sales summary:', error);
        toast.error('Failed to fetch sales summary. Please try again.');
      }
    };

    fetchSalesSummary();
  }, []);

  // Fetch sales and inventory data dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sales = await getSales();
        const inventories = await getInventories();

        // Map inventory data for quick lookup
        const inventoryMap: Record<string, any> = inventories.reduce(
          (map, item) => {
            map[item.id] = item;
            return map;
          },
          {}
        );

        // Calculate sales and profits
        const formattedSalesData = sales.map((sale: any) => {
          const product = inventoryMap[sale.productId];
          const profit = product
            ? sale.totalAmount - product.costPrice * sale.quantitySold
            : 0;

          return {
            name: new Date(sale.saleDate).toLocaleDateString(),
            sales: sale.totalAmount,
            profit,
          };
        });

        // Aggregate sales and profits by category
        const categoryMap: Record<string, { sales: number; profit: number }> = {};
        inventories.forEach((inventory: any) => {
          const category = inventory.category;
          const totalSales = (inventory.sales || []).reduce(
            (sum: number, sale: any) => sum + (sale.totalAmount || 0),
            0
          );
          const totalProfit = (inventory.sales || []).reduce(
            (sum: number, sale: any) =>
              sum +
              ((sale.totalAmount || 0) - inventory.costPrice * (sale.quantitySold || 0)),
            0
          );

          if (!categoryMap[category]) {
            categoryMap[category] = { sales: 0, profit: 0 };
          }

          categoryMap[category].sales += totalSales;
          categoryMap[category].profit += totalProfit;
        });

        const formattedCategoryData = Object.entries(categoryMap).map(
          ([category, data]) => ({
            name: category,
            value: data.sales,
          })
        );

        // Calculate top-selling products
        const topProducts = inventories
          .map((inventory: any) => ({
            name: inventory.name,
            quantity: inventory.sales.reduce(
              (sum: number, sale: any) => sum + sale.quantitySold,
              0
            ),
            sales: inventory.sales.reduce(
              (sum: number, sale: any) => sum + sale.totalAmount,
              0
            ),
          }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        // Calculate total sales, profit, and profit margin
        const totalSales = formattedSalesData.reduce(
          (sum: number, item: any) => sum + item.sales,
          0
        );
        const totalProfit = formattedSalesData.reduce(
          (sum: number, item: any) => sum + item.profit,
          0
        );
        const profitMargin = totalSales
          ? Math.round((totalProfit / totalSales) * 100)
          : 0;

        // Update state
        setSalesData(formattedSalesData);
        setCategoryPerformanceData(formattedCategoryData);
        setTopSellingProducts(topProducts);
        setTotalSales(totalSales);
        setTotalProfit(totalProfit);
        setProfitMargin(profitMargin);
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast.error('Failed to fetch report data. Please try again.');
      }
    };

    fetchData();
  }, [reportPeriod, startDate, endDate]);

  // Handle report generation
  const generateReportHandler = async () => {
    try {
      await generateReport({
        period: reportPeriod,
        startDate,
        endDate,
      });
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    }
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

      {/* Sales Summary */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="bg-blue-50">
          <CardHeader className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m12 6h-4m4 6h-4m4 6h-4"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-blue-600">
                Today's Sales
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Total revenue generated today
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              ${salesSummary.totalSalesToday.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m12 6h-4m4 6h-4m4 6h-4"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-green-600">
                This Week's Sales
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Total revenue generated this week
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              ${salesSummary.totalSalesThisWeek.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardHeader className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m12 6h-4m4 6h-4m4 6h-4"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-yellow-600">
                This Month's Sales
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Total revenue generated this month
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-800">
              ${salesSummary.totalSalesThisMonth.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m12 6h-4m4 6h-4m4 6h-4"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-purple-600">
                Items Sold Today
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Total items sold today
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {salesSummary.totalItemsSoldToday}
            </div>
          </CardContent>
        </Card>
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
              <Tabs
                defaultValue="daily"
                value={reportPeriod}
                onValueChange={(value) => setReportPeriod(value as ReportPeriod)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-1 flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="startDate" className="mb-2 block">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate" className="mb-2 block">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={generateReportHandler}>Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
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
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryPerformanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left font-medium">Product</th>
                  <th className="h-10 px-4 text-right font-medium">Quantity Sold</th>
                  <th className="h-10 px-4 text-right font-medium">Sales Amount</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.length > 0 ? (
                  topSellingProducts.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 align-middle font-medium">{product.name}</td>
                      <td className="p-4 align-middle text-right">{product.quantity}</td>
                      <td className="p-4 align-middle text-right">
                        ${product.sales.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center">
                      No top-selling products available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;