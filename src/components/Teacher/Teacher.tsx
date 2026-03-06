import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { subjects, classes, scheduleData } from '../../data/mockData';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  Search,
  Filter,
  Award,
  BookOpen,
  Calendar,
  Clock
} from 'lucide-react';
import './Teacher.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subject?: string;
  phone?: string;
  avatar?: string;
  teacherClasses?: string[];
  createdAt: string;
}

interface ScheduleItem {
  id: string;
  classId: string;
  day: string;
  subject: string;
  time: string;
  teacher: string;
}

const getUsersFromStorage = (): User[] => {
  const users = localStorage.getItem('kundalik_users');
  if (!users) return [];
  try {
    return JSON.parse(users);
  } catch {
    return [];
  }
};

export default function Teacher() {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [teacherSchedule, setTeacherSchedule] = useState<ScheduleItem[]>([]);
  
  useEffect(() => {
    const allUsers = getUsersFromStorage();
    const teachersList = allUsers.filter(u => u.role === 'teacher');
    setTeachers(teachersList);
  }, []);

  // O'qituvchi dars jadvalini olish
  const getTeacherSchedule = (teacherName: string): ScheduleItem[] => {
    return scheduleData.filter(s => s.teacher === teacherName);
  };

  // O'qituvchini tanlash
  const handleTeacherClick = (teacher: User) => {
    setSelectedTeacher(teacher);
    const schedule = getTeacherSchedule(teacher.name);
    setTeacherSchedule(schedule);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="teacher-page">
      <div className="page-header-modern">
        <div className="header-content">
          <h1>👨‍🏫 O'qituvchilar</h1>
          <p>Maktab o'qituvchilari va ularning dars jadvallari</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <GraduationCap size={16} />
            <span>{teachers.length} nafar</span>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={16} />
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">Barcha fanlar</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tanlangan o'qituvchi dars jadvali */}
      {selectedTeacher && (
        <div className="teacher-schedule-modal">
          <div className="schedule-header">
            <div>
              <h3>📅 {selectedTeacher.name} - Dars Jadvali</h3>
              <p>{selectedTeacher.subject} o'qituvchisi</p>
            </div>
            <button 
              className="close-schedule-btn"
              onClick={() => setSelectedTeacher(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="schedule-days">
            {['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'].map(day => {
              const dayLessons = teacherSchedule.filter(s => s.day === day);
              return (
                <div key={day} className="schedule-day-card">
                  <h4>{day}</h4>
                  <div className="day-lessons">
                    {dayLessons.length === 0 ? (
                      <span className="no-lessons">Dars yo'q</span>
                    ) : (
                      dayLessons.map((lesson, idx) => (
                        <div key={lesson.id} className="lesson-item">
                          <span className="lesson-number">{idx + 1}</span>
                          <div className="lesson-info">
                            <span className="lesson-subject">{lesson.subject}</span>
                            <span className="lesson-class">{lesson.classId}</span>
                          </div>
                          <span className="lesson-time">
                            <Clock size={12} />
                            {lesson.time}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="teachers-grid">
        {filteredTeachers.length === 0 ? (
          <div className="empty-state-modern">
            <GraduationCap size={64} />
            <h3>O'qituvchi topilmadi</h3>
            <p>Qidiruv parametrlarini o'zgartiring</p>
          </div>
        ) : (
          filteredTeachers.map(teacher => (
            <div 
              key={teacher.id} 
              className="teacher-card-modern"
              onClick={() => handleTeacherClick(teacher)}
            >
              <div className="teacher-header">
                <div className="teacher-avatar-large">
                  {teacher.avatar ? (
                    <img src={teacher.avatar} alt={teacher.name} />
                  ) : (
                    <span>{teacher.name.charAt(0)}</span>
                  )}
                </div>
                <div className="teacher-badge">
                  <Award size={14} />
                  {teacher.subject || 'Fan belgilanmagan'}
                </div>
              </div>
              
              <div className="teacher-info">
                <h3>{teacher.name}</h3>
                <p className="teacher-role">O'qituvchi</p>
                
                <div className="teacher-contacts">
                  <div className="contact-item">
                    <Mail size={14} />
                    <span>{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="contact-item">
                      <Phone size={14} />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                </div>

                <div className="teacher-meta">
                  <div className="meta-item">
                    <BookOpen size={14} />
                    <span>{teacher.subject || 'Fan belgilanmagan'}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{teacher.teacherClasses?.length || 0} ta sinf</span>
                  </div>
                </div>

                <div className="teacher-schedule-hint">
                  <Clock size={14} />
                  <span>Dars jadvalini ko'rish uchun bosing</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}