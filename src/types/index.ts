export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    classId?: string;
  }
  
  export interface Schedule {
    id: string;
    classId: string;
    day: string;
    subject: string;
    time: string;
    teacher: string;
  }
  
  export interface Grade {
    id: string;
    studentId: string;
    subject: string;
    score: number;
    date: string;
    teacherId: string;
  }
  
  export interface Photo {
    id: string;
    classId: string;
    url: string;
    uploadedBy: string;
    date: string;
  }