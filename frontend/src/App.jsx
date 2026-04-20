import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashBoard from './pages/DashBoard'
import Login from './pages/Login'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
            <DashBoard />
        } />
      </Routes>
    </BrowserRouter>
  )
}