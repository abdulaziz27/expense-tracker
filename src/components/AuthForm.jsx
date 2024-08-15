import { useState } from 'react'
import { Link } from 'react-router-dom'

const AuthForm = ({ onSubmit, isRegister }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPasswordConfirmation] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await onSubmit({
                email,
                password,
                ...(isRegister && { name, password_confirmation }),
            })
        } catch (err) {
            console.error('Form submit error:', err.message)
        }
    }

    return (
        <div className='w-full max-w-sm mx-auto p-10 bg-white shadow-md rounded'>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <div className='mb-4'>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Name'
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                )}
                <div className='mb-4'>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        className='w-full p-2 border border-gray-300 rounded'
                    />
                </div>
                <div className='mb-4'>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        className='w-full p-2 border border-gray-300 rounded'
                    />
                </div>
                {isRegister && (
                    <div className='mb-4'>
                        <input
                            type='password'
                            value={password_confirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            placeholder='Retype Password'
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                )}
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white p-2 rounded'
                >
                    {isRegister ? 'Register' : 'Login'}
                </button>
            </form>
            <div className='text-center mt-4'>
                {isRegister ? (
                    <p className='text-md'>
                        Already have an account?{' '}
                        <Link to='/login' className='text-blue-500 underline'>
                            Login here
                        </Link>
                    </p>
                ) : (
                    <p className='text-md'>
                        Don’t have an account?{' '}
                        <Link
                            to='/register'
                            className='text-blue-500 underline'
                        >
                            Register here
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}

export default AuthForm
