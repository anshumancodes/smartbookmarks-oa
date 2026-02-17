'use client'

import { createClient } from '@/lib/supabase'
import { useState } from 'react'

export default function AddBookmark({ onAdd }: { onAdd?: () => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return

    setLoading(true)
    
    // current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        const { error } = await supabase.from('bookmarks').insert({
          title,
          url,
          user_id: user.id,
        })

        if (error) {
            console.error('Error adding bookmark:', error)
            alert('Error adding bookmark')
        } else {
            setTitle('')
            setUrl('')
            if (onAdd) onAdd()
        }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Bookmark</h2>
      <div className="flex flex-col gap-4">
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Google"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
        </div>
        <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              id="url"
              placeholder="https://google.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  )
}
