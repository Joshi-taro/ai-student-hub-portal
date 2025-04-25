
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Clock, CalendarDays, BookOpen, GraduationCap, Info } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/components/ui/use-toast";

const mockCourses = {
  enrolled: [
    { 
      id: "1", 
      code: "CS101", 
      name: "Introduction to Computer Science", 
      credits: 3, 
      department: "Computer Science",
      instructor: "Dr. Jane Smith",
      schedule: "Mon, Wed 10:00 AM - 11:30 AM",
      description: "An introductory course covering the fundamental concepts of computer science."
    },
    { 
      id: "2", 
      code: "MATH201", 
      name: "Calculus II", 
      credits: 4, 
      department: "Mathematics",
      instructor: "Prof. Robert Johnson",
      schedule: "Tue, Thu 1:00 PM - 2:30 PM",
      description: "Advanced integration techniques, infinite series, and parametric equations."
    },
    { 
      id: "3", 
      code: "ENG102", 
      name: "Composition and Rhetoric", 
      credits: 3, 
      department: "English",
      instructor: "Dr. Emily Brown",
      schedule: "Fri 9:00 AM - 12:00 PM",
      description: "Develop critical reading and writing skills for academic and professional contexts."
    },
  ],
  available: [
    { 
      id: "4", 
      code: "PHYS201", 
      name: "Physics II: Electricity and Magnetism", 
      credits: 4, 
      department: "Physics",
      instructor: "Dr. Michael Chen",
      schedule: "Mon, Wed 2:00 PM - 3:30 PM",
      description: "Electric and magnetic fields, circuits, electromagnetic waves, and optics."
    },
    { 
      id: "5", 
      code: "BIO101", 
      name: "Introduction to Biology", 
      credits: 3, 
      department: "Biology",
      instructor: "Prof. Sarah Wilson",
      schedule: "Tue, Thu 11:00 AM - 12:30 PM",
      description: "Fundamental principles of cell biology, genetics, and evolution."
    },
    { 
      id: "6", 
      code: "CHEM101", 
      name: "General Chemistry", 
      credits: 4, 
      department: "Chemistry",
      instructor: "Dr. William Taylor",
      schedule: "Mon, Wed, Fri 8:00 AM - 9:00 AM",
      description: "Basic principles and applications of chemistry with laboratory exercises."
    },
  ]
};

export default function Courses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(mockCourses.enrolled);
  const [availableCourses, setAvailableCourses] = useState(mockCourses.available);
  const [activeTab, setActiveTab] = useState("enrolled");

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnroll = (courseId: string) => {
    const course = availableCourses.find(c => c.id === courseId);
    if (course) {
      setEnrolledCourses([...enrolledCourses, course]);
      setAvailableCourses(availableCourses.filter(c => c.id !== courseId));
      toast({
        title: "Enrolled Successfully",
        description: `You have enrolled in ${course.name}.`,
        variant: "default",
      });
    }
  };

  const handleDrop = (courseId: string) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course) {
      setAvailableCourses([...availableCourses, course]);
      setEnrolledCourses(enrolledCourses.filter(c => c.id !== courseId));
      toast({
        title: "Course Dropped",
        description: `You have dropped ${course.name}.`,
        variant: "default",
      });
    }
  };

  const renderCourseCard = (course, isEnrolled = false) => (
    <Card key={course.id} className="mb-4 animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 text-university-primary" size={18} />
              {course.code}: {course.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {course.department} • {course.credits} Credits
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-university-accent text-university-dark">
            {course.code}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <GraduationCap className="mr-2 text-university-secondary" size={16} />
          <span className="font-medium">Instructor:</span>
          <span className="ml-1">{course.instructor}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 text-university-secondary" size={16} />
          <span className="font-medium">Schedule:</span>
          <span className="ml-1">{course.schedule}</span>
        </div>
        <div className="mt-2 text-sm">
          <div className="flex items-start">
            <Info className="mr-2 text-university-secondary shrink-0 mt-0.5" size={16} />
            <p>{course.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isEnrolled ? (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => handleDrop(course.id)}
          >
            Drop Course
          </Button>
        ) : (
          <Button 
            variant="default"
            size="sm" 
            className="bg-university-primary hover:bg-university-primary/90"
            onClick={() => handleEnroll(course.id)}
          >
            Enroll Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading courses...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">
            Manage your course enrollments and explore available courses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="enrolled">Enrolled Courses ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="available">Available Courses ({availableCourses.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled" className="space-y-4">
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Courses Enrolled</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You are not enrolled in any courses yet. Check available courses to enroll.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigateToTab("available")}
                >
                  Browse Available Courses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map(course => renderCourseCard(course, true))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            {availableCourses.length === 0 ? (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Available Courses</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no courses available for enrollment at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses.map(course => renderCourseCard(course))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
