
import React from 'react';
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
  Legend 
} from 'recharts';

// Sample data
const salesData = [
  { name: '1', Sales: 4000, Profit: 2400 },
  { name: '2', Sales: 3000, Profit: 1398 },
  { name: '3', Sales: 2000, Profit: 9800 },
  { name: '4', Sales: 2780, Profit: 3908 },
  { name: '5', Sales: 1890, Profit: 4800 },
  { name: '6', Sales: 2390, Profit: 3800 },
  { name: '7', Sales: 3490, Profit: 4300 },
  { name: '8', Sales: 2490, Profit: 3300 },
  { name: '9', Sales: 2090, Profit: 2300 },
  { name: '10', Sales: 3090, Profit: 2900 },
  { name: '11', Sales: 2590, Profit: 3100 },
  { name: '12', Sales: 3290, Profit: 4100 },
  { name: '13', Sales: 3490, Profit: 4300 },
  { name: '14', Sales: 3690, Profit: 4500 },
  { name: '15', Sales: 3090, Profit: 3700 },
  { name: '16', Sales: 2890, Profit: 3500 },
  { name: '17', Sales: 3590, Profit: 4200 },
  { name: '18', Sales: 2790, Profit: 3100 },
  { name: '19', Sales: 3090, Profit: 3600 },
  { name: '20', Sales: 3490, Profit: 4000 },
  { name: '21', Sales: 2890, Profit: 3400 },
  { name: '22', Sales: 2590, Profit: 3000 },
  { name: '23', Sales: 3290, Profit: 3800 },
  { name: '24', Sales: 3690, Profit: 4200 },
  { name: '25', Sales: 3190, Profit: 3700 },
  { name: '26', Sales: 2890, Profit: 3300 },
  { name: '27', Sales: 3390, Profit: 3900 },
  { name: '28', Sales: 3690, Profit: 4200 },
  { name: '29', Sales: 3490, Profit: 4000 },
  { name: '30', Sales: 3790, Profit: 4300 },
];

const barData = [
  { name: 'Food', value: 2400 },
  { name: 'Beverages', value: 1398 },
  { name: 'Clothing', value: 9800 },
  { name: 'Electronics', value: 3908 },
  { name: 'Household', value: 4800 },
  { name: 'Personal Care', value: 3800 },
];

export const LineChartComponent = () => {
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
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={barData}
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
          <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
