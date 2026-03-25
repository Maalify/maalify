'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Wallet, 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  ArrowLeft,
  Building,
  CreditCard,
  PiggyBank,
  Landmark
} from 'lucide-react'

type Account = {
  id: string
  name: string
  type: string
  balance: number
  currency: string
  institution: string
}

const accountTypes = [
  { value: 'checking', label: 'Checking', icon: Wallet },
  { value: 'savings', label: 'Savings', icon: PiggyBank },
  { value: 'credit', label: 'Credit Card', icon: CreditCard },
  { value: 'investment', label: 'Investment', icon: Landmark },
]

const currencies = ['AED', 'USD', 'EUR', 'GBP', 'SAR']

export default function Accounts() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    currency: 'AED',
    institution: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchAccounts()
    }
  }, [user])

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (data) setAccounts(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const accountData = {
      user_id: user?.id,
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance) || 0,
      currency: formData.currency,
      institution: formData.institution
    }

    if (editingAccount) {
      const { error } = await supabase
        .from('accounts')
        .update(accountData)
        .eq('id', editingAccount.id)
      
      if (!error) {
        fetchAccounts()
        closeModal()
      }
    } else {
      const { error } = await supabase
        .from('accounts')
        .insert([accountData])
      
      if (!error) {
        fetchAccounts()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)
      
      if (!error) fetchAccounts()
    }
  }

  const openEditModal = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      currency: account.currency,
      institution: account.institution || ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAccount(null)
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'AED',
      institution: ''
    })
  }

  const getAccountIcon = (type: string) => {
    const accountType = accountTypes.find(t => t.value === type)
    const Icon = accountType?.icon || Wallet
    return <Icon className="w-6 h-6" />
  }

  const totalBalance = accounts.reduce((sum, acc) => {
    if (acc.currency === 'AED') return sum + Number(acc.balance)
    return sum
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
                <p className="text-gray-600">Manage your financial accounts</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-5 h-5" />
              Add Account
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 mb-8 text-white">
          <p className="text-emerald-100">Total Balance (AED)</p>
          <p className="text-4xl font-bold">AED {totalBalance.toLocaleString()}</p>
          <p className="text-emerald-100 mt-2">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No accounts yet</h3>
            <p className="text-gray-500 mb-6">Add your first account to start tracking your finances</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-5 h-5" />
              Add Your First Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-full ${
                    account.type === 'credit' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {getAccountIcon(account.type)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(account)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{account.name}</h3>
                {account.institution && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Building className="w-3 h-3" /> {account.institution}
                  </p>
                )}
                <p className="text-sm text-gray-500 capitalize mb-3">{account.type}</p>
                <p className={`text-2xl font-bold ${
                  account.type === 'credit' ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {account.currency} {Number(account.balance).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingAccount ? 'Edit Account' : 'Add New Account'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Main Checking"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution (Optional)
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Emirates NBD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {accountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {editingAccount ? 'Save Changes' : 'Add Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
