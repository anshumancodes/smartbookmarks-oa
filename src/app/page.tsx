'use client'

import AddBookmark from '@/components/AddBookmark'
import AuthButton from '@/components/AuthButton'
import BookmarkList from '@/components/BookmarkList'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleHeroLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Smart Bookmarks</h1>
            </div>
            <AuthButton />
            </header>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {session ? (
          <div className="space-y-12 animate-in fade-in duration-500">
            <section>
              <AddBookmark onAdd={() => setRefreshTrigger(prev => prev + 1)} />
            </section>
            <section>
              <div className="flex items-center gap-3 mb-6">
                 <h2 className="text-2xl font-semibold text-gray-900">Your Collection</h2>
                 <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Private</span>
              </div>
              <BookmarkList refreshTrigger={refreshTrigger} />
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              All your links.<br />
              <span className="text-blue-600">In one place.</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The simplest way to manage your bookmarks. Private, secure, and available across all your devices in real-time.
            </p>
            
            <button
                onClick={handleHeroLogin}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 transform hover:-translate-y-1 hover:shadow-lg"
            >
                Get Started for Free
                <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto text-blue-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Sync</h3>
                    <p className="text-gray-600">
                        Changes update instantly across all your open tabs and devices. No refresh needed.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 mx-auto text-green-600">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Private & Secure</h3>
                    <p className="text-gray-600">
                        Your bookmarks are linked only to your account. We use Row Level Security to keep them safe.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto text-purple-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Simple & Clean</h3>
                    <p className="text-gray-600">
                        A distraction-free interface designed to help you focus on the content that matters.
                    </p>
                </div>
            </div>
            
             <footer className="mt-24 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()}  Built by <a href="https://github.com/anshumancdx" target="_blank" rel="noopener noreferrer" className='underline'>Anshumancdx</a>
            </footer>
          </div>
        )}
      </div>
    </main>
  )
}