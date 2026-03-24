'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Settings() {
  const [name, setName] = useState('Barry Goertz')
  const [email, setEmail] = useState('barry@example.com')
  const [currency, setCurrency] = useState('AED')
  const [notifications, setNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)

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
          <Link href="/analytics" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">📈</span> Analytics
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">
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
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Save Changes
              </button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts on your device</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Weekly Report</p>
                  <p className="text-sm text-gray-500">Get a summary every Sunday</p>
                </div>
                <button
                  onClick={() => setWeeklyReport(!weeklyReport)}
                  className={`w-12 h-6 rounded-full transition-colors ${weeklyReport ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${weeklyReport ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Budget Alerts</p>
                  <p className="text-sm text-gray-500">Alert when nearing budget limits</p>
                </div>
                <button
                  onClick={() => setBudgetAlerts(!budgetAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors ${budgetAlerts ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${budgetAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Connected Banks Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Connected Banks</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏦</span>
                  <div>
                    <p className="font-medium">Emirates NBD</p>
                    <p className="text-sm text-gray-500">Connected Mar 15, 2026</p>
                  </div>
                </div>
                <button className="text-red-600 text-sm hover:underline">Disconnect</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏦</span>
                  <div>
                    <p className="font-medium">First Abu Dhabi Bank</p>
                    <p className="text-sm text-gray-500">Connected Mar 18, 2026</p>
                  </div>
                </div>
                <button className="text-red-600 text-sm hover:underline">Disconnect</button>
              </div>
            </div>
            <Link href="/connect-bank" className="mt-4 inline-block text-primary-600 hover:underline">
              + Connect another bank
            </Link>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
