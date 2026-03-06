import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Schedule from './components/Schedule/Schedule';
import Rating from './components/Rating/Rating';
import Homework from './components/Homework/Homework';
import Album from './components/Album/Album';
import Teacher from './components/Teacher/Teacher';
import Admin from './components/Admin/Admin';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Schedule />} />
            <Route path="rating" element={<Rating />} />
            <Route path="homework" element={<Homework />} />
            <Route path="album" element={<Album />} />
            <Route path="teachers" element={<Teacher />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;