
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Bell, Search, Filter, BookOpen, Calendar, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function Announcements() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  
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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading announcements...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest university and course announcements
          </p>
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
                          <Badge 
                            variant="outline"
                            className={getTypeColor(selected.type)}
                          >
                            {selected.type}
                          </Badge>
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
      </div>
    </AppLayout>
  );
}
