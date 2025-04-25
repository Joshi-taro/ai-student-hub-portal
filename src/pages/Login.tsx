
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login(values.email, values.password);
    navigate("/dashboard");
  };

  const onSignupSubmit = (values: z.infer<typeof signupSchema>) => {
    // For demo: just log the values. In a real app, this would call an API
    console.log("Signup values:", values);
    // Switch to login tab after successful signup
    setActiveTab("login");
    loginForm.setValue("email", values.email);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - university branding */}
      <div className="w-full md:w-1/2 university-gradient flex flex-col justify-center items-center text-white p-8">
        <div className="max-w-md text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">Welcome to University Portal</h1>
          <p className="text-lg mb-6">Your gateway to academic excellence and innovation</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <h3 className="font-medium mb-1">Modern Learning</h3>
              <p className="text-sm">Access courses anywhere, anytime</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <h3 className="font-medium mb-1">AI Support</h3>
              <p className="text-sm">Get help with your studies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <h3 className="font-medium mb-1">Track Progress</h3>
              <p className="text-sm">Monitor your academic journey</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - login form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <div className="space-y-2 text-center mb-6">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
              </div>
              
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="student@university.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
                    Sign In
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground mb-4">
                  For demo, use these credentials:
                </p>
                <div className="space-y-1">
                  <p><strong>Student:</strong> student@university.edu / password</p>
                  <p><strong>Faculty:</strong> faculty@university.edu / password</p>
                  <p><strong>Admin:</strong> admin@university.edu / password</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <div className="space-y-2 text-center mb-6">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground">Enter your information to sign up</p>
              </div>
              
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@university.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
