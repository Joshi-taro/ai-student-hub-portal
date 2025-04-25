
import { NavLink } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Bell,
  DollarSign,
  ClipboardList,
  UserCircle,
  Settings,
  Users,
  FileText,
  MessageSquare,
  BarChart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  // Different menu items based on role
  const menuItems = {
    student: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Courses", icon: BookOpen, path: "/courses" },
      { title: "Schedule", icon: Calendar, path: "/schedule" },
      { title: "Grades", icon: GraduationCap, path: "/grades" },
      { title: "Announcements", icon: Bell, path: "/announcements" },
      { title: "Fees", icon: DollarSign, path: "/fees" },
      { title: "Attendance", icon: ClipboardList, path: "/attendance" },
      { title: "AI Study Helper", icon: MessageSquare, path: "/study-helper" },
      { title: "Profile", icon: UserCircle, path: "/profile" },
    ],
    faculty: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "My Courses", icon: BookOpen, path: "/courses" },
      { title: "Student Management", icon: Users, path: "/students" },
      { title: "Exams & Grades", icon: FileText, path: "/exams" },
      { title: "Announcements", icon: Bell, path: "/announcements" },
      { title: "Reports", icon: BarChart, path: "/reports" },
      { title: "Profile", icon: UserCircle, path: "/profile" },
    ],
    admin: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { title: "Student Management", icon: Users, path: "/students" },
      { title: "Course Management", icon: BookOpen, path: "/courses" },
      { title: "Faculty Management", icon: Users, path: "/faculty" },
      { title: "Announcements", icon: Bell, path: "/announcements" },
      { title: "Reports", icon: BarChart, path: "/reports" },
      { title: "Settings", icon: Settings, path: "/settings" },
    ]
  };

  const currentMenuItems = menuItems[role] || menuItems.student;

  return (
    <SidebarComponent>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center">
          <div className="h-8 w-8 rounded-full bg-university-accent flex items-center justify-center text-university-primary font-bold">
            U
          </div>
          <span className="ml-2 font-bold text-lg text-white">UniPortal</span>
        </div>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {currentMenuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.path}
                        className={({ isActive }) => isActive ? "text-accent font-medium" : ""}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </SidebarComponent>
  );
}
