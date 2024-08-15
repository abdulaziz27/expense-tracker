import React, { useEffect, useState } from 'react'

const WalletModal = ({ isOpen, onClose, onSubmit, wallet }) => {
    const [name, setName] = useState(wallet ? wallet.name : '')

    useEffect(() => {
        if (wallet) {
            setName(wallet.name)
        }
    }, [wallet])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ name })
        setName('')
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white p-6 rounded-md w-96'>
                <h2 className='text-xl font-bold mb-4'>
                    {wallet ? 'Edit Wallet' : 'Add Wallet'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>
                            Wallet Name
                        </label>
                        <input
                            type='text'
                            className='w-full mt-2 p-2 border rounded'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex justify-end space-x-2'>
                        <button
                            type='button'
                            className='px-4 py-2 bg-gray-500 text-white rounded'
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                        >
                            {wallet ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WalletModal
