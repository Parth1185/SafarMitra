import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TDashboard from './pages/TDashboard'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import TBook from "./pages/TBook";
import TTickets from "./pages/TTickets";
import TServices from "./pages/TServices";
import LiveStation from "./pages/LiveStation";
import TTime from "./pages/TTime";
import TFinder from "./pages/TFinder";





export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tbook" element={<TBook />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/thistory" element={<TTickets />} />
      <Route path="/tdashboard" element={<TDashboard />} />
      <Route path="/tservices" element={<TServices />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
  <Route path="/ttime" element={<TTime />} />
  <Route path="/tlist" element={<TFinder />} />

  <Route path="/live-station" element={<LiveStation />} />

    </Routes>
  )
}
