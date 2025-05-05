
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, GraduationCap, Mail, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Mock student data
const mockStudents = [
  {
    id: "STU20230001",
    name: "John Smith",
    email: "john.smith@university.edu",
    program: "Computer Science",
    year: 2,
    gpa: 3.75,
    status: "active",
    advisor: "Dr. Jane Faculty",
    phone: "555-123-4567",
    enrollmentDate: "2023-08-15",
  },
  {
    id: "STU20230002",
    name: "Emma Johnson",
    email: "emma.johnson@university.edu",
    program: "Business Administration",
    year: 3,
    gpa: 3.9,
    status: "active",
    advisor: "Dr. Michael Brown",
    phone: "555-234-5678",
    enrollmentDate: "2022-08-20",
  },
  {
    id: "STU20230003",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@university.edu",
    program: "Electrical Engineering",
    year: 4,
    gpa: 3.5,
    status: "active",
    advisor: "Dr. Jane Faculty",
    phone: "555-345-6789",
    enrollmentDate: "2021-08-18",
  },
  {
    id: "STU20230004",
    name: "Sophia Chen",
    email: "sophia.chen@university.edu",
    program: "Psychology",
    year: 2,
    gpa: 3.8,
    status: "active",
    advisor: "Dr. Robert Wilson",
    phone: "555-456-7890",
    enrollmentDate: "2023-08-15",
  },
  {
    id: "STU20230005",
    name: "David Williams",
    email: "david.williams@university.edu",
    program: "Computer Science",
    year: 3,
    gpa: 3.2,
    status: "probation",
    advisor: "Dr. Jane Faculty",
    phone: "555-567-8901",
    enrollmentDate: "2022-08-20",
  },
];

export default function Students() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const role = user?.role || 'faculty';
  const [students, setStudents] = useState(mockStudents);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  
  // Filter students based on search term and active tab
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "probation") return matchesSearch && student.status === "probation";
    if (activeTab === "advisees") return matchesSearch && student.advisor === "Dr. Jane Faculty";
    
    return matchesSearch;
  });

  // Handle viewing student academic record
  const handleViewAcademicRecord = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.info(`Viewing academic record for ${student.name}`, {
        description: `GPA: ${student.gpa}, Program: ${student.program}, Year: ${student.year}`
      });
    }
  };

  // Handle sending email to student
  const handleSendEmail = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`Email draft opened for ${student.name}`, {
        description: `Recipient: ${student.email}`
      });
    }
  };

  // Handle editing student record
  const handleEditStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.info(`Editing student record for ${student.name}`, {
        description: "Student edit form would open here"
      });
    }
  };

  // Handle deleting student
  const handleDeleteStudent = (studentId: string) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
    toast.success("Student removed successfully", {
      description: "The student has been removed from the system"
    });
    setStudentToDelete(null);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">
            {role === 'faculty' ? 'Manage your students and advisees' : 'Manage all university students'}
          </p>
        </div>
        
        {role === 'admin' && (
          <Button onClick={() => toast.info("Add Student", { description: "New student form would open here" })}>
            <Plus className="mr-2 h-4 w-4" /> Add New Student
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          {role === 'faculty' && <TabsTrigger value="advisees">My Advisees</TabsTrigger>}
          <TabsTrigger value="probation">Academic Probation</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>
                {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.program}</TableCell>
                        <TableCell>{student.year}</TableCell>
                        <TableCell>{student.gpa}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={student.status === 'active' ? 'outline' : 'destructive'}
                          >
                            {student.status === 'active' ? 'Active' : 'Probation'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="View Academic Record"
                              onClick={() => handleViewAcademicRecord(student.id)}
                            >
                              <GraduationCap className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="Send Email"
                              onClick={() => handleSendEmail(student.id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            {role === 'admin' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="Edit Student"
                                  onClick={() => handleEditStudent(student.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      title="Delete Student"
                                      onClick={() => setStudentToDelete(student.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently remove {student.name} from the system.
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setStudentToDelete(null)}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
