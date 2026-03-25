'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Search,
  Filter
} from 'lucide-react'

type Transaction = {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  account_id: string
  notes: string
}

type Account = {
  id: string
  name: string
}

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Refund', 'Other'],
  expense: ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health', 'Education', 'Travel', 'Other']
}

export default function Transactions() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    account_id: '',
    notes: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchAccounts()
    }
  }, [user])

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: false })
    
    if (data) setTransactions(data)
  }

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('id, name')
      .eq('user_id', user?.id)
    
    if (data) setAccounts(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const transactionData = {
      user_id: user?.id,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type,
      category: formData.category,
      date: formData.date,
      account_id: formData.account_id || null,
      notes: formData.notes
    }

    if (editingTransaction) {
      const { error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', editingTransaction.id)
      
      if (!error) {
        fetchTransactions()
        closeModal()
      }
    } else {
      const { error } = await supabase
        .from('transactions')
        .insert([transactionData])
      
      if (!error) {
        fetchTransactions()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
      
      if (!error) fetchTransactions()
    }
  }

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.split('T')[0],
      account_id: transaction.account_id || '',
      notes: transaction.notes || ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTransaction(null)
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      account_id: '',
      notes: ''
    })
  }

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    return matchesSearch && matchesType
  })

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-600">Track your income and expenses</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-green-600">AED {totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">AED {totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Net Balance</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  AED {(totalIncome - totalExpenses).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg ${filterType === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-4 py-2 rounded-lg ${filterType === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-4 py-2 rounded-lg ${filterType === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Expenses
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-500 mb-6">Start tracking your income and expenses</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-5 h-5" />
              Add Your First Transaction
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'} AED {Number(transaction.amount).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(transaction)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', category: 'Other' })}
                    className={`flex-1 py-2 rounded-lg ${formData.type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', category: 'Other' })}
                    className={`flex-1 py-2 rounded-lg ${formData.type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Grocery shopping"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (AED)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {categories[formData.type].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {accounts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account (Optional)</label>
                  <select
                    value={formData.account_id}
                    onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={2}
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {editingTransaction ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
