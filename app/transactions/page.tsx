'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Transactions() {
  const [filter, setFilter] = useState('all')

  const transactions = [
    { id: 1, name: 'Netflix', amount: -49, category: 'Entertainment', date: 'Mar 24, 2026', account: 'ENBD Savings' },
    { id: 2, name: 'Carrefour', amount: -234, category: 'Groceries', date: 'Mar 24, 2026', account: 'FAB Current' },
    { id: 3, name: 'Salary - March', amount: 12000, category: 'Income', date: 'Mar 1, 2026', account: 'ENBD Savings' },
    { id: 4, name: 'DEWA Bill', amount: -450, category: 'Utilities', date: 'Feb 28, 2026', account: 'FAB Current' },
    { id: 5, name: 'Amazon.ae', amount: -189, category: 'Shopping', date: 'Feb 27, 2026', account: 'ADCB Credit Card' },
    { id: 6, name: 'Noon Food', amount: -85, category: 'Food & Dining', date: 'Feb 26, 2026', account: 'FAB Current' },
    { id: 7, name: 'Etisalat', amount: -299, category: 'Utilities', date: 'Feb 25, 2026', account: 'ENBD Savings' },
    { id: 8, name: 'Gym Membership', amount: -350, category: 'Health', date: 'Feb 24, 2026', account: 'ADCB Credit Card' },
    { id: 9, name: 'Freelance Payment', amount: 3500, category: 'Income', date: 'Feb 23, 2026', account: 'ENBD Savings' },
    { id: 10, name: 'Spinneys', amount: -312, category: 'Groceries', date: 'Feb 22, 2026', account: 'FAB Current' },
  ]

  const categories = ['all', 'Income', 'Groceries', 'Entertainment', 'Utilities', 'Shopping', 'Food & Dining', 'Health']

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === filter)

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
          <Link href="/transactions" className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
            <p className="text-gray-600">View and manage all your transactions</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search transactions..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    tx.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className="text-lg">
                      {tx.category === 'Income' ? '💰' : 
                       tx.category === 'Groceries' ? '🛒' :
                       tx.category === 'Entertainment' ? '🎬' :
                       tx.category === 'Utilities' ? '💡' :
                       tx.category === 'Shopping' ? '🛍️' :
                       tx.category === 'Food & Dining' ? '🍔' :
                       tx.category === 'Health' ? '💪' : '💳'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.name}</p>
                    <p className="text-sm text-gray-500">{tx.category} • {tx.account}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : ''}AED {tx.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
