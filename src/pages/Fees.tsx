import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Calendar, CreditCard, CheckCircle, XCircle, Clock, FileText, Download, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock fees data
const mockFeesData = {
  summary: {
    totalFees: 12500,
    paidAmount: 7500,
    pendingAmount: 5000,
    dueDate: '2023-12-15',
    academicYear: '2023-2024',
    semester: 'Fall',
    scholarships: 2000,
    amountAfterScholarship: 10500
  },
  payments: [
    {
      id: 'PMT001',
      amount: 5000,
      date: '2023-08-15',
      method: 'Credit Card',
      status: 'Completed',
      description: 'First semester tuition installment',
      receiptNo: 'RCP12345'
    },
    {
      id: 'PMT002',
      amount: 2500,
      date: '2023-10-01',
      method: 'Bank Transfer',
      status: 'Completed',
      description: 'Second semester tuition installment',
      receiptNo: 'RCP12346'
    }
  ],
  pendingFees: [
    {
      id: 'FEE001',
      description: 'Remaining tuition fee',
      amount: 3500,
      dueDate: '2023-12-15',
      category: 'Tuition'
    },
    {
      id: 'FEE002',
      description: 'Laboratory fee',
      amount: 800,
      dueDate: '2023-12-15',
      category: 'Academic'
    },
    {
      id: 'FEE003',
      description: 'Library fee',
      amount: 350,
      dueDate: '2023-12-15',
      category: 'Academic'
    },
    {
      id: 'FEE004',
      description: 'Technology fee',
      amount: 350,
      dueDate: '2023-12-15',
      category: 'Academic'
    }
  ],
  feeBreakdown: [
    { category: 'Tuition', amount: 9000, color: 'bg-blue-500' },
    { category: 'Laboratory', amount: 1500, color: 'bg-green-500' },
    { category: 'Library', amount: 500, color: 'bg-amber-500' },
    { category: 'Technology', amount: 800, color: 'bg-purple-500' },
    { category: 'Student Services', amount: 400, color: 'bg-pink-500' },
    { category: 'Examination', amount: 300, color: 'bg-orange-500' }
  ]
};

// Format currency to INR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function Fees() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [feesData, setFeesData] = useState(mockFeesData);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleDownloadReceipt = (receiptNo: string) => {
    // In a real app, this would download a receipt PDF
    alert(`Downloading receipt ${receiptNo}...`);
  };
  
  const handleMakePayment = () => {
    // In a real app, this would process payment and update the backend
    setShowPaymentDialog(false);
    alert('Payment functionality will be implemented with backend integration.');
  };
  
  // Calculate days until due date
  const calculateDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysUntilDue = calculateDaysUntilDue(feesData.summary.dueDate);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading fees information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Fees & Payments</h1>
        <p className="text-muted-foreground">
          Manage your tuition fees, view payment history, and make payments
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-university-primary to-university-primary/80 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Outstanding Balance</CardTitle>
            <CardDescription className="text-white/70">
              Due on {formatDate(feesData.summary.dueDate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {formatCurrency(feesData.summary.pendingAmount)}
            </div>
            <div className="flex items-center text-sm">
              <Progress 
                value={(feesData.summary.paidAmount / feesData.summary.totalFees) * 100} 
                className="h-2 bg-white/20" 
                indicator={{ className: "bg-white" }}
              />
              <span className="ml-2">
                {((feesData.summary.paidAmount / feesData.summary.totalFees) * 100).toFixed(0)}% Paid
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-white text-university-primary hover:bg-white/90"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make a Payment</DialogTitle>
                  <DialogDescription>
                    Complete your payment through our secure payment gateway.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center text-sm pb-2 border-b">
                    <span>Total Outstanding:</span>
                    <span className="font-bold">{formatCurrency(feesData.summary.pendingAmount)}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Select Payment Method</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className={cn(
                          "border rounded-md p-3 cursor-pointer",
                          selectedPaymentMethod === "creditCard" 
                            ? "border-university-primary bg-university-primary/10" 
                            : "hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedPaymentMethod("creditCard")}
                      >
                        <div className="flex justify-center items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          <span>Credit Card</span>
                        </div>
                      </div>
                      <div 
                        className={cn(
                          "border rounded-md p-3 cursor-pointer",
                          selectedPaymentMethod === "bankTransfer" 
                            ? "border-university-primary bg-university-primary/10" 
                            : "hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedPaymentMethod("bankTransfer")}
                      >
                        <div className="flex justify-center items-center">
                          <DollarSign className="h-5 w-5 mr-2" />
                          <span>Bank Transfer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                    <div className="bg-gray-50 rounded-md p-3">
                      {selectedPaymentMethod === "creditCard" ? (
                        <p className="text-sm text-muted-foreground">
                          You'll be redirected to our secure payment gateway to complete your credit card payment.
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Bank transfer details will be provided after you proceed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleMakePayment}>
                    Proceed to Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Status</CardTitle>
            <CardDescription>
              {feesData.summary.academicYear}, {feesData.summary.semester} Semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Total Fees</div>
                  <div className="text-lg font-bold">{formatCurrency(feesData.summary.totalFees)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground text-right">Scholarship/Aid</div>
                  <div className="text-lg font-bold text-right">-{formatCurrency(feesData.summary.scholarships)}</div>
                </div>
              </div>
              
              <div className="h-px bg-gray-200"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Net Amount</div>
                  <div className="text-lg font-bold">{formatCurrency(feesData.summary.amountAfterScholarship)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground text-right">Paid Amount</div>
                  <div className="text-lg font-bold text-right text-green-600">{formatCurrency(feesData.summary.paidAmount)}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Payment Progress</span>
                <span>{((feesData.summary.paidAmount / feesData.summary.amountAfterScholarship) * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={(feesData.summary.paidAmount / feesData.summary.amountAfterScholarship) * 100} 
                className="h-2" 
                indicator={{ className: "bg-university-primary" }}
              />
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Due Date</CardTitle>
            <CardDescription>Next payment deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 mr-4 text-university-primary" />
              <div>
                <div className="text-lg font-bold">{formatDate(feesData.summary.dueDate)}</div>
                <div className="text-sm">
                  {daysUntilDue > 0 ? (
                    <span className={daysUntilDue < 7 ? "text-amber-600" : "text-muted-foreground"}>
                      {daysUntilDue} days remaining
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Overdue by {Math.abs(daysUntilDue)} days
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Fee Structure
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="pending" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Fees</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          <TabsTrigger value="breakdown">Fee Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Pending Fee Details</CardTitle>
              <CardDescription>
                Items due by {formatDate(feesData.summary.dueDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feesData.pendingFees.map(fee => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{fee.category}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(fee.dueDate)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(fee.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="font-semibold">Total Pending Amount</div>
              <div className="font-bold text-lg">
                {formatCurrency(feesData.summary.pendingAmount)}
              </div>
            </CardFooter>
          </Card>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Payment Reminder</h4>
              <p className="text-sm text-amber-700">
                Please ensure that your payment is made before the due date to avoid any late fees.
                For payment-related questions, contact the finance office at finance@university.edu or call (555) 123-4567.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payment-history">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Payment History</CardTitle>
              <CardDescription>
                Record of your previous payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feesData.payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell className="font-medium">{payment.description}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge className={payment.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                          <div className="flex items-center">
                            {payment.status === 'Completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {payment.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownloadReceipt(payment.receiptNo)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download receipt</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="font-semibold">Total Paid Amount</div>
              <div className="font-bold text-lg text-green-600">
                {formatCurrency(feesData.summary.paidAmount)}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Fee Breakdown</CardTitle>
              <CardDescription>
                Detailed breakdown of all fee components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                {feesData.feeBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3">
                      <div className="text-sm font-medium">{item.category}</div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.color}`} 
                          style={{ width: `${(item.amount / feesData.summary.totalFees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/4 text-right">
                      <div className="text-sm font-medium">{formatCurrency(item.amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((item.amount / feesData.summary.totalFees) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h4 className="font-semibold">Payment & Scholarship Summary</h4>
                
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm">Total Fee Amount:</div>
                  <div className="text-sm font-medium text-right">{formatCurrency(feesData.summary.totalFees)}</div>
                  
                  <div className="text-sm">Scholarship Amount:</div>
                  <div className="text-sm font-medium text-right text-green-600">
                    -{formatCurrency(feesData.summary.scholarships)}
                  </div>
                  
                  <div className="text-sm">Amount After Scholarship:</div>
                  <div className="text-sm font-medium text-right">{formatCurrency(feesData.summary.amountAfterScholarship)}</div>
                  
                  <div className="text-sm">Total Paid Amount:</div>
                  <div className="text-sm font-medium text-right text-green-600">
                    -{formatCurrency(feesData.summary.paidAmount)}
                  </div>
                  
                  <div className="text-sm font-medium pt-2 border-t">Outstanding Balance:</div>
                  <div className="text-sm font-bold text-right pt-2 border-t">{formatCurrency(feesData.summary.pendingAmount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
