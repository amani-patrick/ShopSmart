
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, BadgeDollarSign, Calendar, Clock, User, AlertCircle, Bell } from 'lucide-react';
import { toast } from 'sonner';

// Sample debts data (normally would be derived from credit sales)
const initialDebts = [
  {
    id: 1,
    customerName: 'John Doe',
    amount: 35.00,
    date: '2023-04-10',
    dueDate: '2023-04-20',
    items: [{ name: 'Rice', quantity: 10, unit: 'kg', price: 3.5, total: 35 }],
    status: 'pending',
    notified: false
  },
  {
    id: 2,
    customerName: 'Sarah Williams',
    amount: 45.50,
    date: '2023-04-05',
    dueDate: '2023-04-15',
    items: [
      { name: 'Sugar', quantity: 5, unit: 'kg', price: 2.5, total: 12.5 },
      { name: 'Beans', quantity: 5, unit: 'kg', price: 4.5, total: 22.5 },
      { name: 'Salt', quantity: 2, unit: 'kg', price: 5.25, total: 10.5 }
    ],
    status: 'pending',
    notified: true
  },
  {
    id: 3,
    customerName: 'Michael Johnson',
    amount: 67.25,
    date: '2023-03-28',
    dueDate: '2023-04-07',
    items: [
      { name: 'Rice', quantity: 15, unit: 'kg', price: 3.5, total: 52.5 },
      { name: 'Sugar', quantity: 3, unit: 'kg', price: 2.5, total: 7.5 },
      { name: 'Salt', quantity: 1, unit: 'kg', price: 7.25, total: 7.25 }
    ],
    status: 'overdue',
    notified: true
  },
  {
    id: 4,
    customerName: 'Linda Brown',
    amount: 23.75,
    date: '2023-04-01',
    dueDate: '2023-04-08',
    items: [
      { name: 'Beans', quantity: 3, unit: 'kg', price: 4.5, total: 13.5 },
      { name: 'Sugar', quantity: 2, unit: 'kg', price: 2.5, total: 5 },
      { name: 'Salt', quantity: 1, unit: 'kg', price: 5.25, total: 5.25 }
    ],
    status: 'overdue',
    notified: false
  }
];

const Debts = () => {
  const [debts, setDebts] = useState(initialDebts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'customerName'>('dueDate');
  const [expandedDebtId, setExpandedDebtId] = useState<number | null>(null);
  
  // Check for overdue debts on component mount
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find overdue debts that are still marked as pending
    const overdueDebts = debts.filter(debt => {
      const dueDate = new Date(debt.dueDate);
      return debt.status === 'pending' && dueDate < today;
    });
    
    if (overdueDebts.length > 0) {
      // Update status of overdue debts
      const updatedDebts = debts.map(debt => {
        const dueDate = new Date(debt.dueDate);
        if (debt.status === 'pending' && dueDate < today) {
          return { ...debt, status: 'overdue' };
        }
        return debt;
      });
      
      setDebts(updatedDebts);
      
      // Show notification for overdue debts
      toast.error(`You have ${overdueDebts.length} overdue debt(s)!`, {
        description: "Some customers have not paid within the agreed time.",
        duration: 5000,
      });
    }
  }, []);
  
  // Filter debts based on search and status
  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || debt.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort filtered debts
  const sortedDebts = [...filteredDebts].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'amount') {
      return b.amount - a.amount;
    } else {
      return a.customerName.localeCompare(b.customerName);
    }
  });
  
  // Mark debt as paid
  const markAsPaid = (id: number) => {
    const updatedDebts = debts.map(debt => 
      debt.id === id ? { ...debt, status: 'paid' } : debt
    );
    setDebts(updatedDebts);
    toast.success("Debt marked as paid!");
  };
  
  // Send reminder notification
  const sendReminder = (id: number) => {
    const updatedDebts = debts.map(debt => 
      debt.id === id ? { ...debt, notified: true } : debt
    );
    setDebts(updatedDebts);
    toast.success("Payment reminder sent to customer!");
  };
  
  // Toggle expanded view for a debt
  const toggleExpand = (id: number) => {
    setExpandedDebtId(expandedDebtId === id ? null : id);
  };
  
  // Calculate days until due or overdue days
  const getDueDays = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Debt Management</h1>
        <p className="text-muted-foreground">
          Track customer credit, set payment deadlines, and manage debts.
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${debts.filter(d => d.status !== 'paid').reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {debts.filter(d => d.status !== 'paid').length} unpaid debts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${debts.filter(d => d.status === 'overdue').reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {debts.filter(d => d.status === 'overdue').length} overdue debts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              ${debts.filter(d => d.status === 'pending' && getDueDays(d.dueDate) <= 3 && getDueDays(d.dueDate) >= 0).reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {debts.filter(d => d.status === 'pending' && getDueDays(d.dueDate) <= 3 && getDueDays(d.dueDate) >= 0).length} debts due within 3 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-full sm:w-[140px]"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="paid">Paid</option>
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background w-full sm:w-[180px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'amount' | 'customerName')}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="customerName">Sort by Customer</option>
        </select>
      </div>
      
      {/* Debts List */}
      <div className="space-y-4">
        {sortedDebts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No debts found</h3>
              <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
                We couldn't find any debts matching your search. Try adjusting your filters.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}>Clear filters</Button>
            </CardContent>
          </Card>
        ) : (
          sortedDebts.map((debt) => (
            <Card 
              key={debt.id} 
              className={`border-l-4 ${
                debt.status === 'overdue' 
                  ? 'border-l-destructive' 
                  : debt.status === 'paid' 
                    ? 'border-l-green-500' 
                    : getDueDays(debt.dueDate) <= 3 
                      ? 'border-l-orange-500' 
                      : 'border-l-blue-500'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <CardTitle>{debt.customerName}</CardTitle>
                      <Badge 
                        variant={
                          debt.status === 'overdue' 
                            ? 'destructive' 
                            : debt.status === 'paid' 
                              ? 'default' 
                              : 'secondary'
                        }
                        className={debt.status === 'paid' ? 'bg-green-500' : ''}
                      >
                        {debt.status === 'overdue' ? 'Overdue' : debt.status === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center">
                        <BadgeDollarSign className="h-3.5 w-3.5 mr-1" />
                        ${debt.amount.toFixed(2)}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Created: {debt.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Due: {debt.dueDate}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    {debt.status !== 'paid' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => sendReminder(debt.id)} disabled={debt.notified}>
                          {debt.notified ? 'Reminded' : 'Send Reminder'}
                          <Bell className="ml-1 h-3.5 w-3.5" />
                        </Button>
                        <Button variant="default" size="sm" onClick={() => markAsPaid(debt.id)}>
                          Mark as Paid
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(debt.id)}>
                      {expandedDebtId === debt.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedDebtId === debt.id && (
                <CardContent>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Items Purchased:</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {debt.items.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity} {item.unit}</TableCell>
                              <TableCell>${item.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="font-medium text-sm mb-1">Payment Status</div>
                      <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-6 text-sm">
                        <div>
                          <span className="font-medium mr-1">Due in:</span>
                          <span className={
                            debt.status === 'paid' 
                              ? 'text-green-600' 
                              : getDueDays(debt.dueDate) < 0 
                                ? 'text-destructive font-medium' 
                                : getDueDays(debt.dueDate) <= 3 
                                  ? 'text-orange-600 font-medium'
                                  : ''
                          }>
                            {debt.status === 'paid' 
                              ? 'Paid' 
                              : getDueDays(debt.dueDate) < 0 
                                ? `${Math.abs(getDueDays(debt.dueDate))} days overdue` 
                                : getDueDays(debt.dueDate) === 0 
                                  ? 'Due today'
                                  : `${getDueDays(debt.dueDate)} days`}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">Reminder:</span>
                          <span>{debt.notified ? 'Sent' : 'Not sent'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Debts;
