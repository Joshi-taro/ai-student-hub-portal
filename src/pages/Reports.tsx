
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, BarChartHorizontal, LineChart, PieChart } from "lucide-react";
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for charts
const enrollmentData = [
  { name: 'Computer Science', students: 450, professors: 18 },
  { name: 'Business', students: 380, professors: 15 },
  { name: 'Psychology', students: 320, professors: 12 },
  { name: 'Engineering', students: 280, professors: 14 },
  { name: 'Medicine', students: 140, professors: 9 },
  { name: 'Arts', students: 210, professors: 10 },
];

const gpaData = [
  { year: '1st Year', avgGPA: 3.2 },
  { year: '2nd Year', avgGPA: 3.4 },
  { year: '3rd Year', avgGPA: 3.5 },
  { year: '4th Year', avgGPA: 3.7 },
];

const attendanceData = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 88 },
  { month: 'Mar', rate: 86 },
  { month: 'Apr', rate: 89 },
  { month: 'May', rate: 84 },
  { month: 'Jun', rate: 80 },
  { month: 'Jul', rate: 0 },
  { month: 'Aug', rate: 0 },
  { month: 'Sep', rate: 91 },
  { month: 'Oct', rate: 87 },
  { month: 'Nov', rate: 85 },
  { month: 'Dec', rate: 82 },
];

const gradRateData = [
  { name: 'Graduated', value: 78 },
  { name: 'Dropped', value: 12 },
  { name: 'Transferred', value: 10 }
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

export default function Reports() {
  const { user } = useAuth();
  const role = user?.role;
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze university data and metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="current">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">2024-2025</SelectItem>
              <SelectItem value="previous">2023-2024</SelectItem>
              <SelectItem value="twoYearsAgo">2022-2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="enrollment">
        <TabsList>
          <TabsTrigger value="enrollment" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Enrollment
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Academic Performance
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center">
            <BarChartHorizontal className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          {role === 'admin' && (
            <TabsTrigger value="retention" className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              Graduation Rate
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="enrollment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment by Department</CardTitle>
                <CardDescription>Current semester enrollment statistics</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="#8884d8" name="Students" />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Faculty Distribution</CardTitle>
                <CardDescription>Professors by department</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="professors" fill="#82ca9d" name="Professors" />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="academic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Average GPA by Year</CardTitle>
              <CardDescription>Academic performance across student years</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={gpaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[2.0, 4.0]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgGPA" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Average GPA"
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate by Month</CardTitle>
              <CardDescription>Average attendance across all courses</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#82ca9d" 
                    name="Attendance Rate (%)"
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {role === 'admin' && (
          <TabsContent value="retention" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Graduation Rate</CardTitle>
                <CardDescription>Outcomes for recent cohorts</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={gradRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {gradRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
