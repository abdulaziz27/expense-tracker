import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/' element={<DashboardPage />} />
                </Routes>
                <ToastContainer />
            </Router>
        </AuthProvider>
    )
}
