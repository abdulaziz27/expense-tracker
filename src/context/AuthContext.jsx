// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
            setIsAuthenticated(true)
        }
    }, [])

    const login = async (email, password) => {
        try {
            const data = await apiLogin({ email, password })
            localStorage.setItem('token', data.token)
            setToken(data.token)
            setIsAuthenticated(true)
            return data
        } catch (error) {
            throw new Error(error.message || 'Login failed')
        }
    }

    const register = async (userData) => {
        try {
            await apiRegister(userData)
        } catch (error) {
            throw new Error(error.message || 'Registration failed')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, token, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
