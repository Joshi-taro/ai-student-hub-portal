
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock schedule data
const mockScheduleData = {
  Monday: [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Room 101, Computer Science Building',
      instructor: 'Dr. Jane Smith'
    },
    {
      id: '2',
      courseCode: 'ENG102',
      courseName: 'Composition and Rhetoric',
      startTime: '13:00',
      endTime: '14:30',
      location: 'Room 203, Humanities Hall',
      instructor: 'Dr. Emily Brown'
    }
  ],
  Tuesday: [
    {
      id: '3',
      courseCode: 'MATH201',
      courseName: 'Calculus II',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room 305, Mathematics Building',
      instructor: 'Prof. Robert Johnson'
    }
  ],
  Wednesday: [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Introduction to Computer Science',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Room 101, Computer Science Building',
      instructor: 'Dr. Jane Smith'
    },
    {
      id: '4',
      courseCode: 'PHYS101',
      courseName: 'Physics Lab',
      startTime: '15:00',
      endTime: '17:00',
      location: 'Physics Lab 2, Science Building',
      instructor: 'Dr. Alan Parker'
    }
  ],
  Thursday: [
    {
      id: '3',
      courseCode: 'MATH201',
      courseName: 'Calculus II',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room 305, Mathematics Building',
      instructor: 'Prof. Robert Johnson'
    }
  ],
  Friday: [
    {
      id: '2',
      courseCode: 'ENG102',
      courseName: 'Composition and Rhetoric',
      startTime: '09:00',
      endTime: '12:00',
      location: 'Room 203, Humanities Hall',
      instructor: 'Dr. Emily Brown'
    }
  ],
  Saturday: [],
  Sunday: []
};

// Color assignments for courses
const courseColors: Record<string, string> = {
  CS101: 'bg-blue-100 border-blue-300 text-blue-900',
  MATH201: 'bg-green-100 border-green-300 text-green-900',
  ENG102: 'bg-amber-100 border-amber-300 text-amber-900',
  PHYS101: 'bg-purple-100 border-purple-300 text-purple-900'
};

export default function Schedule() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(mockScheduleData);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 14 }, (_, i) => `${i + 7}:00`); // 7am to 8pm
  
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate the current week
  const getWeekDates = () => {
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    // Adjust to start from Monday (consider Sunday as the last day)
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    
    return daysOfWeek.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };
  
  const weekDates = getWeekDates();
  const formatDate = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };
  
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };
  
  // Function to get the time in decimal format for positioning
  const timeToDecimal = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes / 60);
  };
  
  // Function to calculate position and height for a class
  const getClassPosition = (startTime: string, endTime: string) => {
    const start = timeToDecimal(startTime);
    const end = timeToDecimal(endTime);
    const startPos = (start - 7) * 60; // 7am is the first time slot
    const height = (end - start) * 60;
    
    return {
      top: `${startPos}px`,
      height: `${height}px`
    };
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading schedule...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Schedule</h1>
          <p className="text-muted-foreground">Your weekly class timetable</p>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">
              <Calendar className="inline mr-2" size={20} />
              Weekly Schedule
            </CardTitle>
            <div className="flex space-x-2">
              <button 
                onClick={goToPreviousWeek} 
                className="p-1 rounded hover:bg-gray-100"
              >
                ← Previous
              </button>
              <button 
                onClick={goToCurrentWeek} 
                className="px-3 py-1 text-sm bg-university-primary text-white rounded hover:bg-university-primary/90"
              >
                Today
              </button>
              <button 
                onClick={goToNextWeek} 
                className="p-1 rounded hover:bg-gray-100"
              >
                Next →
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="w-full min-w-[800px]">
                <div className="flex h-12 border-b">
                  <div className="w-16 flex-shrink-0"></div>
                  {daysOfWeek.map((day, index) => (
                    <div 
                      key={day} 
                      className={cn(
                        "flex-1 text-center font-medium p-2 flex flex-col justify-center",
                        isToday(weekDates[index]) && "bg-university-accent/10"
                      )}
                    >
                      <span className="block">{day}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(weekDates[index])}</span>
                    </div>
                  ))}
                </div>
                
                <div className="relative" style={{ height: `${timeSlots.length * 60}px` }}>
                  {/* Time slots */}
                  {timeSlots.map((time, index) => (
                    <div 
                      key={time} 
                      className="absolute w-full border-b border-gray-200 flex"
                      style={{ top: `${index * 60}px`, height: '60px' }}
                    >
                      <div className="w-16 flex-shrink-0 text-xs text-gray-500 pr-2 text-right -mt-2.5">
                        {time}
                      </div>
                      <div className="flex-1 grid grid-cols-7 divide-x">
                        {daysOfWeek.map(day => (
                          <div key={`${day}-${time}`} className="h-full"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Classes */}
                  {daysOfWeek.map((day, dayIndex) => (
                    <React.Fragment key={day}>
                      {scheduleData[day]?.map((cls) => {
                        const position = getClassPosition(cls.startTime, cls.endTime);
                        const colorClass = courseColors[cls.courseCode] || 'bg-gray-100 border-gray-300 text-gray-900';
                        
                        return (
                          <div
                            key={`${day}-${cls.id}`}
                            className={cn(
                              "absolute rounded border z-10 p-2 overflow-hidden shadow-sm",
                              colorClass
                            )}
                            style={{
                              top: position.top,
                              height: position.height,
                              left: `calc(${dayIndex * (100/7)}% + ${16/7}rem)`,
                              width: `calc(${100/7}% - ${16/7}rem)`
                            }}
                          >
                            <div className="text-xs font-bold">{cls.courseCode}</div>
                            <div className="text-xs font-medium truncate">{cls.courseName}</div>
                            <div className="flex items-center text-xs mt-1">
                              <Clock size={10} className="mr-1" />
                              {cls.startTime} - {cls.endTime}
                            </div>
                            <div className="flex items-center text-xs mt-1 truncate">
                              <MapPin size={10} className="mr-1 flex-shrink-0" />
                              {cls.location}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const today = new Date();
                  const dayName = daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];
                  const todaysClasses = scheduleData[dayName] || [];
                  
                  if (todaysClasses.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No classes scheduled for today.</p>
                      </div>
                    );
                  }
                  
                  return todaysClasses.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((cls) => {
                    const colorClass = courseColors[cls.courseCode] || 'bg-gray-100 border-gray-300 text-gray-900';
                    
                    return (
                      <div 
                        key={cls.id} 
                        className={cn(
                          "p-3 rounded-md border",
                          colorClass
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{cls.courseName}</div>
                            <div className="text-sm">{cls.instructor}</div>
                          </div>
                          <Badge variant="outline" className={colorClass}>{cls.courseCode}</Badge>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                          <Clock size={14} className="mr-1" />
                          {cls.startTime} - {cls.endTime}
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                          <MapPin size={14} className="mr-1" />
                          {cls.location}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  // Get upcoming classes (next 3 days)
                  const today = new Date();
                  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
                  
                  let upcomingClasses = [];
                  for (let i = 1; i <= 3; i++) {
                    const nextDayIndex = (todayIndex + i) % 7;
                    const nextDay = daysOfWeek[nextDayIndex];
                    const nextDayClasses = scheduleData[nextDay] || [];
                    
                    upcomingClasses = [
                      ...upcomingClasses,
                      ...nextDayClasses.map(cls => ({
                        ...cls,
                        day: nextDay,
                        dayIndex: nextDayIndex
                      }))
                    ];
                  }
                  
                  if (upcomingClasses.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No upcoming classes in the next few days.</p>
                      </div>
                    );
                  }
                  
                  return upcomingClasses.slice(0, 4).map((cls) => {
                    const colorClass = courseColors[cls.courseCode] || 'bg-gray-100 border-gray-300 text-gray-900';
                    
                    return (
                      <div 
                        key={`${cls.day}-${cls.id}`} 
                        className={cn(
                          "p-3 rounded-md border",
                          colorClass
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{cls.courseName}</div>
                            <div className="text-sm">{cls.day}</div>
                          </div>
                          <Badge variant="outline" className={colorClass}>{cls.courseCode}</Badge>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                          <Clock size={14} className="mr-1" />
                          {cls.startTime} - {cls.endTime}
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                          <MapPin size={14} className="mr-1" />
                          {cls.location}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
