'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import { 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Calendar
} from 'lucide-react'

type Transaction = {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

type CategorySpending = {
  category: string
  amount: number
  percentage: number
  color: string
}

const categoryColors: { [key: string]: string } = {
  'Food & Dining': '#10b981',
  'Transportation': '#3b82f6',
  'Shopping': '#f59e0b',
  'Bills & Utilities': '#ef4444',
  'Entertainment': '#8b5cf6',
  'Health': '#ec4899',
  'Education': '#06b6d4',
  'Travel': '#f97316',
  'Other': '#6b7280',
  'Salary': '#10b981',
  'Freelance': '#3b82f6',
  'Investment': '#8b5cf6',
  'Gift': '#f59e0b',
  'Refund': '#06b6d4',
}

export default function Analytics() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user, period])

  const getStartDate = () => {
    const now = new Date()
    switch (period) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7))
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1))
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1))
    }
  }

  const fetchTransactions = async () => {
    const startDate = getStartDate()

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: false })
    
    if (data) {
      setTransactions(data)
      calculateStats(data)
    }
  }

  const calculateStats = (data: Transaction[]) => {
    const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expenses = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    
    setTotalIncome(income)
    setTotalExpenses(expenses)

    // Calculate spending by category
    const expenseTransactions = data.filter(t => t.type === 'expense')
    const categoryTotals: { [key: string]: number } = {}
    
    expenseTransactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount)
    })

    const spending: CategorySpending[] = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
        color: categoryColors[category] || '#6b7280'
      }))
      .sort((a, b) => b.amount - a.amount)

    setCategorySpending(spending)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your spending patterns</p>
          </div>
          
          {/* Period Selector */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  period === p 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

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
                <p className="text-gray-600 text-sm">Net Savings</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  AED {(totalIncome - totalExpenses).toLocaleString()}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spending by Category */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
            </div>
            
            {categorySpending.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No expense data for this period</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categorySpending.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.category}</span>
                      <span className="text-gray-600">AED {cat.amount.toLocaleString()} ({cat.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full"
                        style={{ 
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions for this period</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'} AED {Number(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        {categorySpending.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">💡 Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-emerald-100 text-sm">Top Spending Category</p>
                <p className="text-xl font-bold">{categorySpending[0]?.category || 'N/A'}</p>
                <p className="text-emerald-100">AED {categorySpending[0]?.amount.toLocaleString() || 0}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-emerald-100 text-sm">Savings Rate</p>
                <p className="text-xl font-bold">
                  {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
                </p>
                <p className="text-emerald-100">
                  {totalIncome - totalExpenses >= 0 ? 'Great job saving!' : 'Spending exceeds income'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
