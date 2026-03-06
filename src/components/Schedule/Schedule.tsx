import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { scheduleData, classes } from '../../data/mockData';
import { Clock, User, Calendar, BookOpen } from 'lucide-react';
import './Schedule.css';

const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'];

export default function Schedule() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(user?.classId || '9-A');
  const [selectedDay, setSelectedDay] = useState('Dushanba');

  const userClassId = user?.classId;
  const userRole = user?.role;

  // Admin barcha sinflarni ko'radi, o'quvchi faqat o'zini
  const availableClasses = userRole === 'admin' ? classes : [userClassId || '9-A'];

  // Darslarni filtrlash
  const filteredSchedule = useMemo(() => {
    return scheduleData.filter(
      item => item.classId === selectedClass && item.day === selectedDay
    ).sort((a, b) => {
      const timeA = parseInt(a.time.split(':')[0]);
      const timeB = parseInt(b.time.split(':')[0]);
      return timeA - timeB;
    });
  }, [selectedClass, selectedDay]);

  // Darslar sonini hisoblash
  const lessonCount = filteredSchedule.length;

  return (
    <div className="schedule-page">
      <div className="page-header">
        <div>
          <h1>📅 Dars Jadvali</h1>
          <p>Haftalik dars rejasi</p>
        </div>
        <div className="lesson-count-badge">
          <BookOpen size={16} />
          <span>{lessonCount} ta dars</span>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Sinf</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="select"
            disabled={userRole !== 'admin'}
          >
            {availableClasses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="days-tabs">
          {days.map(day => (
            <button
              key={day}
              className={`day-tab ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="schedule-list">
        {filteredSchedule.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>Bu kun uchun dars jadvali yo'q</p>
          </div>
        ) : (
          filteredSchedule.map((item, index) => (
            <div key={item.id} className="schedule-card">
              <div className="lesson-number">{index + 1}</div>
              <div className="schedule-info">
                <h3>{item.subject}</h3>
                <div className="schedule-meta">
                  <span><User size={16} /> {item.teacher}</span>
                  <span><Clock size={16} /> {item.time}</span>
                </div>
              </div>
              <div className="lesson-time-badge">{item.time}</div>
            </div>
          ))
        )}
      </div>

      <div className="schedule-summary">
        <div className="summary-item">
          <Calendar size={20} />
          <span>{selectedDay} - {lessonCount} ta dars</span>
        </div>
        <div className="summary-item">
          <BookOpen size={20} />
          <span>{selectedClass} sinfi</span>
        </div>
      </div>
    </div>
  );
}