/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Search, BadgeDollarSign, Calendar, Clock, AlertCircle, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { getDebts, updateDebt, getDebtById } from '@/services/api';

const Debts = () => {
  const [debts, setDebts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'customerName'>('dueDate');
  const [expandedDebtId, setExpandedDebtId] = useState<number | null>(null);
  const [selectedDebt, setSelectedDebt] = useState<any | null>(null); // State for the selected debt details
  const [isLoadingDetails, setIsLoadingDetails] = useState(false); // Loading state for fetching debt details

  // Fetch debts data from the API
  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const data = await getDebts();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update status of overdue debts
        const updatedDebts = data.map((debt) => {
          const dueDate = new Date(debt.dueDate);
          if (!debt.paid && dueDate < today) {
            return { ...debt, status: 'overdue' };
          }
          return { ...debt, status: debt.paid ? 'paid' : 'pending' };
        });

        setDebts(updatedDebts);

        // Show notification for overdue debts
        const overdueDebts = updatedDebts.filter((debt) => debt.status === 'overdue');
        if (overdueDebts.length > 0) {
          toast.error(`You have ${overdueDebts.length} overdue debt(s)!`, {
            description: "Some customers have not paid within the agreed time.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error fetching debts:', error);
        toast.error('Failed to fetch debts. Please try again later.');
      }
    };

    fetchDebts();
  }, []);

  // Fetch details of a specific debt
  const fetchDebtDetails = async (id: number) => {
    try {
      setIsLoadingDetails(true);
      const debtDetails = await getDebtById(id); // Fetch debt details using the API
      setSelectedDebt(debtDetails);
      setExpandedDebtId(id);
    } catch (error) {
      console.error('Error fetching debt details:', error);
      toast.error('Failed to fetch debt details. Please try again.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Close the details dialog
  const closeDetailsDialog = () => {
    setExpandedDebtId(null);
    setSelectedDebt(null);
  };

  // Mark debt as paid
  const markAsPaid = async (id: number) => {
    try {
      const debtToUpdate = debts.find((debt) => debt.id === id);
      if (!debtToUpdate) return;

      await updateDebt(id, { ...debtToUpdate, paid: true }); // Call the API to update the debt
      const updatedDebts = debts.map((debt) =>
        debt.id === id ? { ...debt, status: 'paid', paid: true } : debt
      );
      setDebts(updatedDebts);
      toast.success('Debt marked as paid!');
    } catch (error) {
      console.error('Error marking debt as paid:', error);
      toast.error('Failed to mark debt as paid. Please try again.');
    }
  };


  // Toggle expanded view for a debt
  const toggleExpand = (id: number) => {
    if (expandedDebtId === id) {
      // Hide details
      setExpandedDebtId(null);
      setSelectedDebt(null);
    } else {
      // Show details
      fetchDebtDetails(id);
    }
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

  // Filter debts based on search and status
  const filteredDebts = debts.filter((debt) => {
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
              ${debts.filter((d) => d.status !== 'paid').reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {debts.filter((d) => d.status !== 'paid').length} unpaid debts
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
              ${debts.filter((d) => d.status === 'overdue').reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {debts.filter((d) => d.status === 'overdue').length} overdue debts
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
              ${debts.filter((d) => d.status === 'pending' && getDueDays(d.dueDate) <= 3 && getDueDays(d.dueDate) >= 0).reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {debts.filter((d) => d.status === 'pending' && getDueDays(d.dueDate) <= 3 && getDueDays(d.dueDate) >= 0).length} debts due within 3 days
            </p>
          </CardContent>
        </Card>
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
                        Created: {debt.createdDate}
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
              
              {expandedDebtId === debt.id && selectedDebt && (
                <CardContent>
                  {isLoadingDetails ? (
                    <p>Loading details...</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                          <p className="text-lg font-semibold">{selectedDebt.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Amount</p>
                          <p className="text-lg font-semibold">${selectedDebt.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                          <p className="text-lg font-semibold">{selectedDebt.createdDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                          <p className="text-lg font-semibold">{selectedDebt.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <p
                            className={`text-lg font-semibold ${
                              selectedDebt.paid ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {selectedDebt.paid ? 'Paid' : 'Pending'}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={closeDetailsDialog}>
                        Close
                      </Button>
                    </div>
                  )}
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
