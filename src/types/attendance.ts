
export interface AttendanceLog {
  date: string;
  courseCode: string;
  courseName: string;
  time: string;
  location: string;
  status: string;
  reason?: string;
}

export interface CourseAttendance {
  courseCode: string;
  courseName: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  schedule: string;
  status: string;
}

export interface CalendarEvent {
  status: string;
  courseCode: string;
}

export interface AttendanceSummary {
  overallAttendance: number;
  threshold: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
}

export interface AttendanceData {
  summary: AttendanceSummary;
  courseAttendance: CourseAttendance[];
  attendanceLogs: AttendanceLog[];
  calendarEvents: Record<string, CalendarEvent[]>;
}
