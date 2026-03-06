import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, AlertCircle, CheckCircle, Shield, BookOpen } from 'lucide-react';
import { classes, subjects } from '../../data/mockData';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    classId: '9-A',
    subject: subjects[0],
    adminCode: '',
    teacherClasses: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, register, error } = useAuth();

  if (user) return <Navigate to="/" replace />;

  const toggleTeacherClass = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      teacherClasses: prev.teacherClasses.includes(classId)
        ? prev.teacherClasses.filter(c => c !== classId)
        : [...prev.teacherClasses, classId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Parollar mos kelmadi!");
      return;
    }
    
    if (formData.password.length < 6) {
      alert("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }
    
    if (formData.role === 'teacher' && formData.teacherClasses.length === 0) {
      alert("Kamida bitta sinf tanlang!");
      return;
    }
    
    setIsLoading(true);
    
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      adminCode: formData.adminCode || undefined,
      ...(formData.role === 'student' && { classId: formData.classId }),
      ...(formData.role === 'teacher' && { 
        subject: formData.subject,
        teacherClasses: formData.teacherClasses 
      })
    };
    
    const success = await register(userData);
    setIsLoading(false);
    
    if (success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="success-message">
            <CheckCircle size={64} className="success-icon" />
            <h2>Muvaffaqiyatli!</h2>
            <p>Ro'yxatdan o'tdingiz. Endi tizimga kirdingiz.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">📚</div>
          <h2>Ro'yxatdan o'tish</h2>
          <p>Yangi akkaunt yarating</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>To'liq ism</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                placeholder="Ism Familiya"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Parol</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Kamida 6 ta belgi"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Parolni tasdiqlang</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Parolni qayta kiriting"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  minLength={6}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rol</label>
              <div className="input-wrapper">
                <GraduationCap size={20} className="input-icon" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="student">O'quvchi</option>
                  <option value="teacher">O'qituvchi</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admin kodi - faqat admin tanlanganda ko'rinadi */}
          {formData.role === 'admin' && (
            <div className="form-group admin-code-section">
              <label className="admin-label">
                <Shield size={16} />
                Maxfiy kod
              </label>
              <input
                type="password"
                className="input admin-input"
                placeholder="Maxfiy kodni kiriting"
                value={formData.adminCode}
                onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                required
              />
              <small className="admin-hint">Administrator huquqi uchun maxfiy kod talab qilinadi</small>
            </div>
          )}

          {formData.role === 'student' && (
            <div className="form-group">
              <label>Sinf</label>
              <select
                className="select"
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value})}
              >
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {formData.role === 'teacher' && (
            <>
              <div className="form-group">
                <label>Fan</label>
                <select
                  className="select"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label className="teacher-classes-label">
                  <BookOpen size={16} />
                  Qaysi sinflarga dars berasiz?
                </label>
                <div className="teacher-classes-grid">
                  {classes.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`class-chip ${formData.teacherClasses.includes(c) ? 'selected' : ''}`}
                      onClick={() => toggleTeacherClass(c)}
                    >
                      {formData.teacherClasses.includes(c) && <CheckCircle size={14} />}
                      {c}
                    </button>
                  ))}
                </div>
                {formData.teacherClasses.length === 0 && (
                  <small className="error-text">Kamida bitta sinf tanlang!</small>
                )}
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Yaratilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Akkauntingiz bormi? <Link to="/login">Kirish</Link></p>
        </div>
      </div>
    </div>
  );
}