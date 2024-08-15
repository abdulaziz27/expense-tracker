import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (credentials) => {
        try {
            await login(credentials.email, credentials.password)
            toast.success('Login successful!')
            navigate('/')
        } catch (error) {
            toast.error(error.message || 'Login failed')
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
            <div className='text-center mb-6'>
                <h1 className='text-3xl font-bold mb-4'>Login</h1>
            </div>
            <AuthForm onSubmit={handleLogin} />
        </div>
    )
}

export default LoginPage
