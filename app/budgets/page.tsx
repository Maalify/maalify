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
  PiggyBank,
  AlertCircle
} from 'lucide-react'

type Budget = {
  id: string
  category: string
  amount: number
  period: string
}

type Transaction = {
  category: string
  amount: number
  type: string
}

const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health', 'Education', 'Travel', 'Other']

export default function Budgets() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    category: 'Food & Dining',
    amount: '',
    period: 'monthly'
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchBudgets()
      fetchTransactions()
    }
  }, [user])

  const fetchBudgets = async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (data) setBudgets(data)
  }

  const fetchTransactions = async () => {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('transactions')
      .select('category, amount, type')
      .eq('user_id', user?.id)
      .eq('type', 'expense')
      .gte('date', startOfMonth.toISOString())
    
    if (data) setTransactions(data)
  }

  const getSpentAmount = (category: string) => {
    return transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const budgetData = {
      user_id: user?.id,
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      period: formData.period
    }

    if (editingBudget) {
      const { error } = await supabase
        .from('budgets')
        .update(budgetData)
        .eq('id', editingBudget.id)
      
      if (!error) {
        fetchBudgets()
        closeModal()
      }
    } else {
      const { error } = await supabase
        .from('budgets')
        .insert([budgetData])
      
      if (!error) {
        fetchBudgets()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
      
      if (!error) fetchBudgets()
    }
  }

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBudget(null)
    setFormData({
      category: 'Food & Dining',
      amount: '',
      period: 'monthly'
    })
  }

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + getSpentAmount(b.category), 0)

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
                <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
                <p className="text-gray-600">Set and track your spending limits</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-5 h-5" />
              Add Budget
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-emerald-100">Total Budget</p>
              <p className="text-3xl font-bold">AED {totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-100">Total Spent</p>
              <p className="text-3xl font-bold">AED {totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-100">Remaining</p>
              <p className={`text-3xl font-bold ${totalBudget - totalSpent < 0 ? 'text-red-300' : ''}`}>
                AED {(totalBudget - totalSpent).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Budgets List */}
        {budgets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <PiggyBank className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets yet</h3>
            <p className="text-gray-500 mb-6">Create budgets to track your spending by category</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-5 h-5" />
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const spent = getSpentAmount(budget.category)
              const percentage = (spent / Number(budget.amount)) * 100
              const isOverBudget = percentage > 100

              return (
                <div key={budget.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(budget)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">AED {spent.toLocaleString()} spent</span>
                      <span className="text-gray-600">AED {Number(budget.amount).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                      {percentage.toFixed(0)}% used
                    </span>
                    {isOverBudget && (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Over budget
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount (AED)</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
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
                  {editingBudget ? 'Save Changes' : 'Add Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
