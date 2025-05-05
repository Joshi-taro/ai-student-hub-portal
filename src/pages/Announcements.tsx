
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Bell, Search, Filter, BookOpen, Calendar, Megaphone, Plus, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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

// Mock announcements data
const mockAnnouncements = [
  {
    id: '1',
    title: 'Final Exam Schedule Released',
    content: 'The final exam schedule for the Fall 2023 semester has been released. Please check your student portal for your individual exam times and locations. Make sure to arrive at least 15 minutes before your scheduled exam time with your student ID and necessary materials.',
    date: '2023-11-28T10:30:00',
    author: 'Office of Academic Affairs',
    type: 'Academic',
    department: 'University-wide',
    isImportant: true,
    course: null
  },
  {
    id: '2',
    title: 'Campus Closure - Holiday',
    content: 'The university campus will be closed from December 24, 2023, to January 2, 2024, for the winter holiday break. All administrative offices will be closed during this period. Campus will reopen for normal operations on January 3, 2024. Emergency services will remain available throughout the break.',
    date: '2023-11-25T14:15:00',
    author: 'University Administration',
    type: 'Administrative',
    department: 'University-wide',
    isImportant: true,
    course: null
  },
  {
    id: '3',
    title: 'CS101 - Assignment Deadline Extended',
    content: 'Due to the technical issues with the submission portal, the deadline for Programming Assignment 3 has been extended to December 5, 2023, at 11:59 PM. If you have any questions or continue to experience issues with submission, please contact your teaching assistant.',
    date: '2023-11-24T09:45:00',
    author: 'Dr. Jane Smith',
    type: 'Course',
    department: 'Computer Science',
    isImportant: false,
    course: 'CS101'
  },
  {
    id: '4',
    title: 'Library Hours Extended During Finals Week',
    content: 'During finals week (December 10-16), the University Library will extend its hours and will be open from 7:00 AM to 2:00 AM daily. The 24-hour study spaces will remain available throughout the finals period. Coffee and light refreshments will be provided at the library entrance each evening.',
    date: '2023-11-20T11:20:00',
    author: 'University Library',
    type: 'Facility',
    department: 'University-wide',
    isImportant: false,
    course: null
  },
  {
    id: '5',
    title: 'MATH201 - Review Session',
    content: 'There will be a review session for the final exam on December 7, 2023, from 3:00 PM to 5:00 PM in Room 305 of the Mathematics Building. The session will cover key concepts from throughout the semester and practice problems. Bring your questions and study materials.',
    date: '2023-11-18T16:30:00',
    author: 'Prof. Robert Johnson',
    type: 'Course',
    department: 'Mathematics',
    isImportant: false,
    course: 'MATH201'
  },
  {
    id: '6',
    title: 'Scholarship Applications Open',
    content: 'Applications for the 2024-2025 academic year scholarships are now open. The deadline for submission is February 15, 2024. All returning students with a GPA of 3.0 or higher are encouraged to apply. For more information and to access the application form, visit the Financial Aid Office website.',
    date: '2023-11-15T13:45:00',
    author: 'Financial Aid Office',
    type: 'Financial',
    department: 'University-wide',
    isImportant: true,
    course: null
  },
  {
    id: '7',
    title: 'ENG102 - Midterm Results Posted',
    content: 'The results for the midterm examination have been posted on the course portal. You can review your grades and detailed feedback. If you have any questions regarding your assessment, please schedule an appointment during office hours within the next week.',
    date: '2023-11-10T10:15:00',
    author: 'Dr. Emily Brown',
    type: 'Course',
    department: 'English',
    isImportant: false,
    course: 'ENG102'
  },
  {
    id: '8',
    title: 'Student Health Insurance Enrollment Deadline',
    content: 'The deadline to enroll in or waive the student health insurance plan for the spring semester is December 1, 2023. All students must either enroll in the university plan or provide proof of comparable coverage before this date to avoid automatic enrollment and charges.',
    date: '2023-11-05T09:30:00',
    author: 'Student Health Services',
    type: 'Health',
    department: 'University-wide',
    isImportant: true,
    course: null
  }
];

// Helper for formatting dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'academic': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'administrative': return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'course': return 'bg-green-50 text-green-700 border-green-200';
    case 'facility': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'financial': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'health': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: string;
  department: string;
  isImportant: boolean;
  course: string | null;
};

export default function Announcements() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  
  // Admin announcement management states
  const role = user?.role || 'student';
  const isAdmin = role === 'admin';
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Announcement, 'id' | 'date'> & {date?: string}>({
    title: '',
    content: '',
    author: '',
    type: 'Academic',
    department: 'University-wide',
    isImportant: false,
    course: null
  });
  
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Filter and search announcements
  const filteredAnnouncements = announcements
    .filter(announcement => {
      if (filter === 'all') return true;
      if (filter === 'important') return announcement.isImportant;
      if (filter === 'course') return announcement.type === 'Course';
      if (filter === 'administrative') return announcement.type === 'Administrative' || announcement.type === 'Academic' || announcement.type === 'Financial' || announcement.type === 'Health';
      return true;
    })
    .filter(announcement => 
      searchQuery === '' || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (announcement.course && announcement.course.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | 
    { target: { name: string, value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle toggle important
  const handleToggleImportant = (value: string) => {
    setFormData(prev => ({
      ...prev,
      isImportant: value === 'true'
    }));
  };
  
  // Handle type selection
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };
  
  // Handle course selection
  const handleCourseChange = (value: string | null) => {
    setFormData(prev => ({
      ...prev,
      course: value
    }));
  };
  
  // Handle department selection
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      department: value
    }));
  };
  
  // Handle edit announcement
  const handleEditAnnouncement = (announcementId: string) => {
    const announcement = announcements.find(a => a.id === announcementId);
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        type: announcement.type,
        department: announcement.department,
        isImportant: announcement.isImportant,
        course: announcement.course
      });
      setIsEditDialogOpen(true);
      setSelectedAnnouncement(announcementId);
    }
  };
  
  // Handle save edit
  const handleSaveEdit = () => {
    if (!selectedAnnouncement) return;
    
    const updatedAnnouncements = announcements.map(announcement =>
      announcement.id === selectedAnnouncement
        ? {
            ...announcement,
            title: formData.title,
            content: formData.content,
            author: formData.author,
            type: formData.type,
            department: formData.department,
            isImportant: formData.isImportant,
            course: formData.course
          }
        : announcement
    );
    
    setAnnouncements(updatedAnnouncements);
    setIsEditDialogOpen(false);
    
    toast.success("Announcement updated", {
      description: "The announcement has been successfully updated."
    });
  };
  
  // Handle add announcement
  const handleAddAnnouncement = () => {
    const newAnnouncement: Announcement = {
      id: `${Date.now()}`,
      title: formData.title,
      content: formData.content,
      date: new Date().toISOString(),
      author: formData.author,
      type: formData.type,
      department: formData.department,
      isImportant: formData.isImportant,
      course: formData.course
    };
    
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsAddDialogOpen(false);
    
    toast.success("Announcement created", {
      description: "The new announcement has been published successfully."
    });
    
    // Reset form data
    setFormData({
      title: '',
      content: '',
      author: '',
      type: 'Academic',
      department: 'University-wide',
      isImportant: false,
      course: null
    });
  };
  
  // Handle delete announcement
  const handleDeleteAnnouncement = (announcementId: string) => {
    setAnnouncements(announcements.filter(a => a.id !== announcementId));
    setSelectedAnnouncement(null);
    setAnnouncementToDelete(null);
    
    toast.success("Announcement deleted", {
      description: "The announcement has been permanently removed."
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Announcements</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest university and course announcements
            </p>
          </div>
          
          {isAdmin && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Announcement
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-university-primary' : ''}
          >
            <Filter className="mr-1 h-4 w-4" />
            All
          </Button>
          <Button
            variant={filter === 'important' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('important')}
            className={filter === 'important' ? 'bg-university-primary' : ''}
          >
            <Bell className="mr-1 h-4 w-4" />
            Important
          </Button>
          <Button
            variant={filter === 'course' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('course')}
            className={filter === 'course' ? 'bg-university-primary' : ''}
          >
            <BookOpen className="mr-1 h-4 w-4" />
            Courses
          </Button>
          <Button
            variant={filter === 'administrative' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('administrative')}
            className={filter === 'administrative' ? 'bg-university-primary' : ''}
          >
            <Megaphone className="mr-1 h-4 w-4" />
            Admin
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-3">
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p>No announcements match your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map(announcement => (
              <Card 
                key={announcement.id}
                onClick={() => setSelectedAnnouncement(announcement.id)}
                className={cn(
                  "cursor-pointer transition-colors",
                  announcement.id === selectedAnnouncement
                    ? "border-university-primary"
                    : "hover:bg-gray-50"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {announcement.title}
                      {announcement.isImportant && (
                        <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(announcement.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {announcement.course || announcement.department}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Card className="h-full">
            {selectedAnnouncement ? (
              (() => {
                const selected = announcements.find(a => a.id === selectedAnnouncement);
                if (!selected) return null;
                
                return (
                  <>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            {selected.title}
                            {selected.isImportant && (
                              <Badge variant="destructive" className="ml-2">Important</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {selected.author} • {formatDate(selected.date)}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {isAdmin && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditAnnouncement(selected.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setAnnouncementToDelete(selected.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete announcement?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove this announcement. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteAnnouncement(selected.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          <Badge 
                            variant="outline"
                            className={getTypeColor(selected.type)}
                          >
                            {selected.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Badge variant="outline">
                          {selected.course || selected.department}
                        </Badge>
                      </div>
                      <div className="prose">
                        <p>{selected.content}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-4">
                      <Button variant="ghost" size="sm" className="text-university-primary">
                        Mark as Read
                      </Button>
                    </CardFooter>
                  </>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Select an announcement
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Click on an announcement from the list to view its details here.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Add Announcement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new announcement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title} 
                onChange={handleInputChange}
                placeholder="Announcement title" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                name="content"
                value={formData.content} 
                onChange={handleInputChange}
                placeholder="Announcement content..." 
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input 
                id="author" 
                name="author"
                value={formData.author} 
                onChange={handleInputChange}
                placeholder="e.g., Office of Academic Affairs" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Announcement Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Course">Course</SelectItem>
                    <SelectItem value="Facility">Facility</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department/Course</Label>
                {formData.type === 'Course' ? (
                  <Select
                    value={formData.course || ''}
                    onValueChange={(val) => handleCourseChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS101">CS101</SelectItem>
                      <SelectItem value="MATH201">MATH201</SelectItem>
                      <SelectItem value="ENG102">ENG102</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={formData.department}
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University-wide">University-wide</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Important Announcement</Label>
              <RadioGroup
                value={formData.isImportant ? 'true' : 'false'}
                onValueChange={handleToggleImportant}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="important-yes" />
                  <Label htmlFor="important-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="important-no" />
                  <Label htmlFor="important-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAnnouncement}>Create Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Make changes to the announcement details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                name="title"
                value={formData.title} 
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea 
                id="edit-content" 
                name="content"
                value={formData.content} 
                onChange={handleInputChange}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author</Label>
              <Input 
                id="edit-author" 
                name="author"
                value={formData.author} 
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Announcement Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Course">Course</SelectItem>
                    <SelectItem value="Facility">Facility</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department/Course</Label>
                {formData.type === 'Course' ? (
                  <Select
                    value={formData.course || ''}
                    onValueChange={(val) => handleCourseChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CS101">CS101</SelectItem>
                      <SelectItem value="MATH201">MATH201</SelectItem>
                      <SelectItem value="ENG102">ENG102</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select
                    value={formData.department}
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University-wide">University-wide</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Important Announcement</Label>
              <RadioGroup
                value={formData.isImportant ? 'true' : 'false'}
                onValueChange={handleToggleImportant}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="edit-important-yes" />
                  <Label htmlFor="edit-important-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="edit-important-no" />
                  <Label htmlFor="edit-important-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
