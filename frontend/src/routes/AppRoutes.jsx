import { Route, Routes } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import Admin from '../pages/Admin.jsx'
import Analytics from '../pages/Analytics.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Login from '../pages/Login.jsx'
import MissionPlanner from '../pages/MissionPlanner.jsx'
import NotFound from '../pages/NotFound.jsx'
import Profile from '../pages/Profile.jsx'
import ReefDetails from '../pages/ReefDetails.jsx'
import Reports from '../pages/Reports.jsx'
import TeamManagement from '../pages/TeamManagement.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const protectedPage = (Page) => <AppLayout><Page /></AppLayout>

export default function AppRoutes() {
  return <Routes><Route path="/" element={<Login />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={protectedPage(Dashboard)} /><Route path="/reefs" element={protectedPage(ReefDetails)} /><Route path="/reef/:id" element={protectedPage(ReefDetails)} /><Route path="/missions" element={protectedPage(MissionPlanner)} /><Route path="/analytics" element={protectedPage(Analytics)} /><Route path="/reports" element={protectedPage(Reports)} /><Route path="/teams" element={protectedPage(TeamManagement)} /><Route path="/profile" element={protectedPage(Profile)} /><Route path="/admin" element={protectedPage(Admin)} /></Route><Route path="*" element={<NotFound />} /></Routes>
}
