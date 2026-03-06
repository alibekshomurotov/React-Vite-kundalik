import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { homeworkData as initialHomework, subjects, classes } from '../../data/mockData';
import { BookOpen, Clock, User, CheckCircle, Plus, X, GraduationCap } from 'lucide-react';
import './Homework.css';

interface Homework {
  id: string;
  classId: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

// LocalStorage dan vazifalarni olish
const getHomeworkFromStorage = (): Homework[] => {
  const hw = localStorage.getItem('kundalik_homework');
  if (hw) return JSON.parse(hw);
  localStorage.setItem('kundalik_homework', JSON.stringify(initialHomework));
    return initialHomework;
};

const saveHomeworkToStorage = (hw: Homework[]) => {
  localStorage.setItem('kundalik_homework', JSON.stringify(hw));
};

export default function Homework() {
  const { user } = useAuth();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Forma ma'lumotlari
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    subject: subjects[0],
    classId: '', // O'qituvchi tanlaydi
    deadline: ''
  });

  useEffect(() => {
    setHomeworks(getHomeworkFromStorage());
    setIsLoading(false);
  }, []);

  const userRole = user?.role || '';
  const userClassId = user?.classId || '';
  const userId = user?.id || '';

  // O'qituvchi uchun - faqat o'zi yaratgan vazifalar
  const teacherHomeworks = homeworks.filter(h => h.teacherId === userId);

  // O'quvchi uchun - faqat o'z sinfining vazifalari
  const studentHomeworks = homeworks.filter(h => h.classId === userClassId);

  const handleAddHomework = () => {
    if (!newHomework.classId) {
      alert("Iltimos, sinf tanlang!");
      return;
    }

    if (!newHomework.title || !newHomework.deadline) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    const hw: Homework = {
      id: Date.now().toString(),
      ...newHomework,
      teacherId: userId,
      teacherName: user?.name || '',
      createdAt: new Date().toISOString()
    };

    const updated = [hw, ...homeworks];
    setHomeworks(updated);
    saveHomeworkToStorage(updated);

    // Formani tozalash
    setNewHomework({
      title: '',
      description: '',
      subject: subjects[0],
      classId: '',
      deadline: ''
    });
    setShowForm(false);
  };

  // O'chirish (faqat o'zini yaratganini)
  const handleDelete = (id: string) => {
    const hw = homeworks.find(h => h.id === id);
    if (hw?.teacherId !== userId) {
      alert("Faqat o'z vazifangizni o'chira olasiz!");
      return;
    }

    if (confirm('Vazifani o\'chirmoqchimisiz?')) {
      const updated = homeworks.filter(h => h.id !== id);
      setHomeworks(updated);
      saveHomeworkToStorage(updated);
    }
  };

  if (isLoading) return <div className="loading">Yuklanmoqda...</div>;

  // O'QITUVCHI KO'RINISHI
  if (userRole === 'teacher') {
    return (
      <div className="homework-page">
        <div className="page-header">
          <div>
            <h1>📚 Mening Vazifalarim</h1>
            <p>Sinflaringizga vazifa qo'shing</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            Yangi vazifa
          </button>
        </div>

        {showForm && (
          <div className="homework-form card">
            <div className="form-header">
              <h3>Yangi vazifa qo'shish</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              {/* SINF TANLASH - MUHIM! */}
              <div className="form-group full-width">
                <label>
                  <GraduationCap size={16} />
                  Qaysi sinfga?
                </label>
                <select
                  className="select"
                  value={newHomework.classId}
                  onChange={(e) => setNewHomework({...newHomework, classId: e.target.value})}
                  required
                >
                  <option value="">Sinf tanlang...</option>
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {!newHomework.classId && (
                  <small className="error-text">Sinf tanlash majburiy!</small>
                )}
              </div>

              <div className="form-group">
                <label>Fan</label>
                <select
                  className="select"
                  value={newHomework.subject}
                  onChange={(e) => setNewHomework({...newHomework, subject: e.target.value})}
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Tugash sanasi</label>
                <input
                  type="date"
                  className="input"
                  value={newHomework.deadline}
                  onChange={(e) => setNewHomework({...newHomework, deadline: e.target.value})}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Sarlavha</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Mavzu nomi"
                  value={newHomework.title}
                  onChange={(e) => setNewHomework({...newHomework, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Tavsif</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Vazifa tavsifi..."
                  value={newHomework.description}
                  onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Bekor qilish
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAddHomework}
                disabled={!newHomework.classId}
              >
                {newHomework.classId 
                  ? `${newHomework.classId} ga yuborish` 
                  : 'Sinf tanlang'}
              </button>
            </div>
          </div>
        )}

        {/* O'qituvchining vazifalari ro'yxati */}
        <div className="homework-list">
          {teacherHomeworks.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} />
              <p>Hozircha vazifalar yo'q</p>
              <small>Yangi vazifa qo'shing</small>
            </div>
          ) : (
            teacherHomeworks.map(hw => (
              <div key={hw.id} className="homework-card teacher-card">
                <div className="homework-header">
                  <span className="subject-badge">{hw.subject}</span>
                  <span className="target-class">{hw.classId}</span>
                </div>
                <h3>{hw.title}</h3>
                <p className="homework-desc">{hw.description}</p>
                <div className="homework-footer">
                  <span className="deadline">
                    <Clock size={14} />
                    {hw.deadline}
                  </span>
                  <button 
                    className="btn-icon delete"
                    onClick={() => handleDelete(hw.id)}
                    title="O'chirish"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // O'QUVCHI KO'RINISHI
  return (
    <div className="homework-page">
      <div className="page-header">
        <div>
          <h1>📚 Mening Vazifalarim</h1>
          <p>{userClassId} sinfi uchun</p>
        </div>
        <div className="homework-count">
          <BookOpen size={16} />
          <span>{studentHomeworks.length} ta</span>
        </div>
      </div>

      <div className="homework-list">
        {studentHomeworks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} />
            <h3>Hozircha vazifalar yo'q!</h3>
            <p>Dam oling 😊</p>
          </div>
        ) : (
          studentHomeworks.map(hw => (
            <div key={hw.id} className="homework-card student-card">
              <div className="homework-header">
                <span className="subject-badge">{hw.subject}</span>
                <span className={`deadline-badge ${isOverdue(hw.deadline) ? 'overdue' : ''}`}>
                  {hw.deadline}
                </span>
              </div>
              <h3>{hw.title}</h3>
              <p className="homework-desc">{hw.description}</p>
              <div className="homework-footer">
                <span className="teacher">
                  <User size={14} />
                  {hw.teacherName}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function isOverdue(date: string) {
  return new Date(date) < new Date();
}