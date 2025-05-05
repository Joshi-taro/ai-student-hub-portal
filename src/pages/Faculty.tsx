
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, Mail, Phone, BookOpen } from "lucide-react";
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
  },
];

export default function Faculty() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [faculty, setFaculty] = useState(mockFaculty);
  const [facultyToDelete, setFacultyToDelete] = useState<string | null>(null);
  
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
      toast.info(`Viewing courses for ${facultyMember.name}`, {
        description: `Currently teaching ${facultyMember.courses} courses this semester.`
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
      toast.info(`Editing faculty record for ${facultyMember.name}`, {
        description: "Faculty edit form would open here"
      });
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
    toast.info("Add Faculty", { 
      description: "New faculty form would open here" 
    });
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
          <Plus className="mr-2 h-4 w-4" /> Add New Faculty
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
    </div>
  );
}
