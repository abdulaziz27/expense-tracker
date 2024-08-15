import axios from 'axios'
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from '../config/config'

export const login = async (credentials) => {
    try {
        const response = await axios.post(LOGIN_ENDPOINT, credentials)
        localStorage.setItem('token', response.data.token)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const register = async (userData) => {
    try {
        const response = await axios.post(REGISTER_ENDPOINT, userData)
        return response.data
    } catch (error) {
        throw error.response.data
    }
}
