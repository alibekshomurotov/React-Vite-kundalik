import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Mail, Phone, BookOpen, GraduationCap, Save, User, X, CheckCircle } from 'lucide-react';
import { classes } from '../../data/mockData';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    teacherClasses: user?.teacherClasses || [] as string[]
  });

  const toggleTeacherClass = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      teacherClasses: prev.teacherClasses.includes(classId)
        ? prev.teacherClasses.filter(c => c !== classId)
        : [...prev.teacherClasses, classId]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const updates: any = {
      name: formData.name,
      phone: formData.phone,
      bio: formData.bio,
      avatar: formData.avatar
    };
    
    if (user?.role === 'teacher') {
      updates.teacherClasses = formData.teacherClasses;
    }
    
    const success = await updateProfile(updates);
    setIsLoading(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                <User size={48} />
              </div>
            )}
            {isEditing && (
              <label className="avatar-upload">
                <Camera size={20} />
                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
              </label>
            )}
          </div>
          <div className="profile-title">
            <h1>{user.name}</h1>
            <span className="role-badge">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Shaxsiy ma'lumotlar</h2>
            {!isEditing ? (
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                Tahrirlash
              </button>
            ) : (
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Bekor qilish
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save size={18} />
                  {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            )}
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label><User size={16} /> Ism</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                ) : (
                  <p className="form-value">{user.name}</p>
                )}
              </div>

              <div className="form-group">
                <label><Mail size={16} /> Email</label>
                <p className="form-value">{user.email}</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Phone size={16} /> Telefon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="input"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                ) : (
                  <p className="form-value">{user.phone || "Kiritilmagan"}</p>
                )}
              </div>

              {user.role === 'student' && (
                <div className="form-group">
                  <label><BookOpen size={16} /> Sinf</label>
                  <p className="form-value">{user.classId}</p>
                </div>
              )}

              {user.role === 'teacher' && (
                <div className="form-group">
                  <label><GraduationCap size={16} /> Fan</label>
                  <p className="form-value">{user.subject}</p>
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  className="input"
                  rows={4}
                  placeholder="O'zingiz haqingizda qisqacha..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              ) : (
                <p className="form-value bio">{user.bio || "Bio kiritilmagan"}</p>
              )}
            </div>

            {isEditing && user.role === 'teacher' && (
              <div className="form-group full-width">
                <label className="teacher-edit-label">
                  <BookOpen size={16} />
                  Mening sinflarim
                </label>
                <div className="teacher-classes-edit">
                  {classes.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`class-edit-chip ${formData.teacherClasses.includes(c) ? 'selected' : ''}`}
                      onClick={() => toggleTeacherClass(c)}
                    >
                      {formData.teacherClasses.includes(c) && <CheckCircle size={14} />}
                      {c}
                    </button>
                  ))}
                </div>
                <small className="help-text">
                  Tanlangan: {formData.teacherClasses.length} ta sinf
                </small>
              </div>
            )}

            {!isEditing && user.role === 'teacher' && (
              <div className="profile-section">
                <h4>📚 Mening sinflarim</h4>
                <div className="teacher-classes-display">
                  {user.teacherClasses?.length ? (
                    user.teacherClasses.map(c => (
                      <span key={c} className="class-tag">{c}</span>
                    ))
                  ) : (
                    <span className="empty-tag">Sinf tanlanmagan</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <span className="stat-number">0</span>
            <span className="stat-label">Baho</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">0</span>
            <span className="stat-label">Vazifa</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
            </span>
            <span className="stat-label">Qo'shilgan sana</span>
          </div>
        </div>
      </div>
    </div>
  );
}