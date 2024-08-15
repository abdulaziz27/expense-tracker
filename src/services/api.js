import axios from 'axios'
import { API_BASE_URL } from '../config/config'

const token = localStorage.getItem('token')

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

export default axiosInstance
