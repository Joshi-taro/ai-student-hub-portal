
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, GraduationCap, BookOpen, ClipboardList, Bell, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for demonstration
const studentData = {
  name: "John Student",
  id: "STU20230001",
  program: "Bachelor of Computer Science",
  semester: 5,
  courses: [
    { id: "CSE101", name: "Introduction to Programming", progress: 85, grade: "A" },
    { id: "MAT201", name: "Advanced Mathematics", progress: 70, grade: "B+" },
    { id: "PHY101", name: "Physics Fundamentals", progress: 60, grade: "B" },
    { id: "ENG202", name: "Technical Writing", progress: 90, grade: "A+" },
  ],
  announcements: [
    { id: 1, title: "Mid-term Exam Schedule", date: "2025-05-10" },
    { id: 2, title: "Campus Maintenance Notice", date: "2025-05-05" },
    { id: 3, title: "Library Extended Hours", date: "2025-05-03" },
  ],
  attendance: {
    overall: 85,
    bySubject: [
      { subject: "Introduction to Programming", percentage: 90 },
      { subject: "Advanced Mathematics", percentage: 78 },
      { subject: "Physics Fundamentals", percentage: 82 },
      { subject: "Technical Writing", percentage: 95 },
    ]
  },
  upcomingEvents: [
    { id: 1, title: "Programming Lab", date: "2025-04-26", time: "10:00 AM" },
    { id: 2, title: "Mathematics Quiz", date: "2025-04-28", time: "2:00 PM" },
    { id: 3, title: "Project Submission", date: "2025-05-02", time: "11:59 PM" },
  ],
  fees: {
    currentStatus: "Paid",
    dueDate: "2025-06-15",
    amount: 1200,
    paid: 1200,
    pending: 0
  }
};

const facultyData = {
  name: "Dr. Jane Faculty",
  id: "FAC20190003",
  department: "Computer Science",
  courses: [
    { id: "CSE101", name: "Introduction to Programming", students: 42, sections: 2 },
    { id: "CSE305", name: "Database Management", students: 38, sections: 1 },
    { id: "CSE401", name: "Advanced Algorithms", students: 25, sections: 1 },
  ],
  announcements: [
    { id: 1, title: "Faculty Meeting", date: "2025-05-02" },
    { id: 2, title: "Research Symposium", date: "2025-05-10" },
    { id: 3, title: "Curriculum Committee", date: "2025-05-06" },
  ],
  upcomingEvents: [
    { id: 1, title: "Office Hours", date: "2025-04-26", time: "1:00 PM" },
    { id: 2, title: "Department Meeting", date: "2025-04-29", time: "10:00 AM" },
    { id: 3, title: "Grading Deadline", date: "2025-05-05", time: "5:00 PM" },
  ],
  recentActivities: [
    { id: 1, description: "Updated grades for CSE101", time: "Yesterday" },
    { id: 2, description: "Posted announcement to CSE305", time: "2 days ago" },
    { id: 3, description: "Updated course materials for CSE401", time: "3 days ago" },
  ]
};

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const [tab, setTab] = useState("overview");
  
  // Select data based on user role
  const data = role === 'student' ? studentData : facultyData;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
      </div>
      
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          {role === 'student' && <TabsTrigger value="attendance">Attendance</TabsTrigger>}
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {role === 'student' ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-primary" />
                        Courses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{studentData.courses.length}</div>
                      <p className="text-xs text-muted-foreground">Currently enrolled</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                        GPA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.75</div>
                      <p className="text-xs text-muted-foreground">Current semester</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                        Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{studentData.attendance.overall}%</div>
                      <p className="text-xs text-muted-foreground">Overall percentage</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        Fees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${studentData.fees.pending}</div>
                      <p className="text-xs text-muted-foreground">
                        {studentData.fees.currentStatus === "Paid" 
                          ? "All fees paid" 
                          : `Due by ${studentData.fees.dueDate}`}
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-primary" />
                        Courses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{facultyData.courses.length}</div>
                      <p className="text-xs text-muted-foreground">Currently teaching</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                        Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {facultyData.courses.reduce((sum, course) => sum + course.students, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total enrolled</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                        Sections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {facultyData.courses.reduce((sum, course) => sum + course.sections, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">Teaching load</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-primary" />
                        Announcements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{facultyData.announcements.length}</div>
                      <p className="text-xs text-muted-foreground">Posted this month</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            
            {/* Recent updates and announcements section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Latest updates for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {data.announcements.map(announcement => (
                      <li key={announcement.id} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-sm text-muted-foreground">{announcement.date}</p>
                        </div>
                        <Bell className="h-4 w-4 text-muted-foreground mt-1" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Your schedule for the next week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {data.upcomingEvents.map(event => (
                      <li key={event.id} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date} at {event.time}
                          </p>
                        </div>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground mt-1" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Role-specific content */}
            {role === 'student' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Current Course Progress</CardTitle>
                  <CardDescription>Track your performance in each enrolled course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {studentData.courses.map(course => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-sm text-muted-foreground">{course.id}</p>
                          </div>
                          <span className="font-medium">{course.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={course.progress} className="h-2" />
                          <span className="text-muted-foreground text-sm w-8">{course.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest actions on the portal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {facultyData.recentActivities.map(activity => (
                      <li key={activity.id} className="pb-4 border-b last:border-0 last:pb-0">
                        <p>{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(role === 'student' ? studentData.courses : facultyData.courses).map(course => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="h-2 bg-primary" />
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>{course.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {role === 'student' ? (
                      <>
                        <div className="text-sm mb-4">
                          <span className="font-medium">Current Grade:</span> {course.grade}
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Progress</div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="text-xs text-right text-muted-foreground">
                            {course.progress}% Complete
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Students:</span>
                            <span className="font-medium">{(course as any).students}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sections:</span>
                            <span className="font-medium">{(course as any).sections}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {role === 'student' && (
            <TabsContent value="attendance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>Your attendance record by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {studentData.attendance.bySubject.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{subject.subject}</p>
                          <span 
                            className={`font-medium ${
                              subject.percentage >= 85 
                                ? 'text-green-500' 
                                : subject.percentage >= 75 
                                ? 'text-amber-500' 
                                : 'text-red-500'
                            }`}
                          >
                            {subject.percentage}%
                          </span>
                        </div>
                        <Progress 
                          value={subject.percentage} 
                          className="h-2"
                          // Different colors based on percentage
                          color={
                            subject.percentage >= 85 
                              ? 'bg-green-500' 
                              : subject.percentage >= 75 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
