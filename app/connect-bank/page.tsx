'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import Script from 'next/script'
import { 
  Building2,
  Shield,
  Zap,
  RefreshCw,
  ChevronRight,
  Lock,
  CheckCircle,
  Loader2
} from 'lucide-react'

declare global {
  interface Window {
    Lean: any
  }
}

const banks = [
  { name: 'Emirates NBD', logo: '🏦', id: 'ENBD_UAE' },
  { name: 'ADCB', logo: '🏛️', id: 'ADCB_UAE' },
  { name: 'FAB', logo: '🏢', id: 'FAB_UAE' },
  { name: 'Mashreq', logo: '🏦', id: 'MASHREQ_UAE' },
  { name: 'RAKBANK', logo: '🏛️', id: 'RAKBANK_UAE' },
  { name: 'Dubai Islamic Bank', logo: '🏢', id: 'DIB_UAE' },
]

export default function ConnectBank() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [leanReady, setLeanReady] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [connectedBanks, setConnectedBanks] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchConnectedBanks()
    }
  }, [user])

  const fetchConnectedBanks = async () => {
    // In production, you'd fetch this from your database
    // For now, we'll use localStorage for demo purposes
    const saved = localStorage.getItem('connectedBanks')
    if (saved) {
      setConnectedBanks(JSON.parse(saved))
    }
  }

  const handleConnectBank = async (bankId: string, bankName: string) => {
    if (!window.Lean) {
      alert('Lean SDK not loaded yet. Please try again.')
      return
    }

    setConnecting(true)

    try {
      window.Lean.connect({
        app_token: process.env.NEXT_PUBLIC_LEAN_APP_ID,
        sandbox: true,
        permissions: ['accounts', 'balance', 'transactions'],
        bank_identifier: bankId,
        callback: async (response: any) => {
          console.log('Lean connection successful:', response)
          
          // Save the connection
          const newConnectedBanks = [...connectedBanks, bankId]
          setConnectedBanks(newConnectedBanks)
          localStorage.setItem('connectedBanks', JSON.stringify(newConnectedBanks))
          
          // In production, you'd save the entity_id to your database
          // and use it to fetch transactions
          alert(`Successfully connected to ${bankName}! In production, transactions would now sync automatically.`)
          
          setConnecting(false)
        },
        callback_error: (error: any) => {
          console.error('Lean connection error:', error)
          alert('Connection failed. Please try again.')
          setConnecting(false)
        },
      })
    } catch (error) {
      console.error('Error initializing Lean:', error)
      setConnecting(false)
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Script 
        src="https://cdn.leantech.me/link/sdk/web/latest/lean-link.min.js"
        onLoad={() => setLeanReady(true)}
      />
      
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

        {/* SDK Status */}
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${leanReady ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          {leanReady ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Lean SDK loaded and ready</span>
            </>
          ) : (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading Lean SDK...</span>
            </>
          )}
        </div>

        {/* Banks List */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Select Your Bank
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map((bank) => {
              const isConnected = connectedBanks.includes(bank.id)
              
              return (
                <button
                  key={bank.id}
                  disabled={!leanReady || connecting}
                  onClick={() => handleConnectBank(bank.id, bank.name)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                    isConnected
                      ? 'border-green-500 bg-green-50'
                      : !leanReady || connecting
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{bank.logo}</span>
                    <span className="font-medium text-gray-900">{bank.name}</span>
                  </div>
                  {isConnected ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </span>
                  ) : connecting ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              )
            })}
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

        {/* Sandbox Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-2">🧪 Sandbox Mode</h3>
          <p className="text-blue-700 text-sm">
            You're currently in sandbox mode with test credentials. Use the test users shown in your 
            Lean dashboard to simulate bank connections. In production, real bank accounts would be connected.
          </p>
        </div>
      </main>
    </div>
  )
}
