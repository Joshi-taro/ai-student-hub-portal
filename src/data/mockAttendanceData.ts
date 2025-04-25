import { AttendanceData } from '@/types/attendance';

export const mockAttendanceData: AttendanceData = {
  summary: {
    overallAttendance: 85,
    threshold: 75,
    totalClasses: 42,
    attendedClasses: 36,
    missedClasses: 6
  },
  courseAttendance: [
    {
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      attendancePercentage: 92,
      totalClasses: 12,
      attendedClasses: 11,
      missedClasses: 1,
      schedule: "Mon, Wed 10:00 AM - 11:30 AM",
      status: "Excellent"
    },
    {
      courseCode: "MATH201",
      courseName: "Calculus II",
      attendancePercentage: 83,
      totalClasses: 12,
      attendedClasses: 10,
      missedClasses: 2,
      schedule: "Tue, Thu 1:00 PM - 2:30 PM",
      status: "Good"
    },
    {
      courseCode: "ENG102",
      courseName: "Composition and Rhetoric",
      attendancePercentage: 73,
      totalClasses: 11,
      attendedClasses: 8,
      missedClasses: 3,
      schedule: "Fri 9:00 AM - 12:00 PM",
      status: "At Risk"
    },
    {
      courseCode: "PHYS101",
      courseName: "Introduction to Physics",
      attendancePercentage: 100,
      totalClasses: 7,
      attendedClasses: 7,
      missedClasses: 0,
      schedule: "Mon, Wed 2:00 PM - 3:30 PM",
      status: "Excellent"
    }
  ],
  attendanceLogs: [
    {
      date: "2024-04-22",
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      time: "10:00 AM - 11:30 AM",
      location: "Science Building, Room 301",
      status: "Present"
    },
    {
      date: "2024-04-22",
      courseCode: "PHYS101",
      courseName: "Introduction to Physics",
      time: "2:00 PM - 3:30 PM",
      location: "Science Building, Room 105",
      status: "Present"
    },
    {
      date: "2024-04-23",
      courseCode: "MATH201",
      courseName: "Calculus II",
      time: "1:00 PM - 2:30 PM",
      location: "Math Building, Room 204",
      status: "Present"
    },
    {
      date: "2024-04-25",
      courseCode: "MATH201",
      courseName: "Calculus II",
      time: "1:00 PM - 2:30 PM", 
      location: "Math Building, Room 204",
      status: "Present"
    },
    {
      date: "2024-04-24",
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      time: "10:00 AM - 11:30 AM",
      location: "Science Building, Room 301",
      status: "Present"
    },
    {
      date: "2024-04-19",
      courseCode: "ENG102",
      courseName: "Composition and Rhetoric",
      time: "9:00 AM - 12:00 PM",
      location: "Humanities Building, Room 110",
      status: "Absent",
      reason: "Family emergency"
    },
    {
      date: "2024-04-12",
      courseCode: "ENG102",
      courseName: "Composition and Rhetoric",
      time: "9:00 AM - 12:00 PM",
      location: "Humanities Building, Room 110", 
      status: "Present"
    }
  ],
  calendarEvents: {
    "2024-04-19": [
      {
        status: "absent",
        courseCode: "ENG102"
      }
    ],
    "2024-04-22": [
      {
        status: "present",
        courseCode: "CS101"
      },
      {
        status: "present",
        courseCode: "PHYS101"
      }
    ],
    "2024-04-23": [
      {
        status: "present", 
        courseCode: "MATH201"
      }
    ],
    "2024-04-24": [
      {
        status: "present",
        courseCode: "CS101"
      }
    ],
    "2024-04-25": [
      {
        status: "present",
        courseCode: "MATH201"
      }
    ]
  }
};
