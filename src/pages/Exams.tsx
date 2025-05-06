
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, FileText, CheckCircle } from "lucide-react";

// Mock data
const MOCK_COURSES = [
  { id: "cs101", name: "Introduction to Computer Science", faculty: "fac1" },
  { id: "math201", name: "Advanced Mathematics", faculty: "fac1" },
  { id: "phys301", name: "Quantum Physics", faculty: "fac2" },
];

const MOCK_STUDENTS = [
  { id: "stu1", name: "Alex Johnson", email: "alex.j@university.edu" },
  { id: "stu2", name: "Maria Garcia", email: "maria.g@university.edu" },
  { id: "stu3", name: "James Wilson", email: "james.w@university.edu" },
  { id: "stu4", name: "Emma Thompson", email: "emma.t@university.edu" },
];

const MOCK_EXAMS = [
  { 
    id: "ex1", 
    courseId: "cs101", 
    title: "Midterm Examination", 
    date: "2023-10-15", 
    totalMarks: 100,
    description: "Covers chapters 1-5 of the textbook"
  },
  { 
    id: "ex2", 
    courseId: "cs101", 
    title: "Final Project", 
    date: "2023-12-10", 
    totalMarks: 150,
    description: "Implementation of a small application using concepts learned"
  },
];

const MOCK_GRADES = [
  { examId: "ex1", studentId: "stu1", marks: 85, feedback: "Good work!" },
  { examId: "ex1", studentId: "stu2", marks: 92, feedback: "Excellent!" },
  { examId: "ex2", studentId: "stu1", marks: 130, feedback: "Outstanding project implementation" },
];

// Component for Exams and Grades management for faculty
const Exams = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("exams");
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Form states
  const [examForm, setExamForm] = useState({
    title: "",
    date: "",
    totalMarks: 100,
    description: "",
  });
  
  const [gradeForm, setGradeForm] = useState({
    marks: 0,
    feedback: "",
  });

  const [exams, setExams] = useState(MOCK_EXAMS);
  const [grades, setGrades] = useState(MOCK_GRADES);

  // Get faculty courses
  const facultyCourses = MOCK_COURSES.filter(
    (course) => course.faculty === user?.id
  );

  // Filter exams by selected course
  const filteredExams = selectedCourse
    ? exams.filter((exam) => exam.courseId === selectedCourse)
    : [];

  // Get students for a specific course (in a real app this would be from enrollment data)
  const getStudentsForCourse = (courseId: string) => {
    // For demo, we'll return all students
    return MOCK_STUDENTS;
  };

  // Get grades for a specific exam
  const getGradesForExam = (examId: string) => {
    return grades.filter((grade) => grade.examId === examId);
  };

  // Get grade for a specific student and exam
  const getStudentGrade = (examId: string, studentId: string) => {
    return grades.find(
      (grade) => grade.examId === examId && grade.studentId === studentId
    );
  };

  // Handle creating a new exam
  const handleCreateExam = () => {
    if (!selectedCourse) {
      toast.error("Please select a course first");
      return;
    }

    const newExam = {
      id: `ex${exams.length + 1}`,
      courseId: selectedCourse,
      title: examForm.title,
      date: examForm.date,
      totalMarks: examForm.totalMarks,
      description: examForm.description,
    };

    setExams([...exams, newExam]);
    setOpenDialog(null);
    toast.success("Exam created successfully");
    resetExamForm();
  };

  // Handle editing an exam
  const handleEditExam = () => {
    if (!selectedExam) return;

    const updatedExams = exams.map((exam) =>
      exam.id === selectedExam.id
        ? {
            ...exam,
            title: examForm.title,
            date: examForm.date,
            totalMarks: examForm.totalMarks,
            description: examForm.description,
          }
        : exam
    );

    setExams(updatedExams);
    setOpenDialog(null);
    toast.success("Exam updated successfully");
    resetExamForm();
  };

  // Handle assigning grades
  const handleAssignGrade = () => {
    if (!selectedExam || !selectedStudent) return;

    const existingGradeIndex = grades.findIndex(
      (grade) => grade.examId === selectedExam.id && grade.studentId === selectedStudent.id
    );

    let updatedGrades;
    if (existingGradeIndex >= 0) {
      // Update existing grade
      updatedGrades = [...grades];
      updatedGrades[existingGradeIndex] = {
        ...updatedGrades[existingGradeIndex],
        marks: gradeForm.marks,
        feedback: gradeForm.feedback,
      };
    } else {
      // Create new grade
      updatedGrades = [
        ...grades,
        {
          examId: selectedExam.id,
          studentId: selectedStudent.id,
          marks: gradeForm.marks,
          feedback: gradeForm.feedback,
        },
      ];
    }

    setGrades(updatedGrades);
    setOpenDialog(null);
    toast.success("Grade assigned successfully");
    resetGradeForm();
  };

  // Reset form states
  const resetExamForm = () => {
    setExamForm({
      title: "",
      date: "",
      totalMarks: 100,
      description: "",
    });
    setSelectedExam(null);
  };

  const resetGradeForm = () => {
    setGradeForm({
      marks: 0,
      feedback: "",
    });
    setSelectedStudent(null);
  };

  // Handle opening edit exam dialog
  const openEditExamDialog = (exam: any) => {
    setSelectedExam(exam);
    setExamForm({
      title: exam.title,
      date: exam.date,
      totalMarks: exam.totalMarks,
      description: exam.description,
    });
    setOpenDialog("editExam");
  };

  // Handle opening assign grade dialog
  const openAssignGradeDialog = (exam: any, student: any) => {
    setSelectedExam(exam);
    setSelectedStudent(student);
    
    const existingGrade = getStudentGrade(exam.id, student.id);
    
    if (existingGrade) {
      setGradeForm({
        marks: existingGrade.marks,
        feedback: existingGrade.feedback,
      });
    } else {
      resetGradeForm();
    }
    
    setOpenDialog("assignGrade");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Exams & Grades Management</h1>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <Label htmlFor="course-select">Select Course:</Label>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {facultyCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="exams">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Exams</CardTitle>
                <CardDescription>Manage course examinations</CardDescription>
              </div>
              <Button 
                onClick={() => setOpenDialog("createExam")} 
                disabled={!selectedCourse}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Exam
              </Button>
            </CardHeader>
            <CardContent>
              {!selectedCourse ? (
                <p className="text-muted-foreground text-center py-4">Please select a course to view exams</p>
              ) : filteredExams.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No exams created for this course yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>{exam.totalMarks}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{exam.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEditExamDialog(exam)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Student Grades</CardTitle>
              <CardDescription>Assign and manage student grades</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedCourse ? (
                <p className="text-muted-foreground text-center py-4">Please select a course to view grades</p>
              ) : filteredExams.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No exams created for this course yet</p>
              ) : (
                filteredExams.map((exam) => (
                  <div key={exam.id} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">{exam.title}</h3>
                      <span className="text-sm text-muted-foreground">{exam.date} • {exam.totalMarks} marks</span>
                    </div>
                    <Separator className="my-2" />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getStudentsForCourse(selectedCourse).map((student) => {
                          const grade = getStudentGrade(exam.id, student.id);
                          const percentage = grade 
                            ? Math.round((grade.marks / exam.totalMarks) * 100) 
                            : null;
                          
                          return (
                            <TableRow key={`${exam.id}-${student.id}`}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>
                                {grade ? `${grade.marks}/${exam.totalMarks}` : 'Not graded'}
                              </TableCell>
                              <TableCell>
                                {percentage ? `${percentage}%` : '-'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant={grade ? "outline" : "default"}
                                  onClick={() => openAssignGradeDialog(exam, student)}
                                >
                                  {grade ? (
                                    <>
                                      <Edit className="h-4 w-4 mr-1" /> Edit Grade
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" /> Assign Grade
                                    </>
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Exam Dialog */}
      <Dialog open={openDialog === "createExam"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
            <DialogDescription>
              Add examination details for {selectedCourse ? 
                MOCK_COURSES.find(c => c.id === selectedCourse)?.name : 
                "your course"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exam-title">Exam Title</Label>
              <Input
                id="exam-title"
                value={examForm.title}
                onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                placeholder="Midterm Examination"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-date">Date</Label>
              <Input
                id="exam-date"
                type="date"
                value={examForm.date}
                onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-marks">Total Marks</Label>
              <Input
                id="exam-marks"
                type="number"
                value={examForm.totalMarks}
                onChange={(e) => setExamForm({ ...examForm, totalMarks: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-description">Description</Label>
              <Textarea
                id="exam-description"
                value={examForm.description}
                onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                placeholder="Details about the examination, topics covered, etc."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExam}>Create Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog */}
      <Dialog open={openDialog === "editExam"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
            <DialogDescription>
              Update examination details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-exam-title">Exam Title</Label>
              <Input
                id="edit-exam-title"
                value={examForm.title}
                onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-exam-date">Date</Label>
              <Input
                id="edit-exam-date"
                type="date"
                value={examForm.date}
                onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-exam-marks">Total Marks</Label>
              <Input
                id="edit-exam-marks"
                type="number"
                value={examForm.totalMarks}
                onChange={(e) => setExamForm({ ...examForm, totalMarks: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-exam-description">Description</Label>
              <Textarea
                id="edit-exam-description"
                value={examForm.description}
                onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditExam}>Update Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Grade Dialog */}
      <Dialog open={openDialog === "assignGrade"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {getStudentGrade(selectedExam?.id, selectedStudent?.id) 
                ? "Edit Grade" 
                : "Assign Grade"}
            </DialogTitle>
            <DialogDescription>
              {selectedExam && selectedStudent && (
                <>
                  For {selectedStudent.name} in {selectedExam.title}
                  <span className="block mt-1 text-xs">
                    Total marks: {selectedExam.totalMarks}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="grade-marks">Marks Obtained</Label>
              <Input
                id="grade-marks"
                type="number"
                value={gradeForm.marks}
                onChange={(e) => setGradeForm({ ...gradeForm, marks: parseInt(e.target.value) || 0 })}
                max={selectedExam?.totalMarks}
              />
              {selectedExam && (
                <p className="text-xs text-muted-foreground">
                  {Math.round((gradeForm.marks / selectedExam.totalMarks) * 100)}% of total marks
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade-feedback">Feedback</Label>
              <Textarea
                id="grade-feedback"
                value={gradeForm.feedback}
                onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                placeholder="Provide feedback to the student"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignGrade}>Save Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exams;
