import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, XCircle, AlertCircle, CalendarDays, Clock, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttendanceData } from '@/types/attendance';
import { mockAttendanceData } from '@/data/mockAttendanceData';
import { AttendanceSummaryCard } from '@/components/attendance/AttendanceSummaryCard';
import { CourseProgressCard } from '@/components/attendance/CourseProgressCard';
import { formatDate, getStatusColor } from '@/utils/attendance';

export default function Attendance() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(mockAttendanceData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (attendanceData.courseAttendance.length > 0) {
        setSelectedCourse(attendanceData.courseAttendance[0].courseCode);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const getLogsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return attendanceData.attendanceLogs.filter(log => log.date === dateStr);
  };
  
  const getDayClassNames = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const events = attendanceData.calendarEvents[dateStr];
    
    if (!events) return "";
    
    if (events.some(e => e.status === 'absent')) {
      return "bg-red-100 text-red-900 font-bold";
    }
    
    return "";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Attendance</h1>
        <p className="text-muted-foreground">
          Monitor your class attendance and view attendance history
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AttendanceSummaryCard summary={attendanceData.summary} />
        <CourseProgressCard courses={attendanceData.courseAttendance} />
      </div>
      
      <Tabs defaultValue="logs" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="logs">Attendance Logs</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="course-details">Course Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.attendanceLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(log.date)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{log.courseCode}</div>
                        <div className="text-xs text-muted-foreground">{log.courseName}</div>
                      </TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{log.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          <div className="flex items-center">
                            {log.status === 'Present' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {log.status}
                          </div>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Calendar</CardTitle>
                <CardDescription>Select a date to view attendance details</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md p-2"
                  modifiersClassNames={{
                    today: 'bg-university-primary/10 text-university-primary font-bold',
                  }}
                  modifiersStyles={{
                    selected: {
                      backgroundColor: 'var(--university-primary)',
                      color: 'white',
                      fontWeight: 'bold',
                    }
                  }}
                  components={{
                    DayContent: ({ date }) => (
                      <div className={getDayClassNames(date)}>
                        {date.getDate()}
                      </div>
                    ),
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-university-primary" />
                  {selectedDate ? (
                    <span>Attendance for {formatDate(selectedDate.toISOString())}</span>
                  ) : (
                    <span>Select a date to view details</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate && (
                  <div>
                    {getLogsForSelectedDate().length > 0 ? (
                      <div className="space-y-4">
                        {getLogsForSelectedDate().map((log, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{log.courseCode}: {log.courseName}</h4>
                                <p className="text-sm text-muted-foreground">{log.time}</p>
                              </div>
                              <Badge className={getStatusColor(log.status)}>
                                <div className="flex items-center">
                                  {log.status === 'Present' ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {log.status}
                                </div>
                              </Badge>
                            </div>
                            <div className="text-sm">
                              <strong>Location:</strong> {log.location}
                            </div>
                            {log.reason && (
                              <div className="mt-2 text-sm bg-gray-50 p-2 rounded-md">
                                <strong>Absence Reason:</strong> {log.reason}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No classes on this date</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          There were no scheduled classes or the date is outside the semester period.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="course-details">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Courses</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {attendanceData.courseAttendance.map(course => (
                    <button
                      key={course.courseCode}
                      className={cn(
                        "w-full text-left px-4 py-2 hover:bg-gray-50",
                        selectedCourse === course.courseCode && "bg-university-primary/10"
                      )}
                      onClick={() => setSelectedCourse(course.courseCode)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{course.courseCode}</span>
                        <span 
                          className={cn(
                            "text-sm font-medium",
                            getPerformanceColor(course.attendancePercentage)
                          )}
                        >
                          {course.attendancePercentage}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {course.courseName}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-3">
              {selectedCourse && (() => {
                const course = attendanceData.courseAttendance.find(
                  c => c.courseCode === selectedCourse
                );
                
                if (!course) return null;
                
                const courseLogs = attendanceData.attendanceLogs.filter(
                  log => log.courseCode === selectedCourse
                );
                
                return (
                  <>
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {course.courseCode}: {course.courseName}
                      </CardTitle>
                      <CardDescription>
                        {course.schedule}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="border rounded-md p-4">
                          <div className="text-sm text-muted-foreground">Attendance Rate</div>
                          <div className={cn(
                            "text-2xl font-bold",
                            getPerformanceColor(course.attendancePercentage)
                          )}>
                            {course.attendancePercentage}%
                          </div>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="text-sm text-muted-foreground">Classes Attended</div>
                          <div className="text-2xl font-bold text-green-600">
                            {course.attendedClasses}
                            <span className="text-sm text-muted-foreground ml-1">
                              of {course.totalClasses}
                            </span>
                          </div>
                        </div>
                        <div className="border rounded-md p-4">
                          <div className="text-sm text-muted-foreground">Classes Missed</div>
                          <div className="text-2xl font-bold text-red-600">
                            {course.missedClasses}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-medium mb-3">Attendance Status</h3>
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <Progress 
                            value={course.attendancePercentage} 
                            className="h-3 flex-1 mr-3"
                          />
                          <span className="text-sm">
                            {course.attendancePercentage}%
                          </span>
                        </div>
                        
                        {course.attendancePercentage < 75 && (
                          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex mt-4">
                            <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                              Your attendance for this course is below the minimum required threshold (75%). 
                              Please ensure you attend future classes to avoid academic penalties.
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-medium mb-3">Recent Attendance</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courseLogs.length > 0 ? (
                            courseLogs.map((log, index) => (
                              <TableRow key={index}>
                                <TableCell>{formatDate(log.date)}</TableCell>
                                <TableCell>{log.time}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(log.status)}>
                                    <div className="flex items-center">
                                      {log.status === 'Present' ? (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      ) : (
                                        <XCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {log.status}
                                    </div>
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4">
                                No attendance records found for this course
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </>
                );
              })()}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-3">
            <p>
              Students are expected to maintain at least 75% attendance in each course. Falling below this threshold 
              may lead to ineligibility for final examinations or grade penalties as determined by university policy.
            </p>
            <p>
              If you need to miss a class for medical or personal reasons, please submit the appropriate documentation 
              to have your absence marked as excused. Excused absences do not count against your attendance percentage, 
              but you are still responsible for any missed material.
            </p>
            <p>
              If you have any questions or concerns regarding your attendance records, please contact your academic advisor 
              or the respective course instructor.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
