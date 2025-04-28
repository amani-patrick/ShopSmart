/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getSales, getInventories } from '@/services/api';

export const LineChartComponent = () => {
  const [salesData, setSalesData] = useState<
    { name: string; Sales: number; Profit: number }[]
  >([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch sales and inventory data
        const sales = await getSales();
        const inventories = await getInventories();

        // Map inventory data for quick lookup
        const inventoryMap = inventories.reduce((map, item) => {
          map[item.id] = item;
          return map;
        }, {} as Record<number, any>);

        // Calculate sales and profits
        const formattedData = sales.map((sale) => {
          const product = inventoryMap[sale.productId];
          const profit = product
            ? sale.totalAmount - product.costPrice * sale.quantitySold
            : 0;

          return {
            name: new Date(sale.saleDate).toLocaleDateString(), // Format date
            Sales: sale.totalAmount,
            Profit: profit,
          };
        });

        setSalesData(formattedData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={salesData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Sales"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Profit"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartComponent = () => {
  const [categoryData, setCategoryData] = useState<
    { name: string; Sales: number; Profit: number }[]
  >([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch inventory and sales data
        const inventories = await getInventories();
        const sales = await getSales();

        // Map sales data to their respective inventory items
        const salesMap = sales.reduce((map, sale) => {
          if (!map[sale.productId]) {
            map[sale.productId] = [];
          }
          map[sale.productId].push(sale);
          return map;
        }, {} as Record<number, any[]>);

        // Aggregate sales and profits by category
        const categoryMap: Record<
          string,
          { Sales: number; Profit: number }
        > = {};

        inventories.forEach((inventory) => {
          const category = inventory.category;
          const inventorySales = salesMap[inventory.id] || [];
          const totalSales = inventorySales.reduce(
            (sum: number, sale: any) => sum + sale.totalAmount,
            0
          );
          const totalProfit = inventorySales.reduce(
            (sum: number, sale: any) =>
              sum + (sale.totalAmount - inventory.costPrice * sale.quantitySold),
            0
          );

          if (!categoryMap[category]) {
            categoryMap[category] = { Sales: 0, Profit: 0 };
          }

          categoryMap[category].Sales += totalSales;
          categoryMap[category].Profit += totalProfit;
        });

        // Format data for the chart
        const formattedData = Object.entries(categoryMap).map(
          ([category, data]) => ({
            name: category,
            Sales: data.Sales,
            Profit: data.Profit,
          })
        );

        setCategoryData(formattedData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categoryData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="Sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
