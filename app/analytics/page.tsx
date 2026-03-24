'use client'

import Link from 'next/link'

export default function Analytics() {
  const monthlyData = [
    { month: 'Oct', income: 12000, expenses: 8200 },
    { month: 'Nov', income: 12000, expenses: 9100 },
    { month: 'Dec', income: 15500, expenses: 11200 },
    { month: 'Jan', income: 12000, expenses: 7800 },
    { month: 'Feb', income: 12000, expenses: 8950 },
    { month: 'Mar', income: 12000, expenses: 6500 },
  ]

  const categoryBreakdown = [
    { category: 'Groceries', amount: 1580, percentage: 25, color: 'bg-blue-500' },
    { category: 'Utilities', amount: 1200, percentage: 19, color: 'bg-green-500' },
    { category: 'Entertainment', amount: 850, percentage: 13, color: 'bg-purple-500' },
    { category: 'Shopping', amount: 720, percentage: 11, color: 'bg-yellow-500' },
    { category: 'Food & Dining', amount: 680, percentage: 11, color: 'bg-red-500' },
    { category: 'Transport', amount: 520, percentage: 8, color: 'bg-indigo-500' },
    { category: 'Other', amount: 800, percentage: 13, color: 'bg-gray-500' },
  ]

  const insights = [
    { type: 'warning', message: 'Entertainment spending is 20% higher than last month' },
    { type: 'success', message: 'You saved AED 1,200 more than your monthly goal' },
    { type: 'info', message: 'Your biggest expense category is Groceries at 25%' },
  ]

  const maxExpense = Math.max(...monthlyData.map(d => d.expenses))

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
          <Link href="/budgets" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">🎯</span> Budgets
          </Link>
          <Link href="/analytics" className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">
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
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Insights into your financial habits</p>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">🤖 AI Insights</h2>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                  insight.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
                  'bg-blue-50 border-l-4 border-blue-400'
                }`}
              >
                <p className="text-gray-700">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-6">Income vs Expenses</h2>
          <div className="flex items-end justify-between h-48 px-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex space-x-1 items-end h-40">
                  <div
                    className="w-6 bg-green-400 rounded-t"
                    style={{ height: `${(data.income / 16000) * 100}%` }}
                    title={`Income: AED ${data.income}`}
                  />
                  <div
                    className="w-6 bg-red-400 rounded-t"
                    style={{ height: `${(data.expenses / 16000) * 100}%` }}
                    title={`Expenses: AED ${data.expenses}`}
                  />
                </div>
                <span className="text-sm text-gray-500 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded mr-2" />
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded mr-2" />
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Spending by Category</h2>
          <div className="space-y-4">
            {categoryBreakdown.map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{cat.category}</span>
                  <span className="text-gray-600">AED {cat.amount.toLocaleString()} ({cat.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
