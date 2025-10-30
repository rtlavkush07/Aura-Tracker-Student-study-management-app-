// src/routes/AuthRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/student/SignUp';
import StudentDashboard from '../pages/student/StudentDashboard';
import Profile from '../pages/student/Profile';
import Store from '../pages/student/Store';
import Leaderboard from '../pages/student/Leaderboard';
import PomodoroTimer from '../pages/PomodoroTimer';

const Student = () => {
  return (
    <Routes>
      <Route path="signup" element={<Signup />} />

      <Route path="dashboard/*" element={<StudentDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="store" element={<Store />} />
      <Route path="leaderboard" element={<Leaderboard />} />
      <Route path="signup" element={<Signup />} />
      <Route path="pomodoroTimer" element={<PomodoroTimer />} />
    </Routes>
  );
};



export default Student;
