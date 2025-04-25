import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, School, 
  Pencil, Save, KeyRound, Bell, Globe, ShieldCheck, 
  FileText, Upload, AlertCircle
} from 'lucide-react';

// Mock student data
const mockStudentData = {
  id: 'STU20230001',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  phone: '+1 (555) 123-4567',
  address: '123 Campus Drive, University City, CA 94720',
  dateOfBirth: '1998-05-15',
  gender: 'Male',
  department: 'Computer Science',
  departmentId: 'CS',
  program: 'Bachelor of Science',
  admissionDate: '2021-09-01',
  year: '3rd',
  enrollmentStatus: 'Active',
  profileImage: 'https://i.pravatar.cc/300?u=alex',
  academicAdvisor: {
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@university.edu',
    office: 'Computer Science Building, Room 405',
    officeHours: 'Mon, Wed 2:00 PM - 4:00 PM'
  }
};

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  emailNotifications: boolean;
  appNotifications: boolean;
  twoFactorAuth: boolean;
  language: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState(mockStudentData);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formState, setFormState] = useState<FormState>({
    name: studentData.name,
    email: studentData.email,
    phone: studentData.phone,
    address: studentData.address,
    dateOfBirth: studentData.dateOfBirth,
    gender: studentData.gender,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    appNotifications: true,
    twoFactorAuth: false,
    language: 'english'
  });
  
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProfileUpdate = () => {
    // This would typically update the backend
    setStudentData({
      ...studentData,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      address: formState.address,
      gender: formState.gender
    });
    
    if (avatarPreview) {
      setStudentData(prev => ({
        ...prev,
        profileImage: avatarPreview
      }));
    }
    
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handlePasswordChange = () => {
    // This would typically update the password in the backend
    if (formState.newPassword !== formState.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "The new password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // Reset password fields
    setFormState(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  const handleNotificationChange = (key: string, value: boolean) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Settings updated",
      description: `${key === 'emailNotifications' ? 'Email' : 'App'} notifications ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your personal information
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage 
                      src={avatarPreview || studentData.profileImage} 
                      alt={studentData.name} 
                    />
                    <AvatarFallback>{studentData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                        <DialogDescription>
                          Upload a new profile picture. Square images work best.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex justify-center">
                          <Avatar className="w-32 h-32 border">
                            <AvatarImage 
                              src={avatarPreview || studentData.profileImage} 
                              alt={studentData.name} 
                            />
                            <AvatarFallback>{studentData.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex justify-center">
                          <Label 
                            htmlFor="avatar" 
                            className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md flex items-center"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Choose File
                          </Label>
                          <Input 
                            id="avatar" 
                            type="file" 
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAvatarFile(null);
                            setAvatarPreview(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => {}}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <h2 className="text-xl font-bold">{studentData.name}</h2>
                <p className="text-muted-foreground mb-2">{studentData.program}</p>
                
                <div className="flex items-center my-1">
                  <Badge className="bg-university-primary">
                    {studentData.year} Year Student
                  </Badge>
                </div>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-start">
                    <School className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">{studentData.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Student ID</p>
                      <p className="text-sm text-muted-foreground">{studentData.id}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Admission Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(studentData.admissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className={`${studentData.enrollmentStatus === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'} mt-2`}>
                      {studentData.enrollmentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Academic Advisor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{studentData.academicAdvisor.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{studentData.academicAdvisor.email}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{studentData.academicAdvisor.office}</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{studentData.academicAdvisor.officeHours}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Schedule Meeting
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="personal" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {isEditing ? 'Edit your personal details below' : 'View and manage your personal details'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input 
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.name}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.email}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input 
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.phone}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input 
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formState.dateOfBirth}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="text-sm p-2 border rounded-md bg-gray-50">
                          {new Date(studentData.dateOfBirth).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ?  (
                        <Input 
                          id="address"
                          name="address"
                          value={formState.address}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.address}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <RadioGroup 
                          value={formState.gender} 
                          onValueChange={(value) => setFormState(prev => ({ ...prev, gender: value }))}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      ) : (
                        <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.gender}</div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Academic Information</h3>
                    <p className="text-sm text-muted-foreground">
                      The following academic details cannot be edited. Please contact the registrar's office for any updates.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.department}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Program</Label>
                      <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.program}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Student ID</Label>
                      <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.id}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <div className="text-sm p-2 border rounded-md bg-gray-50">{studentData.year} Year</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setFormState({
                            ...formState,
                            name: studentData.name,
                            email: studentData.email,
                            phone: studentData.phone,
                            address: studentData.address,
                            gender: studentData.gender
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleProfileUpdate}
                        className="bg-university-primary hover:bg-university-primary/90"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Information
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formState.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formState.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formState.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={!formState.currentPassword || !formState.newPassword || !formState.confirmPassword}
                      >
                        <KeyRound className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center space-x-4">
                      <Switch 
                        id="twoFactorAuth" 
                        checked={formState.twoFactorAuth}
                        onCheckedChange={(checked) => setFormState(prev => ({ ...prev, twoFactorAuth: checked }))}
                      />
                      <div>
                        <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Secure your account with an additional verification step.
                        </p>
                      </div>
                    </div>
                    {formState.twoFactorAuth && (
                      <div className="mt-4 p-4 border rounded-md bg-gray-50">
                        <p className="text-sm">
                          Two-factor authentication is enabled. You'll be prompted to enter a verification code 
                          sent to your email when signing in from a new device.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Sessions</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <div className="font-medium">Current Session</div>
                          <div className="text-sm text-muted-foreground">
                            Started: {new Date().toLocaleString()}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </div>
                      <Button variant="outline">
                        Sign Out of All Devices
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="text-base">All Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about important university and course updates
                          </p>
                        </div>
                        <Switch 
                          id="emailNotifications" 
                          checked={formState.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                        />
                      </div>
                      
                      <div className="ml-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailAnnouncements">Announcements</Label>
                          <Switch 
                            id="emailAnnouncements" 
                            disabled={!formState.emailNotifications}
                            checked={formState.emailNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailGrades">Grades & Academic Updates</Label>
                          <Switch 
                            id="emailGrades" 
                            disabled={!formState.emailNotifications}
                            checked={formState.emailNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailFees">Payment Reminders</Label>
                          <Switch 
                            id="emailFees" 
                            disabled={!formState.emailNotifications}
                            checked={formState.emailNotifications}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">App Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="appNotifications" className="text-base">All App Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive in-app notifications for various activities
                          </p>
                        </div>
                        <Switch 
                          id="appNotifications" 
                          checked={formState.appNotifications}
                          onCheckedChange={(checked) => handleNotificationChange('appNotifications', checked)}
                        />
                      </div>
                      
                      <div className="ml-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="appAnnouncements">Announcements</Label>
                          <Switch 
                            id="appAnnouncements" 
                            disabled={!formState.appNotifications}
                            checked={formState.appNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="appGrades">Grades Posted</Label>
                          <Switch 
                            id="appGrades" 
                            disabled={!formState.appNotifications}
                            checked={formState.appNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="appDiscussions">Discussion Replies</Label>
                          <Switch 
                            id="appDiscussions" 
                            disabled={!formState.appNotifications}
                            checked={formState.appNotifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="appReminders">Class Reminders</Label>
                          <Switch 
                            id="appReminders" 
                            disabled={!formState.appNotifications}
                            checked={formState.appNotifications}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Language Preferences</h3>
                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <div className="flex items-center space-x-4">
                        <RadioGroup 
                          value={formState.language} 
                          onValueChange={(value) => setFormState(prev => ({ ...prev, language: value }))}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="english" id="english" />
                            <Label htmlFor="english">English</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spanish" id="spanish" />
                            <Label htmlFor="spanish">Spanish</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="french" id="french" />
                            <Label htmlFor="french">French</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="chinese" id="chinese" />
                            <Label htmlFor="chinese">Chinese</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Access and download your official documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Important Note</h4>
                      <p className="text-sm text-amber-700">
                        Official documents will be available for download once they have been verified and approved by the registrar's office.
                        Processing may take up to 3-5 business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-university-primary" />
                        <div>
                          <div className="font-medium">Enrollment Verification</div>
                          <div className="text-sm text-muted-foreground">
                            Last updated: October 15, 2023
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-university-primary" />
                        <div>
                          <div className="font-medium">Transcript (Unofficial)</div>
                          <div className="text-sm text-muted-foreground">
                            Last updated: November 5, 2023
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-university-primary" />
                        <div>
                          <div className="font-medium">Financial Statement</div>
                          <div className="text-sm text-muted-foreground">
                            Last updated: November 1, 2023
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-md bg-gray-50">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-700">Official Transcript</div>
                          <div className="text-sm text-gray-500">
                            Processing - Available in 2 days
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Pending
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Request Documents</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Need a specific document? Request official documents through the university portal.
                      </p>
                      <Button>Request New Document</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
