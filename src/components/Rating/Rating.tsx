import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { subjects } from '../../data/mockData';
import { Star, TrendingUp, Award, Users, GraduationCap, BookOpen } from 'lucide-react';
import './Rating.css';

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  subject: string;
  score: number;
  date: string;
  teacherId: string;
  teacherName: string;
}

interface Student {
  id: string;
  name: string;
  classId: string;
  role: string;
}

const getGradesFromStorage = (): Grade[] => {
  const grades = localStorage.getItem('kundalik_grades');
  return grades ? JSON.parse(grades) : [];
};

const saveGradesToStorage = (grades: Grade[]) => {
  localStorage.setItem('kundalik_grades', JSON.stringify(grades));
};

const getStudentsFromStorage = (teacherClasses?: string[]): Student[] => {
  const users = localStorage.getItem('kundalik_users');
  if (!users) return [];
  
  const allUsers = JSON.parse(users);
  const students = allUsers.filter((u: any) => u.role === 'student');
  
  if (teacherClasses && teacherClasses.length > 0) {
    return students.filter((s: Student) => teacherClasses.includes(s.classId));
  }
  
  return students;
};

export default function Rating() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(user?.subject || subjects[0]);
  const [score, setScore] = useState(5);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'give' | 'history'>('give');

  const userRole = user?.role || '';
  const userId = user?.id || '';
  const userName = user?.name || '';
  const teacherClasses = user?.teacherClasses || [];
  const userSubject = user?.subject || subjects[0];

  useEffect(() => {
    setGrades(getGradesFromStorage());
    setStudents(getStudentsFromStorage(teacherClasses));
    setSelectedSubject(userSubject);
  }, [teacherClasses, userSubject]);

  const addGrade = () => {
    if (!selectedStudent) {
      alert("O'quvchini tanlang!");
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    if (!student) {
      alert("O'quvchi topilmadi!");
      return;
    }

    const newGrade: Grade = {
      id: Date.now().toString(),
      studentId: selectedStudent,
      studentName: student.name,
      studentClass: student.classId,
      subject: selectedSubject,
      score,
      date: new Date().toLocaleDateString('uz-UZ'),
      teacherId: userId,
      teacherName: userName
    };

    const updated = [newGrade, ...grades];
    setGrades(updated);
    saveGradesToStorage(updated);
    
    setNotification(`${student.name} (${student.classId}) ga ${selectedSubject}dan ${score} baho!`);
    setTimeout(() => setNotification(null), 3000);
    setSelectedStudent('');
  };

  if (userRole === 'student') {
    const myGrades = grades.filter(g => g.studentId === userId);
    
    return (
      <div className="rating-page">
        <div className="page-header">
          <h1>📊 Mening Baholarim</h1>
          <p>{user?.classId} sinfi</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Award size={24} />
            <div>
              <span className="stat-value">{myGrades.length}</span>
              <span className="stat-label">Jami baho</span>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={24} />
            <div>
              <span className="stat-value">
                {myGrades.length > 0 
                  ? (myGrades.reduce((acc, g) => acc + g.score, 0) / myGrades.length).toFixed(1) 
                  : '0'}
              </span>
              <span className="stat-label">O'rtacha</span>
            </div>
          </div>
        </div>

        <div className="grades-table card">
          <h3>Baholar tarixi</h3>
          {myGrades.length === 0 ? (
            <div className="empty-state">
              <Award size={48} />
              <p>Hali baholar yo'q</p>
            </div>
          ) : (
            <div className="student-grades-list">
              {myGrades.map(grade => (
                <div key={grade.id} className="student-grade-item">
                  <div className="grade-subject">{grade.subject}</div>
                  <div className={`grade-score score-${grade.score}`}>{grade.score}</div>
                  <div className="grade-teacher">{grade.teacherName}</div>
                  <div className="grade-date">{grade.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const myGivenGrades = grades.filter(g => g.teacherId === userId);

  return (
    <div className="rating-page">
      <div className="page-header">
        <div>
          <h1>📊 Baholash Tizimi</h1>
          <p>
            <GraduationCap size={16} />
            Sizning sinflaringiz: {teacherClasses.join(', ') || 'Tanlanmagan'}
          </p>
        </div>
        <div className="teacher-stats">
          <BookOpen size={16} />
          <span>{userSubject}</span>
        </div>
      </div>

      <div className="rating-tabs">
        <button 
          className={activeTab === 'give' ? 'active' : ''}
          onClick={() => setActiveTab('give')}
        >
          <Star size={18} />
          Baho qo'yish
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          <TrendingUp size={18} />
          Berilgan baholar
        </button>
      </div>

      {notification && (
        <div className="notification success">
          <Award size={20} />
          {notification}
        </div>
      )}

      {activeTab === 'give' && (
        <div className="rating-content">
          <div className="my-classes card">
            <h3>📚 Mening sinflarim</h3>
            <div className="classes-list">
              {teacherClasses.length === 0 ? (
                <p className="warning-text">
                  Sizga hali sinflar biriktirilmagan! 
                  Profil bo'limidan sinflaringizni tanlang.
                </p>
              ) : (
                teacherClasses.map(c => (
                  <span key={c} className="my-class-badge">{c}</span>
                ))
              )}
            </div>
          </div>

          <div className="grade-form card">
            <h3>Yangi baho</h3>
            
            {students.length === 0 ? (
              <div className="empty-warning">
                <Users size={48} />
                <p>Sizning sinflaringizda hali o'quvchilar ro'yxatdan o'tmagan!</p>
                <small>O'quvchilar ro'yxatdan o'tgach, ularni baholay olasiz.</small>
              </div>
            ) : (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label>O'quvchi</label>
                    <select 
                      className="select"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                      <option value="">O'quvchini tanlang...</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.classId})
                        </option>
                      ))}
                    </select>
                    <small className="help-text">
                      Jami: {students.length} ta o'quvchi ({teacherClasses.length} ta sinfdan)
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Fan</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={selectedSubject} 
                      readOnly 
                    />
                    <small className="help-text">Sizning faningiz</small>
                  </div>

                  <div className="form-group full-width">
                    <label>Baho</label>
                    <div className="score-selector">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          className={`score-btn ${score === num ? 'active' : ''}`}
                          onClick={() => setScore(num)}
                        >
                          <Star size={20} className={num <= score ? 'filled' : ''} />
                          <span>{num}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={addGrade} 
                  className="btn btn-primary btn-full"
                  disabled={!selectedStudent}
                >
                  <Award size={18} />
                  {selectedStudent ? 'Bahoni saqlash' : 'O\'quvchini tanlang'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="rating-content">
          <div className="grades-history card">
            <h3>📈 Berilgan baholar ({myGivenGrades.length})</h3>
            
            {myGivenGrades.length === 0 ? (
              <div className="empty-state">
                <TrendingUp size={48} />
                <p>Hali baho qo'yilmagan</p>
              </div>
            ) : (
              <div className="grades-table-modern">
                <div className="table-header">
                  <span>O'quvchi</span>
                  <span>Sinf</span>
                  <span>Fan</span>
                  <span>Baho</span>
                  <span>Sana</span>
                </div>
                {myGivenGrades.map(grade => (
                  <div key={grade.id} className="table-row">
                    <span className="student-name">{grade.studentName}</span>
                    <span className="class-badge-small">{grade.studentClass}</span>
                    <span>{grade.subject}</span>
                    <span className={`score-badge score-${grade.score}`}>{grade.score}</span>
                    <span className="date">{grade.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}