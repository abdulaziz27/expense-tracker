import React, { useEffect, useState } from 'react'

const ExpenseModal = ({
    isOpen,
    onClose,
    onSubmit,
    expense,
    categories,
    wallets,
}) => {
    const [name, setName] = useState(expense ? expense.name : '')
    const [amount, setAmount] = useState(expense ? expense.amount : '')
    const [categoryId, setCategoryId] = useState(
        expense ? expense.category_id : '',
    )
    const [walletId, setWalletId] = useState(expense ? expense.wallet_id : '')
    const [time, setTime] = useState(
        expense ? expense.time : new Date().toISOString().slice(0, 16),
    )

    useEffect(() => {
        if (expense) {
            setName(expense.name)
            setAmount(expense.amount)
            setCategoryId(expense.category_id)
            setWalletId(expense.wallet_id)
            setTime(expense.time)
        }
    }, [expense])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({
            name,
            amount,
            category_id: categoryId,
            wallet_id: walletId,
            time,
        })
        // Reset form fields
        setName('')
        setAmount('')
        setCategoryId('')
        setWalletId('')
        setTime(new Date().toISOString().slice(0, 16))
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto'>
            <div className='bg-white p-6 rounded-md w-96'>
                <h2 className='text-xl font-bold mb-4'>
                    {expense ? 'Edit Expense' : 'Add Expense'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>
                            Expense Name
                        </label>
                        <input
                            type='text'
                            className='w-full mt-2 p-2 border rounded'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Amount</label>
                        <input
                            type='number'
                            className='w-full mt-2 p-2 border rounded'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Category</label>
                        <select
                            className='w-full mt-2 p-2 border rounded'
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value='' disabled>
                                Select Category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.type})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Wallet</label>
                        <select
                            className='w-full mt-2 p-2 border rounded'
                            value={walletId}
                            onChange={(e) => setWalletId(e.target.value)}
                            required
                        >
                            <option value='' disabled>
                                Select Wallet
                            </option>
                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Time</label>
                        <input
                            type='datetime-local'
                            className='w-full mt-2 p-2 border rounded'
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
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
                            {expense ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ExpenseModal
