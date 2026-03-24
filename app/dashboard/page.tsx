'use client'

import Link from 'next/link'

export default function Dashboard() {
  // Mock data - will be replaced with real data from Supabase
  const totalBalance = 45230.50
  const income = 12000
  const expenses = 8950
  const savings = 3225

  const recentTransactions = [
    { id: 1, name: 'Netflix', amount: -49, category: 'Entertainment', date: 'Today' },
    { id: 2, name: 'Carrefour', amount: -234, category: 'Groceries', date: 'Today' },
    { id: 3, name: 'Salary', amount: 12000, category: 'Income', date: 'Mar 1' },
    { id: 4, name: 'DEWA', amount: -450, category: 'Utilities', date: 'Feb 28' },
    { id: 5, name: 'Amazon', amount: -189, category: 'Shopping', date: 'Feb 27' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          Maalify
        </Link>
        
        <nav className="mt-8 space-y-2">
          <Link href="/dashboard" className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">
            <span className="mr-3">📊</span> Dashboard
          </Link>
          <Link href="/accounts" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">🏦</span> Accounts
          </Link>
          <Link href="/transactions" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">💳</span> Transactions
          </Link>
          <Link href="/budgets" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">🎯</span> Budgets
          </Link>
          <Link href="/analytics" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">📈</span> Analytics
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">⚙️</span> Settings
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/connect-bank" className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            + Connect Bank
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Good evening, Barry</h1>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
          <p className="text-primary-100">Total Balance</p>
          <p className="text-4xl font-bold mt-2">AED {totalBalance.toLocaleString()}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Income</p>
            <p className="text-2xl font-semibold text-green-600 mt-1">AED {income.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Expenses</p>
            <p className="text-2xl font-semibold text-red-600 mt-1">AED {expenses.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Savings</p>
            <p className="text-2xl font-semibold text-primary-600 mt-1">AED {savings.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <Link href="/transactions" className="text-primary-600 text-sm hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{tx.name}</p>
                  <p className="text-sm text-gray-500">{tx.category} • {tx.date}</p>
                </div>
                <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {tx.amount > 0 ? '+' : ''}AED {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
