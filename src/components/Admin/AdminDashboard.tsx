import { useAuth } from '../../context/AuthContext';
import { Users, GraduationCap, School, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import './Admin.css';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: "O'quvchilar", value: '1,245', change: '+12%', color: 'blue' },
    { icon: GraduationCap, label: "O'qituvchilar", value: '68', change: '+3', color: 'green' },
    { icon: School, label: 'Sinflar', value: '24', change: '0', color: 'purple' },
    { icon: TrendingUp, label: 'Faollik', value: '94%', change: '+5%', color: 'orange' },
  ];

  const recentUsers = [
    { name: 'Ahmadov Ahmad', role: 'student', class: '9-A', date: '2 daqiqa oldin', status: 'active' },
    { name: 'Karimova Nodira', role: 'teacher', subject: 'Matematika', date: '15 daqiqa oldin', status: 'active' },
    { name: 'Rahimov Bobur', role: 'student', class: '10-B', date: '32 daqiqa oldin', status: 'pending' },
  ];

  const alerts = [
    { type: 'warning', message: '3 ta o\'qituvchi dars jadvalini to\'ldirmagan' },
    { type: 'info', message: 'Tizim yangilanishi: 2024-01-25' },
    { type: 'success', message: 'Oylik hisobot tayyor' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Tizim boshqaruv paneli</p>
        </div>
        <div className="admin-stats-badge">
          <Activity size={18} />
          <span>Tizim ishlayapti</span>
        </div>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`admin-stat-card ${stat.color}`}>
            <div className="stat-header">
              <span className="stat-change">{stat.change}</span>
            </div>
            <div className="stat-body">
              <stat.icon size={32} />
              <div>
                <span className="stat-number">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-content-grid">
        <div className="admin-card">
          <div className="card-header">
            <h3>Yangi foydalanuvchilar</h3>
            <button className="btn btn-sm">Barchasi</button>
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th>Rol</th>
                  <th>Sana</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-sm">{user.name.charAt(0)}</div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-tag ${user.role}`}>
                        {user.role === 'student' ? "O'quvchi" : 
                         user.role === 'teacher' ? "O'qituvchi" : 'Admin'}
                      </span>
                    </td>
                    <td className="text-muted">{user.date}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === 'active' ? 'Faol' : 'Kutilmoqda'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card alerts-card">
          <div className="card-header">
            <h3>Bildirishnomalar</h3>
          </div>
          <div className="alerts-list">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`alert-item ${alert.type}`}>
                <AlertCircle size={18} />
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-quick-actions">
        <h3>Tezkor amallar</h3>
        <div className="admin-actions-grid">
          <button className="admin-action-btn primary">
            <Users size={20} />
            <span>O'quvchi qo'shish</span>
          </button>
          <button className="admin-action-btn primary">
            <GraduationCap size={20} />
            <span>O'qituvchi qo'shish</span>
          </button>
          <button className="admin-action-btn secondary">
            <School size={20} />
            <span>Sinf yaratish</span>
          </button>
          <button className="admin-action-btn secondary">
            <Activity size={20} />
            <span>Hisobot ko'rish</span>
          </button>
        </div>
      </div>
    </div>
  );
}