'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
import { 
  Building2,
  Shield,
  Zap,
  RefreshCw,
  ChevronRight,
  Lock
} from 'lucide-react'

const banks = [
  { name: 'Emirates NBD', logo: '🏦', status: 'available' },
  { name: 'ADCB', logo: '🏛️', status: 'available' },
  { name: 'FAB', logo: '🏢', status: 'available' },
  { name: 'Mashreq', logo: '🏦', status: 'available' },
  { name: 'RAKBANK', logo: '🏛️', status: 'coming_soon' },
  { name: 'Dubai Islamic Bank', logo: '🏢', status: 'coming_soon' },
]

export default function ConnectBank() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Connect Your Bank</h1>
          <p className="text-gray-600">Securely link your UAE bank accounts for automatic transaction sync</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
            <p className="text-sm text-gray-600">256-bit encryption and read-only access. We can never move your money.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Sync</h3>
            <p className="text-sm text-gray-600">Transactions appear automatically within minutes of occurring.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Auto-Categorize</h3>
            <p className="text-sm text-gray-600">AI automatically categorizes your transactions for easy tracking.</p>
          </div>
        </div>

        {/* Banks List */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Select Your Bank
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map((bank) => (
              <button
                key={bank.name}
                disabled={bank.status === 'coming_soon'}
                onClick={() => {
                  alert('Bank connection will be available in Stage 3 (Lean Technologies integration)')
                }}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                  bank.status === 'coming_soon'
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{bank.logo}</span>
                  <span className={`font-medium ${bank.status === 'coming_soon' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {bank.name}
                  </span>
                </div>
                {bank.status === 'coming_soon' ? (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Your Security is Our Priority</h3>
              <p className="text-gray-300 text-sm">
                Maalify uses Lean Technologies, a Central Bank of UAE licensed Open Banking provider. 
                Your credentials are never stored on our servers. We only receive read-only access to 
                your transaction history.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-800 mb-2">🚧 Stage 3 Feature</h3>
          <p className="text-amber-700 text-sm">
            Bank connection via Lean Technologies will be implemented in Stage 3. 
            For now, you can manually add accounts and transactions.
          </p>
        </div>
      </main>
    </div>
  )
}
