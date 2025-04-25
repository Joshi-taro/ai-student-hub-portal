
import { CourseAttendance } from '@/types/attendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getPerformanceColor } from '@/utils/attendance';

interface CourseProgressCardProps {
  courses: CourseAttendance[];
}

export const CourseProgressCard = ({ courses }: CourseProgressCardProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Attendance by Course</CardTitle>
        <CardDescription>Current attendance percentages for all courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.courseCode} className="space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{course.courseCode}:</span>
                  <span className="ml-1 text-sm">{course.courseName}</span>
                </div>
                <Badge 
                  className={cn(
                    course.status === 'Excellent' ? 'bg-green-100 text-green-800 border-green-200' :
                    course.status === 'Good' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    course.status === 'At Risk' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  )}
                >
                  {course.status}
                </Badge>
              </div>
              <div className="flex items-center">
                <Progress value={course.attendancePercentage} className="h-2 flex-1 mr-3" />
                <span className={cn(
                  "font-medium text-sm",
                  getPerformanceColor(course.attendancePercentage)
                )}>
                  {course.attendancePercentage}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {course.attendedClasses}/{course.totalClasses} classes attended • {course.schedule}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
