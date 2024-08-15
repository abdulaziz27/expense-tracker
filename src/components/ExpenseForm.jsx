import React, { useState, useEffect } from 'react'

const ExpenseForm = ({ onSubmit, expense }) => {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [time, setTime] = useState('')

    useEffect(() => {
        if (expense) {
            setName(expense.name)
            setAmount(expense.amount)
            setTime(expense.time)
        }
    }, [expense])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ name, amount, time })
    }

    return (
        <form onSubmit={handleSubmit} className='mb-4'>
            <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Name'
                className='w-full p-2 border border-gray-300 rounded mb-2'
            />
            <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='Amount'
                className='w-full p-2 border border-gray-300 rounded mb-2'
            />
            <input
                type='datetime-local'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder='Time'
                className='w-full p-2 border border-gray-300 rounded mb-2'
            />
            <button
                type='submit'
                className='bg-blue-500 text-white p-2 rounded'
            >
                {expense ? 'Update Expense' : 'Add Expense'}
            </button>
        </form>
    )
}

export default ExpenseForm
