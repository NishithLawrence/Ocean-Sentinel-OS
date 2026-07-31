import { createContext, useMemo, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [user, setUser] = useState(null)

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    setSession: ({ accessToken, user: sessionUser }) => {
      localStorage.setItem('access_token', accessToken)
      setToken(accessToken)
      setUser(sessionUser)
    },
    clearSession: () => {
      localStorage.removeItem('access_token')
      setToken(null)
      setUser(null)
    },
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
