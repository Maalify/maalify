import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-600">Maalify</div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Smart Personal Finance
          <span className="text-primary-600"> for UAE</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Take control of your finances with AI-powered insights, budget tracking,
          and seamless bank integration. Built for the UAE market.
        </p>
        <div className="space-x-4">
          <Link
            href="/signup"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 inline-block"
          >
            Start Free Trial
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 inline-block"
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🏦</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Bank Integration</h3>
            <p className="text-gray-600">
              Connect your UAE bank accounts securely with Lean Technologies
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
            <p className="text-gray-600">
              Get personalized recommendations powered by artificial intelligence
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Budgets</h3>
            <p className="text-gray-600">
              Track spending in AED and reach your financial goals faster
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
