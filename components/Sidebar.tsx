'use client'

import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  PiggyBank, 
  BarChart3, 
  Settings,
  Building,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Budgets', href: '/budgets', icon: PiggyBank },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Connect Bank', href: '/connect-bank', icon: Building },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-600">Maalify</h1>
        <p className="text-sm text-gray-500">Smart Finance</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </aside>
  )
}
