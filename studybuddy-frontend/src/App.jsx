import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import PathDetail from './pages/PathDetail'
import Chat from './pages/Chat'
import Quiz from './pages/Quiz'
import AdminDashboard from './pages/AdminDashboard'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/path/:pathId" element={
            <ProtectedRoute><PathDetail /></ProtectedRoute>
          } />
          <Route path="/chat/:pathId" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/quiz/:pathId" element={
            <ProtectedRoute><Quiz /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App