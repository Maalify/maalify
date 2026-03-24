'use client'

import Link from 'next/link'

export default function Budgets() {
  const budgets = [
    { id: 1, category: 'Groceries', spent: 546, limit: 800, icon: '🛒' },
    { id: 2, category: 'Entertainment', spent: 320, limit: 300, icon: '🎬' },
    { id: 3, category: 'Utilities', spent: 749, limit: 1000, icon: '💡' },
    { id: 4, category: 'Shopping', spent: 189, limit: 500, icon: '🛍️' },
    { id: 5, category: 'Food & Dining', spent: 425, limit: 600, icon: '🍔' },
    { id: 6, category: 'Transport', spent: 280, limit: 400, icon: '🚗' },
  ]

  const goals = [
    { id: 1, name: 'Emergency Fund', current: 15000, target: 30000, icon: '🛡️' },
    { id: 2, name: 'Vacation', current: 4500, target: 10000, icon: '✈️' },
    { id: 3, name: 'New Car', current: 22000, target: 80000, icon: '🚗' },
  ]

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <Link href="/" className="text-2xl font-bold text-primary-600">Maalify</Link>
        <nav className="mt-8 space-y-2">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">📊</span> Dashboard
          </Link>
          <Link href="/accounts" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">🏦</span> Accounts
          </Link>
          <Link href="/transactions" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">💳</span> Transactions
          </Link>
          <Link href="/budgets" className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Budgets & Goals</h1>
            <p className="text-gray-600">Track your spending and savings goals</p>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            + New Budget
          </button>
        </div>

        {/* Overview Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Monthly Overview</h2>
            <span className="text-sm text-gray-500">March 2026</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">AED {totalSpent.toLocaleString()}</p>
              <p className="text-gray-500">of AED {totalBudget.toLocaleString()} budgeted</p>
            </div>
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle 
                  cx="64" cy="64" r="56" 
                  stroke="#2563eb" 
                  strokeWidth="12" 
                  fill="none"
                  strokeDasharray={`${(totalSpent / totalBudget) * 352} 352`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{Math.round((totalSpent / totalBudget) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Budgets Grid */}
        <h2 className="text-lg font-semibold mb-4">Category Budgets</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100
            const isOver = percentage > 100
            return (
              <div key={budget.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{budget.icon}</span>
                    <span className="font-medium">{budget.category}</span>
                  </div>
                  {isOver && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Over budget</span>}
                </div>
                <div className="mb-2">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-primary-600'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isOver ? 'text-red-600' : 'text-gray-600'}>AED {budget.spent}</span>
                  <span className="text-gray-400">AED {budget.limit}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Savings Goals */}
        <h2 className="text-lg font-semibold mb-4">Savings Goals</h2>
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = (goal.current / goal.target) * 100
            return (
              <div key={goal.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{goal.icon}</span>
                    <div>
                      <p className="font-medium">{goal.name}</p>
                      <p className="text-sm text-gray-500">AED {goal.current.toLocaleString()} of AED {goal.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-primary-600">{Math.round(percentage)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
