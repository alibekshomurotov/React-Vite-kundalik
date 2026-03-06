import { useState, useEffect } from 'react';
import { classes } from '../../data/mockData';
import { 
  Users, 
  GraduationCap, 
  Shield, 
  Trash2, 
  Search,
  Activity,
  UserPlus,
  Ban,
  BookOpen,
  Calendar,
  TrendingUp
} from 'lucide-react';
import './Admin.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  classId?: string;
  subject?: string;
  teacherClasses?: string[];
  createdAt: string;
}

type TabType = 'overview' | 'students' | 'teachers' | 'admins';

const getUsersFromStorage = (): User[] => {
  const users = localStorage.getItem('kundalik_users');
  if (!users) return [];
  try {
    return JSON.parse(users);
  } catch {
    return [];
  }
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  useEffect(() => {
    setAllUsers(getUsersFromStorage());
  }, []);

  const students = allUsers.filter(u => u.role === 'student');
  const teachers = allUsers.filter(u => u.role === 'teacher');
  const admins = allUsers.filter(u => u.role === 'admin');

  const stats = [
    { 
      icon: Users, 
      label: "O'quvchilar", 
      value: students.length.toString(), 
      color: 'blue' 
    },
    { 
      icon: GraduationCap, 
      label: "O'qituvchilar", 
      value: teachers.length.toString(), 
      color: 'green' 
    },
    { 
      icon: Shield, 
      label: 'Adminlar', 
      value: admins.length.toString(), 
      color: 'purple' 
    },
    { 
      icon: Activity, 
      label: 'Jami', 
      value: allUsers.length.toString(), 
      color: 'orange' 
    },
  ];

  const getFilteredUsers = (): User[] => {
    let users: User[] = [];
    if (activeTab === 'students') users = students;
    else if (activeTab === 'teachers') users = teachers;
    else if (activeTab === 'admins') users = admins;
    
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === 'all' || user.classId === selectedClass;
      return matchesSearch && matchesClass;
    });
  };

  const handleDelete = (userId: string) => {
    if (confirm('Foydalanuvchini o\'chirmoqchimisiz?')) {
      const updated = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('kundalik_users', JSON.stringify(updated));
      setAllUsers(updated);
    }
  };

  // Overview / Dashboard
  if (activeTab === 'overview') {
    return (
      <div className="admin-page-modern">
        <div className="admin-header">
          <div>
            <h1>⚡ Admin Dashboard</h1>
            <p>Tizim boshqaruvi va statistika</p>
          </div>
          <div className="admin-badge">
            <Shield size={16} />
            <span>Administrator</span>
          </div>
        </div>

        <div className="stats-grid-modern">
          {stats.map((stat, idx) => (
            <div key={idx} className={`stat-card-modern ${stat.color}`}>
              <div className="stat-icon-modern">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value-modern">{stat.value}</span>
                <span className="stat-label-modern">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📊 So'nggi faollik</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot green"></div>
                <span>Yangi o'quvchi qo'shildi</span>
                <small>2 daqiqa oldin</small>
              </div>
              <div className="activity-item">
                <div className="activity-dot blue"></div>
                <span>O'qituvchi yangi vazifa yaratdi</span>
                <small>15 daqiqa oldin</small>
              </div>
              <div className="activity-item">
                <div className="activity-dot purple"></div>
                <span>Admin tizimga kirdi</span>
                <small>1 soat oldin</small>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>🎯 Tezkor harakatlar</h3>
            <div className="quick-actions">
              <button className="quick-btn" onClick={() => setActiveTab('students')}>
                <UserPlus size={20} />
                <span>O'quvchilarni ko'rish</span>
              </button>
              <button className="quick-btn" onClick={() => setActiveTab('teachers')}>
                <GraduationCap size={20} />
                <span>O'qituvchilarni ko'rish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className="admin-page-modern">
      <div className="admin-header">
        <div>
          <h1>
            {activeTab === 'students' && "👨‍🎓 O'quvchilar boshqaruvi"}
            {activeTab === 'teachers' && "👨‍🏫 O'qituvchilar boshqaruvi"}
            {activeTab === 'admins' && "⚡ Adminlar boshqaruvi"}
          </h1>
          <p>Foydalanuvchilarni boshqarish</p>
        </div>
      </div>

      <div className="admin-tabs-modern">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={18} />
          Dashboard
        </button>
        <button 
          className={activeTab === 'students' ? 'active' : ''}
          onClick={() => setActiveTab('students')}
        >
          <Users size={18} />
          O'quvchilar
        </button>
        <button 
          className={activeTab === 'teachers' ? 'active' : ''}
          onClick={() => setActiveTab('teachers')}
        >
          <GraduationCap size={18} />
          O'qituvchilar
        </button>
        <button 
          className={activeTab === 'admins' ? 'active' : ''}
          onClick={() => setActiveTab('admins')}
        >
          <Shield size={18} />
          Adminlar
        </button>
      </div>

      <div className="admin-filters">
        <div className="search-box-modern">
          <Search size={18} />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {activeTab === 'students' && (
          <div className="filter-modern">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Barcha sinflar</option>
              {classes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="users-table-modern">
        <div className="table-header">
          <span>Foydalanuvchi</span>
          <span>Email</span>
          {activeTab === 'students' && <span>Sinf</span>}
          {activeTab === 'teachers' && <span>Fan / Sinflar</span>}
          {activeTab === 'admins' && <span>Rol</span>}
          <span>Qo'shilgan</span>
          <span>Amallar</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="table-empty">
            <Users size={48} />
            <p>Foydalanuvchi topilmadi</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="user-cell">
                <div className="user-avatar-small">
                  {user.name.charAt(0)}
                </div>
                <span className="user-name">{user.name}</span>
              </div>
              <span className="email-cell">{user.email}</span>
              
              {activeTab === 'students' && (
                <span className="badge-cell">
                  <span className="class-badge">{user.classId || '-'}</span>
                </span>
              )}
              
              {activeTab === 'teachers' && (
                <span className="badge-cell">
                  <span className="subject-badge">{user.subject}</span>
                  <br />
                  <small className="teacher-classes-small">
                    {user.teacherClasses?.join(', ') || 'Sinf tanlanmagan'}
                  </small>
                </span>
              )}
              
              {activeTab === 'admins' && (
                <span className="badge-cell">
                  <span className="admin-badge-small">Admin</span>
                </span>
              )}
              
              <span className="date-cell">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : '-'}
              </span>
              
              <div className="actions-cell">
                <button className="icon-btn-modern ban" title="Bloklash">
                  <Ban size={16} />
                </button>
                <button 
                  className="icon-btn-modern delete" 
                  title="O'chirish"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}