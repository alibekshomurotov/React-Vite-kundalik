import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react';
import './Teacher.css';

export default function TeacherDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: 'O\'quvchilar', value: '86', color: 'blue', trend: '+5%' },
    { icon: BookOpen, label: 'Vazifalar', value: '12', color: 'purple', trend: '3 ta yangi' },
    { icon: CheckCircle, label: 'Tekshirilgan', value: '45', color: 'green', trend: '90%' },
    { icon: Clock, label: 'Kutilmoqda', value: '8', color: 'orange', trend: '2 ta kechikkan' },
  ];

  const recentActivities = [
    { action: 'Yangi vazifa qo\'shdi', subject: 'Matematika', class: '9-A', time: '2 soat oldin' },
    { action: 'Baho qo\'ydi', subject: 'Algebra', student: 'Ahmadov A.', time: '3 soat oldin' },
    { action: 'Dars jadvali yangilandi', subject: 'Fizika', class: '10-B', time: '5 soat oldin' },
  ];

  const myClasses = [
    { name: '9-A', students: 24, subject: 'Matematika', progress: 85 },
    { name: '9-B', students: 22, subject: 'Matematika', progress: 78 },
    { name: '10-A', students: 26, subject: 'Algebra', progress: 92 },
  ];

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Xush kelibsiz, {user?.name}! 👋</h1>
          <p>Bugun nima qilishni rejalashtiryapsiz?</p>
        </div>
        <div className="date-badge">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <span className={`stat-trend ${stat.trend.includes('+') ? 'up' : ''}`}>
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Mening Sinflarim</h3>
            <button className="btn btn-sm btn-primary">Barchasi</button>
          </div>
          <div className="classes-list">
            {myClasses.map(cls => (
              <div key={cls.name} className="class-item">
                <div className="class-info">
                  <div className="class-avatar">{cls.name}</div>
                  <div>
                    <h4>{cls.name} sinfi</h4>
                    <p>{cls.students} ta o'quvchi • {cls.subject}</p>
                  </div>
                </div>
                <div className="class-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${cls.progress}%` }}></div>
                  </div>
                  <span>{cls.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>So'nggi faoliyat</h3>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-details">
                    {activity.subject} • {activity.class || activity.student}
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Tezkor amallar</h3>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon blue">
              <BookOpen size={24} />
            </div>
            <span>Vazifa qo'shish</span>
          </button>
          <button className="action-card">
            <div className="action-icon green">
              <CheckCircle size={24} />
            </div>
            <span>Baho qo'yish</span>
          </button>
          <button className="action-card">
            <div className="action-icon purple">
              <TrendingUp size={24} />
            </div>
            <span>Reyting ko'rish</span>
          </button>
          <button className="action-card">
            <div className="action-icon orange">
              <Calendar size={24} />
            </div>
            <span>Dars jadvali</span>
          </button>
        </div>
      </div>
    </div>
  );
}