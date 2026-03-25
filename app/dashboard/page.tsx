'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  Plus,
  ArrowRight
} from 'lucide-react'

type Account = {
  id: string
  name: string
  type: string
  balance: number
  currency: string
}

type Transaction = {
  id: string
  description: string
  amount: number
  type: string
  category: string
  date: string
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchAccounts()
      fetchTransactions()
    }
  }, [user])

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user?.id)
    
    if (data) {
      setAccounts(data)
      const total = data.reduce((sum, acc) => sum + Number(acc.balance), 0)
      setTotalBalance(total)
    }
  }

  const fetchTransactions = async () => {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .gte('date', startOfMonth.toISOString())
      .order('date', { ascending: false })
      .limit(5)
    
    if (data) {
      setTransactions(data)
      const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
      const expenses = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
      setMonthlyIncome(income)
      setMonthlyExpenses(expenses)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) return null

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">AED {totalBalance.toLocaleString()}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">AED {monthlyIncome.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-600">AED {monthlyExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Savings Rate</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0}%
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <PiggyBank className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Accounts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Accounts</h2>
              <button 
                onClick={() => router.push('/accounts')}
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No accounts yet</p>
                <button 
                  onClick={() => router.push('/accounts')}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4" /> Add Account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.slice(0, 4).map((account) => (
                  <div key={account.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {account.currency} {Number(account.balance).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button 
                onClick={() => router.push('/transactions')}
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No transactions yet</p>
                <button 
                  onClick={() => router.push('/transactions')}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4" /> Add Transaction
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
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
      </main>
    </div>
  )
}
