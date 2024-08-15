import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RegisterPage = () => {
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleRegister = async (userData) => {
        try {
            await register(userData)
            toast.success('Registration successful!')
            navigate('/login')
        } catch (error) {
            toast.error(error.message || 'Registration failed')
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='text-center mb-6'>
                <h1 className='text-3xl font-bold mb-4'>Register</h1>
            </div>
            <AuthForm onSubmit={handleRegister} isRegister={true} />
        </div>
    )
}

export default RegisterPage
