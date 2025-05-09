
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { supabase } from "@/integrations/supabase/client";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Define interfaces for the student data
interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  program: string | null;
  year: number | null;
  gpa: number | null;
  status: string | null;
  advisor: string | null;
  phone: string | null;
  enrollment_date: string | null;
  profile_pic: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// Create mock student data since we can't add it to the database
const generateMockStudents = (count: number): Student[] => {
  const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'James', 'Olivia', 'Daniel', 'Ava', 'William', 'Isabella'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Rodriguez', 'Hernandez', 'Lopez'];
  const programs = ['Computer Science', 'Biology', 'Psychology', 'Mathematics', 'History', 'English Literature', 'Physics', 'Chemistry'];
  const advisors = ['Dr. Jane Faculty', 'Dr. Robert Chen', 'Dr. Sarah Miller', 'Dr. David White', 'Dr. Mary Taylor'];
  const statuses = ['active', 'probation'];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
      id: `mock-${i + 1}`,
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@university.edu`,
      program: programs[Math.floor(Math.random() * programs.length)],
      year: Math.floor(Math.random() * 4) + 1,
      gpa: parseFloat((Math.random() * (4.0 - 2.0) + 2.0).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      advisor: advisors[Math.floor(Math.random() * advisors.length)],
      phone: `555-123-${String(1000 + i).padStart(4, '0')}`,
      enrollment_date: new Date(2020 + Math.floor(Math.random() * 4), 8, 1).toISOString().split('T')[0],
      profile_pic: null,
      role: 'student',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
};

export default function Students() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const role = user?.role || 'faculty';
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [mockStudents] = useState(() => generateMockStudents(25));
  
  // Fetch students from Supabase
  const { data: fetchedStudents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Student[];
    },
    enabled: !!user
  });

  // Combine real and mock students
  const students = [...fetchedStudents, ...mockStudents];

  // Filter students based on search term and active tab
  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.program || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "probation") return matchesSearch && student.status === "probation";
    if (activeTab === "advisees") return matchesSearch && student.advisor === "Dr. Jane Faculty";
    
    return matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  const maxPageButtons = 5;
  
  if (totalPages <= maxPageButtons) {
    // Show all page numbers
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Show limited page numbers with ellipsis
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push('ellipsis');
      pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      pageNumbers.push(currentPage + 1);
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages);
    }
  }

  // Handle adding a new student
  const handleAddStudent = async () => {
    toast.info("Add Student", { 
      description: "New student form would open here"
    });
  };

  // Handle viewing student academic record
  const handleViewAcademicRecord = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.info(`Viewing academic record for ${student.first_name} ${student.last_name}`, {
        description: `GPA: ${student.gpa || 'N/A'}, Program: ${student.program || 'N/A'}, Year: ${student.year || 'N/A'}`
      });
    }
  };

  // Handle sending email to student
  const handleSendEmail = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`Email draft opened for ${student.first_name} ${student.last_name}`, {
        description: `Recipient: ${student.email}`
      });
    }
  };

  // Handle editing student record
  const handleEditStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.info(`Editing student record for ${student.first_name} ${student.last_name}`, {
        description: "Student edit form would open here"
      });
    }
  };

  // Handle deleting student
  const handleDeleteStudent = async (studentId: string) => {
    // For mock students, just show a success message
    if (studentId.startsWith('mock-')) {
      toast.success("Mock student removed", {
        description: "This was a mock student and has been removed from the view"
      });
      setStudentToDelete(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', studentId);
      
      if (error) throw error;
      
      toast.success("Student removed successfully", {
        description: "The student has been removed from the system"
      });
      setStudentToDelete(null);
      refetch(); // Refresh the data
    } catch (error) {
      toast.error("Failed to delete student", {
        description: "An error occurred while removing the student"
      });
      console.error("Delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Students</CardTitle>
            <CardDescription>There was a problem retrieving student data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{(error as Error).message}</p>
            <Button onClick={() => refetch()} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Button onClick={handleAddStudent}>
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setCurrentPage(1); // Reset to first page when changing tabs
      }}>
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
                {filteredStudents.length > itemsPerPage && ` (showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredStudents.length)} of ${filteredStudents.length})`}
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
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id.substring(0, 8)}</TableCell>
                          <TableCell>{student.first_name} {student.last_name}</TableCell>
                          <TableCell>{student.program || 'Not set'}</TableCell>
                          <TableCell>{student.year || 'N/A'}</TableCell>
                          <TableCell>{student.gpa || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={student.status !== 'probation' ? 'outline' : 'destructive'}
                            >
                              {student.status || 'Active'}
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
                                          This will permanently remove {student.first_name} {student.last_name} from the system.
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No students found matching your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredStudents.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {pageNumbers.map((number, index) => (
                        <PaginationItem key={index}>
                          {number === 'ellipsis' ? (
                            <div className="px-4 py-2">...</div>
                          ) : (
                            <PaginationLink
                              isActive={currentPage === number}
                              onClick={() => paginate(number as number)}
                              className="cursor-pointer"
                            >
                              {number}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          aria-disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
