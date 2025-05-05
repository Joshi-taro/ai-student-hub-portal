
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [announcementNotifications, setAnnouncementNotifications] = useState(true);
  const [systemTheme, setSystemTheme] = useState("system");
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and options
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="general">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
              <TabsTrigger 
                value="general" 
                className="justify-start px-3 py-2 font-normal h-9 border"
              >
                <SettingsIcon className="h-4 w-4 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="justify-start px-3 py-2 font-normal h-9 border"
              >
                <User className="h-4 w-4 mr-2" /> Account
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="justify-start px-3 py-2 font-normal h-9 border"
              >
                <Bell className="h-4 w-4 mr-2" /> Notifications
              </TabsTrigger>
              {user?.role === 'admin' && (
                <>
                  <TabsTrigger 
                    value="security" 
                    className="justify-start px-3 py-2 font-normal h-9 border"
                  >
                    <Shield className="h-4 w-4 mr-2" /> Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="system" 
                    className="justify-start px-3 py-2 font-normal h-9 border"
                  >
                    <Database className="h-4 w-4 mr-2" /> System
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>
          
          <div className="flex-1">
            <TabsContent value="general" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure your general preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={systemTheme} onValueChange={setSystemTheme}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your preferred application theme
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your preferred language for the interface
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your timezone for calendar events and deadlines
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Account</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch 
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Announcement Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for new announcements
                      </p>
                    </div>
                    <Switch 
                      checked={announcementNotifications}
                      onCheckedChange={setAnnouncementNotifications}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {user?.role === 'admin' && (
              <>
                <TabsContent value="security" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Configure authentication and security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="password">Change Password</Label>
                        <Input id="current-password" type="password" placeholder="Current password" className="mb-2" />
                        <Input id="new-password" type="password" placeholder="New password" className="mb-2" />
                        <Input id="confirm-password" type="password" placeholder="Confirm password" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground">
                            Enhance security with 2FA
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Login Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified of new logins
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Security Settings</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="system" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription>Configure system-wide settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="maintenance">Maintenance Mode</Label>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Put system in maintenance mode
                          </p>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="backup">Database Backup</Label>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Last backup: 2025-05-02 13:45
                          </p>
                          <Button>Run Backup</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="semester">Active Semester</Label>
                        <Select defaultValue="spring2025">
                          <SelectTrigger>
                            <SelectValue placeholder="Select active semester" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spring2025">Spring 2025</SelectItem>
                            <SelectItem value="summer2025">Summer 2025</SelectItem>
                            <SelectItem value="fall2025">Fall 2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save System Settings</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
