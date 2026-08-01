import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { authService } from '../services/authService.js'

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, setSession } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const { data } = await authService.login({ email: email.trim(), password })
      setSession({ accessToken: data.access_token, user: data.user ?? null })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      const detail = requestError.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="grid min-h-screen place-items-center p-6"><section className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold text-ocean-700">Ocean Sentinel OS</h1><p className="mt-2 text-slate-600">Government officer sign-in</p><form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate><label className="block text-sm font-medium">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label><label className="block text-sm font-medium">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-1 block w-full rounded-md border border-slate-300 p-2" /></label>{error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}<Button type="submit" disabled={loading} className="w-full disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in…' : 'Login'}</Button></form></section></main>
}
