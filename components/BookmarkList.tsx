'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function BookmarkList({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    const fetchBookmarks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setBookmarks(data)
    }

    fetchBookmarks()

    // Realtime subscription
    const channel = supabase
      .channel('realtime bookmarks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
      }, (_payload: any) => {
          // Optimization: Check if the change is relevant to the current user would be better,
          // but due to RLS, we might only receive relevant events anyway if Row Level Security is enabled properly.
          // For now, let's just refetch or optimistically update.
          // Simple approach: Refetch to ensure consistency and simplicity.
           fetchBookmarks()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, refreshTrigger])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) console.error('Error deleting bookmark:', error)
  }

  if (bookmarks.length === 0) {
    return <div className="text-center text-gray-500 py-8">No bookmarks yet. Add one above!</div>
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col justify-between">
          <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate" title={bookmark.title}>{bookmark.title}</h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate block mb-4"
                title={bookmark.url}
              >
                {bookmark.url}
              </a>
          </div>
          <button
            onClick={() => handleDelete(bookmark.id)}
            className="self-end text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
