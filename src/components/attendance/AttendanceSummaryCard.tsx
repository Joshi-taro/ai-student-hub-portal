
import { AttendanceSummary } from '@/types/attendance';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPerformanceColor } from '@/utils/attendance';

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary;
}

export const AttendanceSummaryCard = ({ summary }: AttendanceSummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-university-primary" />
          Overall Attendance
        </CardTitle>
        <CardDescription>Current semester</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end mb-2">
          <span className={cn(
            "text-4xl font-bold",
            getPerformanceColor(summary.overallAttendance)
          )}>
            {summary.overallAttendance}%
          </span>
          <span className="text-sm text-muted-foreground">
            Minimum required: {summary.threshold}%
          </span>
        </div>
        <Progress value={summary.overallAttendance} className="h-2 mb-4" />
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>Total Classes:</div>
          <div className="text-right font-medium">{summary.totalClasses}</div>
          
          <div>Attended:</div>
          <div className="text-right font-medium text-green-600">
            {summary.attendedClasses}
          </div>
          
          <div>Absent:</div>
          <div className="text-right font-medium text-red-600">
            {summary.missedClasses}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
