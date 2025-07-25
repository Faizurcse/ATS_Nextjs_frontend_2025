"use client"

import React, { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Message {
  id: number
  user_id: number
  question: string
  answer: string
  timestamp: string
}

interface Support {
  id: number
  user_id: number
  subject: string
  message: string
  timestamp: string
  user_name: string
  phone_num: string
  email_address: string
}

interface User {
  id: number
  email: string
  created_at: string
  messages: Message[]
  supports: Support[]
}

const API_URL = "https://apiappit.appitsoftware.com/api/analytics/all-data"

export default function Contacts() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedTab, setSelectedTab] = useState<"chats" | "support">("chats")

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || [])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load data.")
        setLoading(false)
      })
  }, [])

  // Filter users by search
  const filteredUsers = users.filter((user) => {
    const name = user.supports[0]?.user_name || user.email
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
  })

  // Get messages/supports to show
  let displayUsers: User[] = []
  if (selectedUserId) {
    const user = users.find((u) => u.id === selectedUserId)
    if (user) displayUsers = [user]
  } else {
    displayUsers = users
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 shadow-md flex flex-col">
        <div className="p-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-blue-700 mb-2">
            Users ({filteredUsers.length})
          </h2>
          <div className="relative">
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-2 py-2 rounded-md border border-slate-200 focus:ring-2 focus:ring-blue-200"
            />
            <Search className="absolute left-2 top-2.5 text-slate-400 w-5 h-5" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <ul className="min-w-[220px] divide-y divide-slate-100" style={{ width: '100%', minWidth: 0 }}>
            <li
              className={`cursor-pointer px-4 py-3 hover:bg-blue-50 transition ${selectedUserId === null ? "bg-blue-100" : ""}`}
              onClick={() => setSelectedUserId(null)}
            >
              <span className="font-medium text-blue-700">All Users</span>
            </li>
            {filteredUsers.map((user) => {
              const name = user.supports[0]?.user_name || user.email
              return (
                <li
                  key={user.id}
                  className={`flex items-center gap-3 cursor-pointer px-4 py-3 hover:bg-blue-50 transition ${selectedUserId === user.id ? "bg-blue-100" : ""}`}
                  onClick={() => setSelectedUserId(user.id)}
                  style={{ minWidth: 0 }}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-blue-900">{name}</div>
                    <div className="truncate text-xs text-slate-500">{user.email}</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-blue-800">{selectedUserId ? (users.find(u => u.id === selectedUserId)?.supports[0]?.user_name || users.find(u => u.id === selectedUserId)?.email) : "All Users Messages"}</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedTab("chats")}
                className={`min-w-[120px] font-semibold transition-colors
                  ${selectedTab === "chats"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"}
                `}
              >
                Chats
              </Button>
              <Button
                onClick={() => setSelectedTab("support")}
                className={`min-w-[120px] font-semibold transition-colors
                  ${selectedTab === "support"
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"}
                `}
              >
                Support Messages
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <ScrollArea className="h-[70vh] w-full pr-2">
              <div className="grid gap-6">
                {displayUsers.length === 0 && (
                  <div className="text-center text-gray-400">No users found.</div>
                )}
                {displayUsers.map((user) => (
                  <Card key={user.id} className="shadow-md border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{(user.supports[0]?.user_name || user.email)?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-semibold text-blue-700">{user.supports[0]?.user_name || user.email}</CardTitle>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedTab === "chats" ? (
                        <div>
                          <div className="font-medium text-gray-700 mb-2">Chatbot Q&A</div>
                          {user.messages.length === 0 ? (
                            <div className="text-gray-400 text-sm">No chatbot messages.</div>
                          ) : (
                            <div className="space-y-3">
                              {user.messages.map((msg) => (
                                <div key={msg.id} className="bg-blue-50 rounded p-3">
                                  <div className="text-sm font-semibold text-blue-800">Q: {msg.question}</div>
                                  <div className="text-sm text-gray-700 mt-1">A: {msg.answer}</div>
                                  <div className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleString()}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-700 mb-2">Support Messages</div>
                          {user.supports.length === 0 ? (
                            <div className="text-gray-400 text-sm">No support messages.</div>
                          ) : (
                            <div className="space-y-3">
                              {user.supports.map((sup) => (
                                <div key={sup.id} className="bg-purple-50 rounded p-3">
                                  <div className="text-sm font-semibold text-purple-800">{sup.subject}</div>
                                  <div className="text-sm text-gray-700 mt-1">{sup.message}</div>
                                  <div className="text-xs text-gray-400 mt-1">{new Date(sup.timestamp).toLocaleString()}</div>
                                  <div className="text-xs text-gray-500 mt-1">From: {sup.user_name} ({sup.email_address}) | {sup.phone_num}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  )
} 