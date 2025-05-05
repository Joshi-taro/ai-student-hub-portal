import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Clock, CalendarDays, BookOpen, GraduationCap, Info, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialMockCourses = {
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

// Mock faculty data for assignment
const mockFaculty = [
  { id: "FAC20190001", name: "Dr. Robert Wilson", department: "Computer Science" },
  { id: "FAC20180002", name: "Dr. Jane Smith", department: "Computer Science" },
  { id: "FAC20200003", name: "Dr. Michael Brown", department: "Business Administration" },
  { id: "FAC20150004", name: "Dr. Sarah Johnson", department: "Psychology" },
  { id: "FAC20210005", name: "Dr. David Chen", department: "Electrical Engineering" },
  { id: "FAC20220006", name: "Prof. Robert Johnson", department: "Mathematics" },
  { id: "FAC20220007", name: "Dr. Emily Brown", department: "English" },
  { id: "FAC20220008", name: "Dr. Michael Chen", department: "Physics" },
  { id: "FAC20220009", name: "Prof. Sarah Wilson", department: "Biology" },
  { id: "FAC20220010", name: "Dr. William Taylor", department: "Chemistry" },
];

type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  instructor: string;
  schedule: string;
  description: string;
};

export default function Courses() {
  const { user } = useAuth();
  const { toast: useToastFn } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(initialMockCourses.enrolled);
  const [availableCourses, setAvailableCourses] = useState(initialMockCourses.available);
  const [activeTab, setActiveTab] = useState("enrolled");
  
  // Admin course management state
  const role = user?.role || 'student';
  const isAdmin = role === 'admin';
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([...initialMockCourses.enrolled, ...initialMockCourses.available]);
  
  // Faculty assignment state
  const [isAssignFacultyDialogOpen, setIsAssignFacultyDialogOpen] = useState(false);
  const [courseToAssign, setCourseToAssign] = useState<Course | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  
  // Form states for add/edit
  const [formData, setFormData] = useState<Course>({
    id: "",
    code: "",
    name: "",
    credits: 3,
    department: "",
    instructor: "",
    schedule: "",
    description: ""
  });

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
      useToastFn({
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
      useToastFn({
        title: "Course Dropped",
        description: `You have dropped ${course.name}.`,
        variant: "default",
      });
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? Number(value) : value
    }));
  };
  
  // Handle opening the edit dialog
  const handleEditCourse = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      setCourseToEdit(course);
      setFormData(course);
      setIsEditDialogOpen(true);
    }
  };
  
  // Handle opening the add dialog
  const handleAddCourseClick = () => {
    setFormData({
      id: `${Math.floor(Math.random() * 10000)}`,
      code: "",
      name: "",
      credits: 3,
      department: "",
      instructor: "",
      schedule: "",
      description: ""
    });
    setIsAddDialogOpen(true);
  };
  
  // Save edited course
  const handleSaveEditedCourse = () => {
    if (!courseToEdit) return;
    
    // Update in all courses
    const updatedAllCourses = allCourses.map(c => 
      c.id === courseToEdit.id ? formData : c
    );
    setAllCourses(updatedAllCourses);
    
    // Update in enrolled courses if it exists there
    if (enrolledCourses.some(c => c.id === courseToEdit.id)) {
      setEnrolledCourses(enrolledCourses.map(c => 
        c.id === courseToEdit.id ? formData : c
      ));
    }
    
    // Update in available courses if it exists there
    if (availableCourses.some(c => c.id === courseToEdit.id)) {
      setAvailableCourses(availableCourses.map(c => 
        c.id === courseToEdit.id ? formData : c
      ));
    }
    
    toast.success(`Course ${formData.code} updated`, {
      description: "Course details have been successfully updated."
    });
    
    setIsEditDialogOpen(false);
    setCourseToEdit(null);
  };
  
  // Save new course
  const handleAddNewCourse = () => {
    const newCourse = {
      ...formData,
      id: `${Date.now()}` // Ensure unique ID
    };
    
    setAllCourses([...allCourses, newCourse]);
    setAvailableCourses([...availableCourses, newCourse]);
    
    toast.success(`Course ${newCourse.code} added`, {
      description: "New course has been successfully added to the catalog."
    });
    
    setIsAddDialogOpen(false);
  };
  
  // Delete course
  const handleDeleteCourse = (courseId: string) => {
    // Remove from all courses
    setAllCourses(allCourses.filter(c => c.id !== courseId));
    
    // Remove from enrolled if it exists there
    if (enrolledCourses.some(c => c.id === courseId)) {
      setEnrolledCourses(enrolledCourses.filter(c => c.id !== courseId));
    }
    
    // Remove from available if it exists there
    if (availableCourses.some(c => c.id === courseId)) {
      setAvailableCourses(availableCourses.filter(c => c.id !== courseId));
    }
    
    toast.success("Course deleted", {
      description: "The course has been permanently removed from the system."
    });
    
    setCourseToDelete(null);
  };
  
  // Handle opening assign faculty dialog
  const handleAssignFaculty = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      setCourseToAssign(course);
      setSelectedFaculty("");
      setIsAssignFacultyDialogOpen(true);
    }
  };
  
  // Handle assigning faculty to course
  const handleSaveFacultyAssignment = () => {
    if (!courseToAssign || !selectedFaculty) return;
    
    const facultyMember = mockFaculty.find(f => f.id === selectedFaculty);
    if (!facultyMember) return;
    
    // Update course with new instructor
    const updatedCourse = {
      ...courseToAssign,
      instructor: facultyMember.name
    };
    
    // Update in all courses
    const updatedAllCourses = allCourses.map(c => 
      c.id === courseToAssign.id ? updatedCourse : c
    );
    setAllCourses(updatedAllCourses);
    
    // Update in enrolled courses if it exists there
    if (enrolledCourses.some(c => c.id === courseToAssign.id)) {
      setEnrolledCourses(enrolledCourses.map(c => 
        c.id === courseToAssign.id ? updatedCourse : c
      ));
    }
    
    // Update in available courses if it exists there
    if (availableCourses.some(c => c.id === courseToAssign.id)) {
      setAvailableCourses(availableCourses.map(c => 
        c.id === courseToAssign.id ? updatedCourse : c
      ));
    }
    
    toast.success(`Faculty assigned`, {
      description: `${facultyMember.name} is now assigned to teach ${courseToAssign.code}.`
    });
    
    setIsAssignFacultyDialogOpen(false);
    setCourseToAssign(null);
    setSelectedFaculty("");
  };
  
  // Filter faculty by department for more relevant assignment options
  const getRelevantFaculty = (course: Course) => {
    // First show faculty from the same department, then others
    const departmentFaculty = mockFaculty.filter(f => 
      f.department.toLowerCase() === course.department.toLowerCase()
    );
    
    const otherFaculty = mockFaculty.filter(f => 
      f.department.toLowerCase() !== course.department.toLowerCase()
    );
    
    return [...departmentFaculty, ...otherFaculty];
  };

  const renderCourseCard = (course: Course, isEnrolled = false) => (
    <Card key={course.id} className="mb-4 animate-fade-in">
      <CardHeader className="relative">
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
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleEditCourse(course.id)}
              title="Edit Course"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleAssignFaculty(course.id)}
              title="Assign Faculty"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setCourseToDelete(course.id)}
                  title="Delete Course"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove {course.name} ({course.code}) from the system.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setCourseToDelete(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <GraduationCap className="mr-2 text-university-secondary" size={16} />
          <span className="font-medium">Instructor:</span>
          <span className="ml-1">{course.instructor || "Not assigned"}</span>
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
      {!isAdmin && (
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
      )}
    </Card>
  );

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Manage university courses and curriculum" 
              : "Manage your course enrollments and explore available courses"}
          </p>
          {isAdmin && (
            <Button onClick={handleAddCourseClick}>
              <Plus className="mr-2 h-4 w-4" /> Add New Course
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="enrolled">{isAdmin ? "All Courses" : `Enrolled Courses (${enrolledCourses.length})`}</TabsTrigger>
          {!isAdmin && (
            <TabsTrigger value="available">Available Courses ({availableCourses.length})</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="enrolled" className="space-y-4">
          {(isAdmin ? allCourses : enrolledCourses).length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Courses Found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isAdmin 
                  ? "There are no courses in the system yet. Add your first course to get started."
                  : "You are not enrolled in any courses yet. Check available courses to enroll."}
              </p>
              {!isAdmin && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigateToTab("available")}
                >
                  Browse Available Courses
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(isAdmin ? allCourses : enrolledCourses).map(course => renderCourseCard(course, true))}
            </div>
          )}
        </TabsContent>
        
        {!isAdmin && (
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
        )}
      </Tabs>
      
      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Make changes to the course details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input 
                  id="code" 
                  name="code"
                  value={formData.code} 
                  onChange={handleInputChange}
                  placeholder="e.g., CS101" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <Input 
                  id="credits" 
                  name="credits"
                  type="number" 
                  value={formData.credits} 
                  onChange={handleInputChange}
                  min={1} 
                  max={6} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                placeholder="e.g., Introduction to Computer Science" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  name="department"
                  value={formData.department} 
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input 
                  id="instructor" 
                  name="instructor"
                  value={formData.instructor} 
                  onChange={handleInputChange}
                  placeholder="e.g., Dr. Jane Smith" 
                  disabled
                />
                <p className="text-xs text-muted-foreground">Use the Assign Faculty button to change instructor</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input 
                id="schedule" 
                name="schedule"
                value={formData.schedule} 
                onChange={handleInputChange}
                placeholder="e.g., Mon, Wed 10:00 AM - 11:30 AM" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description} 
                onChange={handleInputChange}
                placeholder="Course description..." 
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setCourseToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEditedCourse}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Enter the details for the new course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-code">Course Code</Label>
                <Input 
                  id="add-code" 
                  name="code"
                  value={formData.code} 
                  onChange={handleInputChange}
                  placeholder="e.g., CS101" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-credits">Credits</Label>
                <Input 
                  id="add-credits" 
                  name="credits"
                  type="number" 
                  value={formData.credits} 
                  onChange={handleInputChange}
                  min={1} 
                  max={6} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-name">Course Name</Label>
              <Input 
                id="add-name" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                placeholder="e.g., Introduction to Computer Science" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-department">Department</Label>
                <Input 
                  id="add-department" 
                  name="department"
                  value={formData.department} 
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-instructor">Instructor</Label>
                <Input 
                  id="add-instructor" 
                  name="instructor"
                  value={formData.instructor} 
                  onChange={handleInputChange}
                  placeholder="Not assigned yet" 
                />
                <p className="text-xs text-muted-foreground">You can assign faculty after creating the course</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-schedule">Schedule</Label>
              <Input 
                id="add-schedule" 
                name="schedule"
                value={formData.schedule} 
                onChange={handleInputChange}
                placeholder="e.g., Mon, Wed 10:00 AM - 11:30 AM" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea 
                id="add-description" 
                name="description"
                value={formData.description} 
                onChange={handleInputChange}
                placeholder="Course description..." 
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewCourse}>Add Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Faculty Dialog */}
      <Dialog open={isAssignFacultyDialogOpen} onOpenChange={setIsAssignFacultyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Faculty</DialogTitle>
            <DialogDescription>
              {courseToAssign && `Assign a faculty member to teach ${courseToAssign.code}: ${courseToAssign.name}.`}
            </DialogDescription>
          </DialogHeader>
          {courseToAssign && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="faculty">Select Faculty</Label>
                  {courseToAssign.instructor && (
                    <Badge variant="outline" className="px-2 py-0.5">
                      Current: {courseToAssign.instructor}
                    </Badge>
                  )}
                </div>
                
                <Select 
                  value={selectedFaculty} 
                  onValueChange={setSelectedFaculty}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a faculty member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Select Faculty --</SelectItem>
                    {getRelevantFaculty(courseToAssign).map(faculty => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name} ({faculty.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAssignFacultyDialogOpen(false);
              setCourseToAssign(null);
              setSelectedFaculty("");
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveFacultyAssignment}
              disabled={!selectedFaculty}
            >
              Assign Faculty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
