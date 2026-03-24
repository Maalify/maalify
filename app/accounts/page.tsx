'use client'

import Link from 'next/link'

export default function Accounts() {
  const accounts = [
    { id: 1, name: 'ENBD Savings', type: 'Savings', balance: 32450.00, bank: 'Emirates NBD', lastSync: '2 hours ago' },
    { id: 2, name: 'FAB Current', type: 'Current', balance: 8750.50, bank: 'First Abu Dhabi Bank', lastSync: '2 hours ago' },
    { id: 3, name: 'ADCB Credit Card', type: 'Credit Card', balance: -2150.00, bank: 'ADCB', lastSync: '1 day ago' },
    { id: 4, name: 'Mashreq Savings', type: 'Savings', balance: 6180.00, bank: 'Mashreq Bank', lastSync: '3 hours ago' },
  ]

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <Link href="/" className="text-2xl font-bold text-primary-600">Maalify</Link>
        <nav className="mt-8 space-y-2">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">📊</span> Dashboard
          </Link>
          <Link href="/accounts" className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
            <p className="text-gray-600">Manage your connected bank accounts</p>
          </div>
          <Link href="/connect-bank" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            + Add Account
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Total Assets</p>
            <p className="text-3xl font-bold text-green-600 mt-2">AED {totalAssets.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Total Liabilities</p>
            <p className="text-3xl font-bold text-red-600 mt-2">AED {totalLiabilities.toLocaleString()}</p>
          </div>
        </div>

        {/* Accounts List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Connected Accounts</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {accounts.map((account) => (
              <div key={account.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">🏦</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.bank} • {account.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-semibold ${account.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    AED {account.balance.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Synced {account.lastSync}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
