import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashBoard from './pages/DashBoard'
import Login from './pages/Login'
import { isLoggedIn } from './utils/auth'

function LoginRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  return children
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route
          path="/login"
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}