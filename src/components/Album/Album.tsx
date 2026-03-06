import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classes } from '../../data/mockData';
import { ImagePlus, Heart, Trash2, Users, Globe, Lock } from 'lucide-react';
import './Album.css';

interface Photo {
  id: string;
  classId: string | 'all'; // 'all' = hamma uchun
  url: string;
  uploadedBy: string;
  uploadedById: string;
  uploadedByClass: string;
  date: string;
  likes: number;
  caption: string;
  visibility: 'class' | 'all'; // class = faqat sinf, all = hamma
}

// LocalStorage dan rasmlarni olish
const getPhotosFromStorage = (): Photo[] => {
  const photos = localStorage.getItem('kundalik_photos');
  return photos ? JSON.parse(photos) : [];
};

const savePhotosToStorage = (photos: Photo[]) => {
  localStorage.setItem('kundalik_photos', JSON.stringify(photos));
};

export default function Album() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'class' | 'all'>('class');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(getPhotosFromStorage());
    setIsLoading(false);
  }, []);

  const userClassId = user?.classId || '';
  const userRole = user?.role || '';
  const userId = user?.id || '';

  // Ko'rinadigan rasmlar
  const visiblePhotos = photos.filter(p => {
    // Admin hamma narsani ko'radi
    if (userRole === 'admin') return true;
    // O'z sinfining rasmlari
    if (p.classId === userClassId) return true;
    // "Hamma uchun" rasmlari
    if (p.visibility === 'all') return true;
    return false;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Rasm hajmini tekshirish (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi 5MB dan oshmasligi kerak!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto: Photo = {
        id: Date.now().toString(),
        classId: visibility === 'all' ? 'all' : userClassId,
        url: reader.result as string,
        uploadedBy: user?.name || 'Anonim',
        uploadedById: userId,
        uploadedByClass: userClassId,
        date: new Date().toLocaleDateString('uz-UZ'),
        likes: 0,
        caption: caption || 'Rasm',
        visibility: visibility
      };

      const updatedPhotos = [newPhoto, ...photos];
      setPhotos(updatedPhotos);
      savePhotosToStorage(updatedPhotos);
      setCaption('');
    };
    reader.readAsDataURL(file);
  };

  const handleLike = (id: string) => {
    const updated = photos.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    );
    setPhotos(updated);
    savePhotosToStorage(updated);
  };

  const handleDelete = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (!photo) return;

    // Faqat o'z rasmini yoki admin o'chira oladi
    if (userRole !== 'admin' && photo.uploadedById !== userId) {
      alert("Faqat o'z rasmingizni o'chira olasiz!");
      return;
    }

    if (confirm('Rasmni o\'chirmoqchimisiz?')) {
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      savePhotosToStorage(updated);
    }
  };

  if (isLoading) return <div className="loading">Yuklanmoqda...</div>;

  return (
    <div className="album-page">
      <div className="page-header">
        <div>
          <h1>📷 Sinf Albomi</h1>
          <p>Xotiralarni saqlang va ulashing</p>
        </div>
        <div className="album-stats">
          <Users size={16} />
          <span>{visiblePhotos.length} ta rasm</span>
        </div>
      </div>

      {/* Rasm yuklash */}
      <div className="upload-section card">
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus size={48} className="upload-icon" />
          <p>Rasm yuklash uchun bosing</p>
          <span>JPG, PNG (max 5MB)</span>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          hidden
        />
        
        <input
          type="text"
          className="input caption-input"
          placeholder="Rasm haqida izoh..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* KO'RINISH TANLASH - MUHIM! */}
        <div className="visibility-selector">
          <label>Kim ko'rishi mumkin:</label>
          <div className="visibility-options">
            <button
              type="button"
              className={`visibility-btn ${visibility === 'class' ? 'active' : ''}`}
              onClick={() => setVisibility('class')}
            >
              <Lock size={16} />
              Faqat {userClassId || 'sinfim'}
            </button>
            <button
              type="button"
              className={`visibility-btn ${visibility === 'all' ? 'active' : ''}`}
              onClick={() => setVisibility('all')}
            >
              <Globe size={16} />
              Hamma uchun
            </button>
          </div>
        </div>
      </div>

      {/* Rasmlar grid */}
      <div className="photos-grid">
        {visiblePhotos.length === 0 ? (
          <div className="empty-state">
            <ImagePlus size={48} />
            <h3>Hali rasmlar yo'q</h3>
            <p>Birinchi bo'lib rasm yuklang!</p>
          </div>
        ) : (
          visiblePhotos.map(photo => (
            <div key={photo.id} className="photo-card">
              <div className="photo-wrapper">
                <img src={photo.url} alt={photo.caption} />
                <div className="photo-overlay">
                  <button 
                    className="overlay-btn like-btn" 
                    onClick={() => handleLike(photo.id)}
                  >
                    <Heart size={20} />
                    <span>{photo.likes}</span>
                  </button>
                  
                  {(userRole === 'admin' || photo.uploadedById === userId) && (
                    <button 
                      className="overlay-btn delete-btn"
                      onClick={() => handleDelete(photo.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="photo-info">
                <div className="photo-badges">
                  {photo.visibility === 'all' ? (
                    <span className="badge global-badge">
                      <Globe size={12} /> Hamma uchun
                    </span>
                  ) : (
                    <span className="badge class-badge">
                      <Lock size={12} /> {photo.classId}
                    </span>
                  )}
                </div>
                <p className="caption">{photo.caption}</p>
                <div className="photo-meta">
                  <span className="author">{photo.uploadedBy}</span>
                  <span className="date">{photo.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}