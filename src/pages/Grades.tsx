import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { GraduationCap, Download, BarChart3, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock grades data
const mockGradesData = {
  courses: [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      semester: 'Fall 2023',
      credits: 3,
      grade: 'A',
      percentage: 92,
      exams: [
        { name: 'Midterm Exam', score: 89, totalMarks: 100, date: '2023-10-15' },
        { name: 'Final Exam', score: 94, totalMarks: 100, date: '2023-12-10' },
        { name: 'Programming Assignment 1', score: 95, totalMarks: 100, date: '2023-09-20' },
        { name: 'Programming Assignment 2', score: 90, totalMarks: 100, date: '2023-11-05' }
      ]
    },
    {
      id: '2',
      courseCode: 'MATH201',
      courseName: 'Calculus II',
      semester: 'Fall 2023',
      credits: 4,
      grade: 'B+',
      percentage: 88,
      exams: [
        { name: 'Quiz 1', score: 85, totalMarks: 100, date: '2023-09-18' },
        { name: 'Quiz 2', score: 82, totalMarks: 100, date: '2023-10-12' },
        { name: 'Midterm Exam', score: 86, totalMarks: 100, date: '2023-10-20' },
        { name: 'Final Exam', score: 91, totalMarks: 100, date: '2023-12-15' }
      ]
    },
    {
      id: '3',
      courseCode: 'ENG102',
      courseName: 'Composition and Rhetoric',
      semester: 'Fall 2023',
      credits: 3,
      grade: 'A-',
      percentage: 90,
      exams: [
        { name: 'Essay 1', score: 88, totalMarks: 100, date: '2023-09-25' },
        { name: 'Essay 2', score: 92, totalMarks: 100, date: '2023-10-30' },
        { name: 'Presentation', score: 89, totalMarks: 100, date: '2023-11-15' },
        { name: 'Final Paper', score: 91, totalMarks: 100, date: '2023-12-05' }
      ]
    },
    {
      id: '4',
      courseCode: 'PHYS101',
      courseName: 'Introduction to Physics',
      semester: 'Spring 2024',
      credits: 4,
      grade: 'B',
      percentage: 85,
      exams: [
        { name: 'Quiz 1', score: 82, totalMarks: 100, date: '2024-02-10' },
        { name: 'Midterm Exam', score: 84, totalMarks: 100, date: '2024-03-05' },
        { name: 'Lab Report 1', score: 88, totalMarks: 100, date: '2024-02-20' },
        { name: 'Lab Report 2', score: 86, totalMarks: 100, date: '2024-04-10' }
      ]
    },
    {
      id: '5',
      courseCode: 'HIST101',
      courseName: 'World History',
      semester: 'Spring 2024',
      credits: 3,
      grade: 'A',
      percentage: 94,
      exams: [
        { name: 'Research Paper', score: 95, totalMarks: 100, date: '2024-03-15' },
        { name: 'Midterm Exam', score: 92, totalMarks: 100, date: '2024-03-01' },
        { name: 'Final Exam', score: 94, totalMarks: 100, date: '2024-05-10' },
        { name: 'Participation', score: 96, totalMarks: 100, date: '2024-05-15' }
      ]
    }
  ],
  gpa: {
    current: 3.72,
    previous: 3.65,
    trend: 'increase'
  },
  summary: {
    totalCredits: 17,
    completedCredits: 17,
    gradingScale: [
      { grade: 'A', range: '90-100', points: 4.0 },
      { grade: 'A-', range: '87-89', points: 3.7 },
      { grade: 'B+', range: '84-86', points: 3.3 },
      { grade: 'B', range: '80-83', points: 3.0 },
      { grade: 'B-', range: '77-79', points: 2.7 },
      { grade: 'C+', range: '74-76', points: 2.3 },
      { grade: 'C', range: '70-73', points: 2.0 },
      { grade: 'C-', range: '67-69', points: 1.7 },
      { grade: 'D+', range: '64-66', points: 1.3 },
      { grade: 'D', range: '60-63', points: 1.0 },
      { grade: 'F', range: '0-59', points: 0.0 }
    ]
  }
};

// Helper function to get grade color
const getGradeColor = (grade: string) => {
  switch (grade.charAt(0)) {
    case 'A': return 'text-green-600 bg-green-50 border-green-200';
    case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'C': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'F': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Helper function to get percentage color
const getPercentageColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 80) return 'bg-blue-500';
  if (percentage >= 70) return 'bg-amber-500';
  if (percentage >= 60) return 'bg-orange-500';
  return 'bg-red-500';
};

export default function Grades() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [gradesData, setGradesData] = useState(mockGradesData);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (gradesData.courses.length > 0) {
        setSelectedCourse(gradesData.courses[0].id);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleDownloadReport = () => {
    // This would typically generate a PDF report
    alert('Grade report download functionality will be implemented with backend integration');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading grades data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Academic Performance</h1>
          <p className="text-muted-foreground">
            View your course grades, exam scores, and academic progress
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          onClick={handleDownloadReport}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-university-primary" />
              Current GPA
            </CardTitle>
            <CardDescription>Fall 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end">
              <span className="text-4xl font-bold">{gradesData.gpa.current.toFixed(2)}</span>
              <span className="ml-2 mb-1 text-sm text-muted-foreground">/ 4.0</span>
              {gradesData.gpa.trend === 'increase' ? (
                <span className="ml-auto text-green-600 text-sm font-medium">
                  ↑ {(gradesData.gpa.current - gradesData.gpa.previous).toFixed(2)}
                </span>
              ) : (
                <span className="ml-auto text-red-600 text-sm font-medium">
                  ↓ {(gradesData.gpa.previous - gradesData.gpa.current).toFixed(2)}
                </span>
              )}
            </div>
            <Progress 
              value={(gradesData.gpa.current / 4) * 100} 
              className="h-2 mt-4" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              Previous: {gradesData.gpa.previous.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-university-primary" />
              Credits
            </CardTitle>
            <CardDescription>Academic progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end">
              <span className="text-4xl font-bold">{gradesData.summary.completedCredits}</span>
              <span className="ml-2 mb-1 text-sm text-muted-foreground">
                / {gradesData.summary.totalCredits}
              </span>
              <span className="ml-auto text-green-600 text-sm font-medium">
                100% Complete
              </span>
            </div>
            <Progress 
              value={(gradesData.summary.completedCredits / gradesData.summary.totalCredits) * 100} 
              className="h-2 mt-4" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              All credits completed for current semester
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-university-primary" />
              Grade Distribution
            </CardTitle>
            <CardDescription>Current semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-2">
              {['A', 'B', 'C', 'D', 'F'].map(grade => {
                const count = gradesData.courses.filter(course => 
                  course.grade.startsWith(grade)
                ).length;
                const percentage = (count / gradesData.courses.length) * 100;
                
                return (
                  <div key={grade} className="flex items-center">
                    <div className="w-8 text-left font-medium">{grade}</div>
                    <div className="flex-1 mx-2">
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            grade === 'A' ? 'bg-green-500' : 
                            grade === 'B' ? 'bg-blue-500' : 
                            grade === 'C' ? 'bg-amber-500' : 
                            grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
                          )}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-8 text-right text-xs font-medium">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 md:pr-4 space-y-3">
          <h3 className="text-lg font-semibold mb-4">Courses</h3>
          {gradesData.courses.map(course => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-colors",
                selectedCourse === course.id 
                  ? "bg-university-primary/10 border-university-primary/40"
                  : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{course.courseCode}</div>
                  <div className="text-sm text-muted-foreground truncate" style={{ maxWidth: "180px" }}>
                    {course.courseName}
                  </div>
                </div>
                <Badge className={cn("ml-2", getGradeColor(course.grade))}>
                  {course.grade}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>{course.percentage}%</span>
                  <span>{course.credits} Cr</span>
                </div>
                <Progress 
                  value={course.percentage} 
                  className="h-1" 
                  indicator={{ className: getPercentageColor(course.percentage) }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            {selectedCourse && (
              <CardDescription>
                {gradesData.courses.find(c => c.id === selectedCourse)?.courseName} - 
                {gradesData.courses.find(c => c.id === selectedCourse)?.semester}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedCourse && (
              <div>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-md min-w-[100px]">
                    <div className="text-sm text-muted-foreground">Grade</div>
                    <div className="text-xl font-bold">
                      {gradesData.courses.find(c => c.id === selectedCourse)?.grade}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md min-w-[100px]">
                    <div className="text-sm text-muted-foreground">Percentage</div>
                    <div className="text-xl font-bold">
                      {gradesData.courses.find(c => c.id === selectedCourse)?.percentage}%
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md min-w-[100px]">
                    <div className="text-sm text-muted-foreground">Credits</div>
                    <div className="text-xl font-bold">
                      {gradesData.courses.find(c => c.id === selectedCourse)?.credits}
                    </div>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium mb-4">Assessment Details</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradesData.courses
                      .find(c => c.id === selectedCourse)
                      ?.exams.map((exam, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{exam.name}</TableCell>
                          <TableCell>{exam.date}</TableCell>
                          <TableCell>
                            {exam.score} / {exam.totalMarks}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className={cn(
                              "font-normal",
                              exam.score >= 90 ? "bg-green-50 text-green-700 border-green-200" :
                              exam.score >= 80 ? "bg-blue-50 text-blue-700 border-blue-200" :
                              exam.score >= 70 ? "bg-amber-50 text-amber-700 border-amber-200" :
                              exam.score >= 60 ? "bg-orange-50 text-orange-700 border-orange-200" :
                              "bg-red-50 text-red-700 border-red-200"
                            )}>
                              {(exam.score / exam.totalMarks * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Grading Scale</CardTitle>
          <CardDescription>
            University grading system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Letter Grade</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>GPA Points</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradesData.summary.gradingScale.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge className={getGradeColor(item.grade)}>
                        {item.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.range}%</TableCell>
                    <TableCell>{item.points.toFixed(1)}</TableCell>
                    <TableCell>
                      {item.points >= 4.0 ? "Excellent" : 
                       item.points >= 3.0 ? "Good" :
                       item.points >= 2.0 ? "Satisfactory" :
                       item.points >= 1.0 ? "Poor" : "Failing"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
