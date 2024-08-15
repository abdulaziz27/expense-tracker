import React, { useEffect, useState } from 'react'
import {
    PlusCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import WalletModal from '../components/WalletModal'
import ExpenseModal from '../components/ExpenseModal'
import formatRupiah from '../utils/FormatRupiah'
import axiosInstance from '../services/api'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { isAuthenticated, logout } = useAuth()
    const [wallets, setWallets] = useState([])
    const [expenses, setExpenses] = useState([])
    const [categories, setCategories] = useState([])
    const [walletModalOpen, setWalletModalOpen] = useState(false)
    const [expenseModalOpen, setExpenseModalOpen] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState(null)
    const [selectedExpense, setSelectedExpense] = useState(null)

    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const perPage = 10

    // Search, Filter States
    const [searchQuery, setSearchQuery] = useState('')
    const [minAmount, setMinAmount] = useState('')
    const [maxAmount, setMaxAmount] = useState('')
    const [filterWallet, setFilterWallet] = useState('')
    const [filterCategory, setFilterCategory] = useState('')

    const fetchWallets = async () => {
        try {
            const response = await axiosInstance.get('/wallet')
            setWallets(response.data.data)
        } catch (error) {
            console.error('Error fetching wallets', error)
        }
    }

    const fetchExpenses = async (page = 1) => {
        try {
            // Bikin params dinamis
            const params = {
                page,
                per_page: perPage,
                ...(searchQuery && { search: searchQuery }),
                ...(minAmount && { min_amount: minAmount }),
                ...(maxAmount && { max_amount: maxAmount }),
                ...(filterWallet && { wallet_id: filterWallet }),
                ...(filterCategory && { category_id: filterCategory }),
            }

            const response = await axiosInstance.get('/expense', { params })

            console.log(response.data) // Debugging

            setExpenses(response.data.data)
            setCurrentPage(response.data.current_page)
            setTotalPages(response.data.last_page)
        } catch (error) {
            console.error('Error fetching expenses:', error)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/category?per_page=100')
            setCategories(response.data.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    // Menghitung total pemasukan dan pengeluaran
    useEffect(() => {
        let totalIncome = 0
        let totalExpense = 0

        expenses.forEach((expense) => {
            const category = categories.find(
                (cat) => cat.id === expense.category_id,
            )
            if (category) {
                if (category.type === 'income') {
                    totalIncome += parseFloat(expense.amount)
                } else if (category.type === 'expense') {
                    totalExpense += parseFloat(expense.amount)
                }
            }
        })

        setTotalIncome(totalIncome)
        setTotalExpense(totalExpense)
    }, [expenses, categories])

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login page or show an authentication message
            return
        }
        fetchWallets()
        fetchExpenses()
        fetchCategories()
    }, [
        currentPage,
        searchQuery,
        minAmount,
        maxAmount,
        filterWallet,
        filterCategory,
        isAuthenticated,
    ])

    if (!isAuthenticated) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-gray-100'>
                <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
                    <h2 className='text-2xl font-bold mb-4'>
                        You are not authenticated yet
                    </h2>
                    <p className='text-gray-600 mb-6'>
                        Please log in to access the dashboard.
                    </p>
                </div>
            </div>
        )
    }

    const goToPage = (page) => {
        fetchExpenses(page)
    }

    const handleAddWallet = async (walletData) => {
        try {
            await axiosInstance.post('/wallet', walletData)
            fetchWallets()
            setWalletModalOpen(false)
        } catch (error) {
            console.error('Error adding wallet:', error)
        }
    }

    const handleEditWallet = async (walletData) => {
        try {
            await axiosInstance.put(`/wallet/${selectedWallet.id}`, walletData)
            fetchWallets()
            setSelectedWallet(null)
            setWalletModalOpen(false)
        } catch (error) {
            console.error('Error editing wallet:', error)
        }
    }

    const handleDeleteWallet = async (walletId) => {
        if (window.confirm('Are you sure you want to delete this wallet?')) {
            try {
                await axiosInstance.delete(`/wallet/${walletId}`)
                fetchWallets()
            } catch (error) {
                console.error('Error deleting wallet:', error)
            }
        }
    }

    const handleAddExpense = async (expenseData) => {
        try {
            const { wallet_id, ...rest } = expenseData
            await axiosInstance.post(`/wallet/${wallet_id}/expense`, rest)
            fetchExpenses()
            setExpenseModalOpen(false)
        } catch (error) {
            console.error('Error adding expense:', error)
        }
    }

    const handleEditExpense = async (expenseData) => {
        try {
            await axiosInstance.put(
                `/expense/${selectedExpense.id}`,
                expenseData,
            )
            fetchExpenses()
            setSelectedExpense(null)
            setExpenseModalOpen(false)
        } catch (error) {
            console.error('Error editing expense:', error)
        }
    }

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axiosInstance.delete(`/expense/${expenseId}`)
                fetchExpenses()
            } catch (error) {
                console.error('Error deleting expense:', error)
            }
        }
    }

    return (
        <div className='container mx-auto p-6'>
            {/* Total Summary Section */}
            <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4'>Summary</h2>
                <div className='flex justify-start items-center'>
                    <div className='bg-green-500 text-white p-8 rounded mr-10 w-1/2'>
                        <h3 className='text-xl font-semibold'>Total Income</h3>
                        <p className='text-lg'>
                            Rp. {formatRupiah(totalIncome)}
                        </p>
                    </div>
                    <div className='bg-red-500 text-white p-8 rounded w-1/2'>
                        <h3 className='text-xl font-semibold'>Total Expense</h3>
                        <p className='text-lg'>
                            Rp. {formatRupiah(totalExpense)}
                        </p>
                    </div>
                </div>
            </div>
            {/* My Wallet Section */}
            <div className='mb-8'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-bold'>My Wallet</h2>
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2'
                        onClick={() => {
                            setSelectedWallet(null)
                            setWalletModalOpen(true)
                        }}
                    >
                        <PlusCircleIcon className='h-5 w-5' />
                        <span> Add Wallet</span>
                    </button>
                </div>
                {wallets.length === 0 ? (
                    <p className='text-gray-600'>No wallets available.</p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                        {wallets.map((wallet, index) => (
                            <div
                                key={wallet.id}
                                className='bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between'
                            >
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center space-x-3'>
                                        <h3 className='text-xl font-semibold'>
                                            {wallet.name}
                                        </h3>
                                    </div>
                                    <div className='flex space-x-2'>
                                        <button
                                            onClick={() => {
                                                setSelectedWallet(wallet)
                                                setWalletModalOpen(true)
                                            }}
                                            className='text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30'
                                        >
                                            <PencilSquareIcon className='h-5 w-5' />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteWallet(wallet.id)
                                            }
                                            className='text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30'
                                        >
                                            <TrashIcon className='h-5 w-5' />
                                        </button>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <p className='text-sm text-white text-opacity-75'>
                                        Created on{' '}
                                        {new Date(
                                            wallet.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* My Expenses Section */}
            <div>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-bold'>My Expenses</h2>
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2'
                        onClick={() => {
                            setSelectedExpense(null)
                            setExpenseModalOpen(true)
                        }}
                    >
                        <PlusCircleIcon className='h-5 w-5' />
                        <span>Add Expense</span>
                    </button>
                </div>
                {/* Search and Filters */}
                <div className='mb-4 flex flex-wrap items-center space-x-4'>
                    <input
                        type='text'
                        placeholder='Search by name...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='p-2 border rounded'
                    />
                    <input
                        type='number'
                        placeholder='Min Amount'
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className='p-2 border rounded'
                    />
                    <input
                        type='number'
                        placeholder='Max Amount'
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className='p-2 border rounded'
                    />
                    <select
                        value={filterWallet}
                        onChange={(e) => setFilterWallet(e.target.value)}
                        className='p-2 border rounded'
                    >
                        <option value=''>All Wallets</option>
                        {wallets.map((wallet) => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className='p-2 border rounded'
                    >
                        <option value=''>All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name} ({category.type})
                            </option>
                        ))}
                    </select>
                </div>
                {expenses.length === 0 ? (
                    <p className='text-gray-600'>No expenses recorded.</p>
                ) : (
                    <table className='min-w-full table-auto border-collapse border border-gray-300'>
                        <thead>
                            <tr className='bg-gray-200 text-left'>
                                <th className='border border-gray-300 px-4 py-2'>
                                    Name
                                </th>
                                <th className='border border-gray-300 px-4 py-2'>
                                    Category
                                </th>
                                <th className='border border-gray-300 px-4 py-2'>
                                    Wallet
                                </th>
                                <th className='border border-gray-300 px-4 py-2'>
                                    Amount
                                </th>
                                <th className='border border-gray-300 px-4 py-2'>
                                    Time
                                </th>
                                <th className='border border-gray-300 px-4 py-2'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => {
                                const category = categories.find(
                                    (cat) => cat.id === expense.category_id,
                                )
                                const wallet = wallets.find(
                                    (wal) => wal.id === expense.wallet_id,
                                )
                                return (
                                    <tr
                                        key={expense.id}
                                        className={`${
                                            category?.type === 'income'
                                                ? 'bg-green-100'
                                                : 'bg-red-100'
                                        }`}
                                    >
                                        <td className='border border-gray-300 px-4 py-2'>
                                            {expense.name}
                                        </td>
                                        <td className='border border-gray-300 px-4 py-2'>
                                            {category ? category.name : 'N/A'}
                                        </td>
                                        <td className='border border-gray-300 px-4 py-2'>
                                            {wallet ? wallet.name : 'N/A'}
                                        </td>
                                        <td className='border border-gray-300 px-4 py-2'>
                                            {expense.amount}
                                        </td>
                                        <td className='border border-gray-300 px-4 py-2'>
                                            {new Date(
                                                expense.time,
                                            ).toLocaleString()}
                                        </td>
                                        <td className='border border-gray-300 px-4 py-2 flex space-x-2'>
                                            <button
                                                onClick={() => {
                                                    setSelectedExpense(expense)
                                                    setExpenseModalOpen(true)
                                                }}
                                                className='text-blue-500 hover:text-blue-700 flex items-center'
                                            >
                                                <PencilSquareIcon className='h-5 w-5' />
                                                <span className='ml-1'>
                                                    Edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteExpense(
                                                        expense.id,
                                                    )
                                                }
                                                className='text-red-500 hover:text-red-700 flex items-center'
                                            >
                                                <TrashIcon className='h-5 w-5' />
                                                <span className='ml-1'>
                                                    Delete
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
                {/* Pagination Navigation */}
                <div className='flex justify-between items-center my-4'>
                    <p className='text-gray-700'>
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className='space-x-2'>
                        <button
                            className='px-4 py-2 bg-gray-500 text-white rounded'
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <button
                            className='px-4 py-2 bg-gray-500 text-white rounded'
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <WalletModal
                isOpen={walletModalOpen}
                onClose={() => setWalletModalOpen(false)}
                onSubmit={selectedWallet ? handleEditWallet : handleAddWallet}
                wallet={selectedWallet}
            />
            <ExpenseModal
                isOpen={expenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                onSubmit={
                    selectedExpense ? handleEditExpense : handleAddExpense
                }
                expense={selectedExpense}
                categories={categories}
                wallets={wallets}
            />
        </div>
    )
}

export default Dashboard
