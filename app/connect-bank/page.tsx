'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ConnectBank() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const banks = [
    { id: 'enbd', name: 'Emirates NBD', logo: '🏦' },
    { id: 'fab', name: 'First Abu Dhabi Bank', logo: '🏦' },
    { id: 'adcb', name: 'ADCB', logo: '🏦' },
    { id: 'mashreq', name: 'Mashreq Bank', logo: '🏦' },
    { id: 'dib', name: 'Dubai Islamic Bank', logo: '🏦' },
    { id: 'rakbank', name: 'RAKBANK', logo: '🏦' },
    { id: 'cbd', name: 'Commercial Bank of Dubai', logo: '🏦' },
    { id: 'ajman', name: 'Ajman Bank', logo: '🏦' },
  ]

  const handleConnect = () => {
    if (!selectedBank) return
    setConnecting(true)
    // TODO: Implement Lean Technologies SDK integration
    setTimeout(() => {
      alert('Bank connection will be implemented with Lean Technologies in Stage 3')
      setConnecting(false)
    }, 2000)
  }

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
          <Link href="/settings" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <span className="mr-3">⚙️</span> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔗</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Connect Your Bank</h1>
              <p className="text-gray-600 mt-2">
                Securely link your UAE bank account using Lean Technologies
              </p>
            </div>

            {/* Security Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔒</span>
                <div>
                  <p className="font-medium text-green-800">Bank-level Security</p>
                  <p className="text-sm text-green-600">256-bit encryption • Read-only access • CBUAE regulated</p>
                </div>
              </div>
            </div>

            {/* Bank Selection */}
            <h2 className="font-semibold text-gray-900 mb-4">Select your bank</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedBank === bank.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{bank.logo}</span>
                    <span className="font-medium text-gray-900">{bank.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={!selectedBank || connecting}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                selectedBank && !connecting
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {connecting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Connect Bank'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By connecting, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
