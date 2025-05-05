
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, Mail, Phone, BookOpen, UserPlus } from "lucide-react";
import { toast } from "sonner";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock faculty data
const mockFaculty = [
  {
    id: "FAC20190001",
    name: "Dr. Robert Wilson",
    email: "robert.wilson@university.edu",
    department: "Computer Science",
    position: "Professor",
    courses: 3,
    status: "active",
    phone: "555-987-6543",
    office: "Tech Building, Room 305",
    joinDate: "2019-07-10",
    assignedCourses: ["CS101", "CS201", "CS301"]
  },
  {
    id: "FAC20180002",
    name: "Dr. Jane Faculty",
    email: "faculty@university.edu",
    department: "Computer Science",
    position: "Associate Professor",
    courses: 2,
    status: "active",
    phone: "555-876-5432",
    office: "Tech Building, Room 310",
    joinDate: "2018-08-15",
    assignedCourses: ["CS102", "CS202"]
  },
  {
    id: "FAC20200003",
    name: "Dr. Michael Brown",
    email: "michael.brown@university.edu",
    department: "Business Administration",
    position: "Assistant Professor",
    courses: 4,
    status: "active",
    phone: "555-765-4321",
    office: "Business Building, Room 205",
    joinDate: "2020-01-05",
    assignedCourses: ["BUS101", "BUS201", "BUS301", "BUS401"]
  },
  {
    id: "FAC20150004",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    department: "Psychology",
    position: "Professor",
    courses: 3,
    status: "sabbatical",
    phone: "555-654-3210",
    office: "Liberal Arts Building, Room 420",
    joinDate: "2015-08-20",
    assignedCourses: ["PSY101", "PSY201", "PSY301"]
  },
  {
    id: "FAC20210005",
    name: "Dr. David Chen",
    email: "david.chen@university.edu",
    department: "Electrical Engineering",
    position: "Assistant Professor",
    courses: 2,
    status: "active",
    phone: "555-543-2109",
    office: "Engineering Building, Room 215",
    joinDate: "2021-08-01",
    assignedCourses: ["EE101", "EE201"]
  },
];

// Mock available courses for assignment
const availableCourses = [
  { code: "CS101", name: "Introduction to Computer Science" },
  { code: "CS102", name: "Computer Programming" },
  { code: "CS201", name: "Data Structures" },
  { code: "CS202", name: "Algorithms" },
  { code: "CS301", name: "Database Systems" },
  { code: "BUS101", name: "Introduction to Business" },
  { code: "BUS201", name: "Business Management" },
  { code: "BUS301", name: "Marketing" },
  { code: "BUS401", name: "Finance" },
  { code: "PSY101", name: "Introduction to Psychology" },
  { code: "PSY201", name: "Developmental Psychology" },
  { code: "PSY301", name: "Abnormal Psychology" },
  { code: "EE101", name: "Introduction to Electrical Engineering" },
  { code: "EE201", name: "Circuit Analysis" },
  { code: "MATH101", name: "Calculus I" },
  { code: "MATH201", name: "Calculus II" },
  { code: "PHYS101", name: "Physics I" },
];

type Faculty = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  courses: number;
  status: string;
  phone: string;
  office: string;
  joinDate: string;
  assignedCourses: string[];
};

export default function Faculty() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [faculty, setFaculty] = useState(mockFaculty);
  const [facultyToDelete, setFacultyToDelete] = useState<string | null>(null);
  
  // Add Faculty Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState<Omit<Faculty, "id" | "courses" | "assignedCourses">>({
    name: "",
    email: "",
    department: "",
    position: "",
    status: "active",
    phone: "",
    office: "",
    joinDate: new Date().toISOString().split('T')[0]
  });
  
  // Edit Faculty Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  
  // Course Assignment Dialog
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningFaculty, setAssigningFaculty] = useState<Faculty | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  
  // Filter faculty based on search term
  const filteredFaculty = faculty.filter(faculty => 
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle viewing faculty courses
  const handleViewCourses = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (facultyMember) {
      const coursesList = facultyMember.assignedCourses.length > 0
        ? facultyMember.assignedCourses.join(", ")
        : "No courses assigned";
      
      toast.info(`Courses for ${facultyMember.name}`, {
        description: coursesList
      });
    }
  };

  // Handle sending email to faculty
  const handleSendEmail = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (facultyMember) {
      toast.success(`Email draft opened for ${facultyMember.name}`, {
        description: `Recipient: ${facultyMember.email}`
      });
    }
  };

  // Handle editing faculty
  const handleEditFaculty = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (facultyMember) {
      setEditingFaculty(facultyMember);
      setIsEditDialogOpen(true);
    }
  };

  // Handle deleting faculty
  const handleDeleteFaculty = (facultyId: string) => {
    setFaculty(prevFaculty => prevFaculty.filter(f => f.id !== facultyId));
    toast.success("Faculty removed successfully", {
      description: "The faculty member has been removed from the system"
    });
    setFacultyToDelete(null);
  };

  // Handle adding new faculty
  const handleAddFaculty = () => {
    setIsAddDialogOpen(true);
  };
  
  // Save new faculty
  const handleSaveNewFaculty = () => {
    const newFacultyId = `FAC${new Date().getFullYear()}${String(faculty.length + 1).padStart(4, '0')}`;
    const facultyToAdd: Faculty = {
      ...newFaculty,
      id: newFacultyId,
      courses: 0,
      assignedCourses: []
    };
    
    setFaculty(prevFaculty => [...prevFaculty, facultyToAdd]);
    toast.success("New faculty added", {
      description: `${newFaculty.name} has been added to the faculty directory.`
    });
    
    // Reset form and close dialog
    setNewFaculty({
      name: "",
      email: "",
      department: "",
      position: "",
      status: "active",
      phone: "",
      office: "",
      joinDate: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
  };
  
  // Save edited faculty
  const handleSaveEditedFaculty = () => {
    if (!editingFaculty) return;
    
    setFaculty(prevFaculty => 
      prevFaculty.map(f => 
        f.id === editingFaculty.id ? editingFaculty : f
      )
    );
    
    toast.success("Faculty updated", {
      description: `${editingFaculty.name}'s information has been updated.`
    });
    
    setEditingFaculty(null);
    setIsEditDialogOpen(false);
  };
  
  // Handle input change for new faculty
  const handleNewFacultyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFaculty(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change for new faculty
  const handleNewFacultySelectChange = (name: string, value: string) => {
    setNewFaculty(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle input change for editing faculty
  const handleEditFacultyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingFaculty) return;
    
    const { name, value } = e.target;
    setEditingFaculty(prev => ({
      ...prev!,
      [name]: value
    }));
  };
  
  // Handle select change for editing faculty
  const handleEditFacultySelectChange = (name: string, value: string) => {
    if (!editingFaculty) return;
    
    setEditingFaculty(prev => ({
      ...prev!,
      [name]: value
    }));
  };
  
  // Handle course assignment
  const handleAssignCourse = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (facultyMember) {
      setAssigningFaculty(facultyMember);
      setSelectedCourse("");
      setIsAssignDialogOpen(true);
    }
  };
  
  // Save course assignment
  const handleSaveCourseAssignment = () => {
    if (!assigningFaculty || !selectedCourse) return;
    
    // Check if course is already assigned to this faculty
    if (assigningFaculty.assignedCourses.includes(selectedCourse)) {
      toast.error("Course already assigned", {
        description: `${selectedCourse} is already assigned to ${assigningFaculty.name}.`
      });
      return;
    }
    
    // Update faculty with new course
    const updatedFaculty = {
      ...assigningFaculty,
      courses: assigningFaculty.courses + 1,
      assignedCourses: [...assigningFaculty.assignedCourses, selectedCourse]
    };
    
    setFaculty(prevFaculty =>
      prevFaculty.map(f =>
        f.id === assigningFaculty.id ? updatedFaculty : f
      )
    );
    
    toast.success("Course assigned", {
      description: `${selectedCourse} has been assigned to ${assigningFaculty.name}.`
    });
    
    setAssigningFaculty(null);
    setSelectedCourse("");
    setIsAssignDialogOpen(false);
  };
  
  // Remove course assignment
  const handleRemoveCourseAssignment = (facultyId: string, courseCode: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    if (!facultyMember) return;
    
    // Update faculty by removing the course
    const updatedFaculty = {
      ...facultyMember,
      courses: facultyMember.courses - 1,
      assignedCourses: facultyMember.assignedCourses.filter(code => code !== courseCode)
    };
    
    setFaculty(prevFaculty =>
      prevFaculty.map(f =>
        f.id === facultyId ? updatedFaculty : f
      )
    );
    
    toast.success("Course removed", {
      description: `${courseCode} has been removed from ${facultyMember.name}'s assignments.`
    });
  };
  
  // Get unassigned courses for a faculty
  const getUnassignedCourses = (facultyMember: Faculty) => {
    return availableCourses.filter(course => 
      !facultyMember.assignedCourses.includes(course.code)
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Faculty Management</h1>
          <p className="text-muted-foreground">
            Manage university faculty and academic staff
          </p>
        </div>
        
        <Button onClick={handleAddFaculty}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Faculty
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
          <CardDescription>
            {filteredFaculty.length} {filteredFaculty.length === 1 ? 'faculty member' : 'faculty members'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell className="font-medium">{faculty.id}</TableCell>
                    <TableCell>{faculty.name}</TableCell>
                    <TableCell>{faculty.department}</TableCell>
                    <TableCell>{faculty.position}</TableCell>
                    <TableCell>{faculty.courses}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={faculty.status === 'active' ? 'outline' : 'secondary'}
                      >
                        {faculty.status === 'active' ? 'Active' : 'Sabbatical'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="View Courses"
                          onClick={() => handleViewCourses(faculty.id)}
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Assign Course"
                          onClick={() => handleAssignCourse(faculty.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Send Email"
                          onClick={() => handleSendEmail(faculty.id)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Edit Faculty"
                          onClick={() => handleEditFaculty(faculty.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="Delete Faculty"
                              onClick={() => setFacultyToDelete(faculty.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove {faculty.name} from the system.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setFacultyToDelete(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteFaculty(faculty.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add New Faculty Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Faculty</DialogTitle>
            <DialogDescription>
              Enter the details for the new faculty member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={newFaculty.name} 
                  onChange={handleNewFacultyChange}
                  placeholder="e.g., Dr. Jane Smith" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={newFaculty.email} 
                  onChange={handleNewFacultyChange}
                  placeholder="e.g., jane.smith@university.edu" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  name="department"
                  value={newFaculty.department} 
                  onChange={handleNewFacultyChange}
                  placeholder="e.g., Computer Science" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select 
                  name="position"
                  value={newFaculty.position} 
                  onValueChange={(value) => handleNewFacultySelectChange("position", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                    <SelectItem value="Adjunct">Adjunct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={newFaculty.phone} 
                  onChange={handleNewFacultyChange}
                  placeholder="e.g., 555-123-4567" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  name="status"
                  value={newFaculty.status} 
                  onValueChange={(value) => handleNewFacultySelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sabbatical">Sabbatical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="office">Office</Label>
              <Input 
                id="office" 
                name="office"
                value={newFaculty.office} 
                onChange={handleNewFacultyChange}
                placeholder="e.g., Tech Building, Room 305" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input 
                id="joinDate" 
                name="joinDate"
                type="date" 
                value={newFaculty.joinDate} 
                onChange={handleNewFacultyChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewFaculty}>Add Faculty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Faculty Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Faculty</DialogTitle>
            <DialogDescription>
              Update faculty information.
            </DialogDescription>
          </DialogHeader>
          {editingFaculty && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name"
                    value={editingFaculty.name} 
                    onChange={handleEditFacultyChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    name="email"
                    type="email" 
                    value={editingFaculty.email} 
                    onChange={handleEditFacultyChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input 
                    id="edit-department" 
                    name="department"
                    value={editingFaculty.department} 
                    onChange={handleEditFacultyChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Select 
                    name="position"
                    value={editingFaculty.position} 
                    onValueChange={(value) => handleEditFacultySelectChange("position", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Adjunct">Adjunct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input 
                    id="edit-phone" 
                    name="phone"
                    value={editingFaculty.phone} 
                    onChange={handleEditFacultyChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    name="status"
                    value={editingFaculty.status} 
                    onValueChange={(value) => handleEditFacultySelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="sabbatical">Sabbatical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-office">Office</Label>
                <Input 
                  id="edit-office" 
                  name="office"
                  value={editingFaculty.office} 
                  onChange={handleEditFacultyChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-joinDate">Join Date</Label>
                <Input 
                  id="edit-joinDate" 
                  name="joinDate"
                  type="date" 
                  value={editingFaculty.joinDate.split('T')[0]} 
                  onChange={handleEditFacultyChange}
                />
              </div>
              
              {/* Display assigned courses */}
              <div className="space-y-2">
                <Label>Assigned Courses</Label>
                {editingFaculty.assignedCourses.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingFaculty.assignedCourses.map(courseCode => {
                      const course = availableCourses.find(c => c.code === courseCode);
                      return (
                        <div key={courseCode} className="flex items-center bg-secondary rounded-md px-3 py-1">
                          <span className="mr-2">{courseCode}: {course?.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => handleRemoveCourseAssignment(editingFaculty.id, courseCode)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm mt-2">No courses assigned</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingFaculty(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedFaculty}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Course Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Course</DialogTitle>
            <DialogDescription>
              {assigningFaculty && `Assign a course to ${assigningFaculty.name}.`}
            </DialogDescription>
          </DialogHeader>
          {assigningFaculty && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course">Select Course</Label>
                <Select 
                  value={selectedCourse} 
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {getUnassignedCourses(assigningFaculty).map(course => (
                      <SelectItem key={course.code} value={course.code}>
                        {course.code}: {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Current assignments */}
              <div className="space-y-2">
                <Label>Current Course Assignments</Label>
                {assigningFaculty.assignedCourses.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {assigningFaculty.assignedCourses.map(courseCode => {
                      const course = availableCourses.find(c => c.code === courseCode);
                      return (
                        <Badge key={courseCode} variant="outline" className="py-1">
                          {courseCode}: {course?.name}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm mt-2">No courses currently assigned</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAssignDialogOpen(false);
              setAssigningFaculty(null);
              setSelectedCourse("");
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveCourseAssignment}
              disabled={!selectedCourse}
            >
              Assign Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
