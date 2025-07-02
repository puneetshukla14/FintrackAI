'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type User = {
  fullName: string
  email: string
  monthlySalary: number
  gender: string
  currency: string
}

type UserContextType = {
  currency: string
  setCurrency: (currency: string) => void
  user: User | null
  setUser: (user: User | null) => void
}

const defaultValue: UserContextType = {
  currency: 'INR',
  setCurrency: () => {},
  user: null,
  setUser: () => {},
}

export const UserContext = createContext<UserContextType>(defaultValue)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState('INR')
  const [user, setUser] = useState<User | null>(null)

  return (
    <UserContext.Provider value={{ currency, setCurrency, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
