
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

export default function Students() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const role = user?.role || 'faculty';
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  
  // Fetch students from Supabase
  const { data: students = [], isLoading, error, refetch } = useQuery({
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
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
