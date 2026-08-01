import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import BrandLogo from '../components/common/BrandLogo.jsx'
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

  const submit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password) return setError('Email and password are required.')
    setLoading(true)
    setError('')
    try {
      const { data } = await authService.login({ email: email.trim(), password })
      setSession({ accessToken: data.access_token, user: data.user ?? null })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      const detail = requestError.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Secure sign-in could not be completed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.12),transparent_40rem),radial-gradient(circle_at_80%_70%,rgba(52,211,153,.1),transparent_35rem)]" />
      <div className="absolute -left-32 top-1/4 size-96 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-emerald-400/12 blur-3xl" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(103,232,249,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="surface relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] md:grid-cols-[1.1fr_.9fr]"
      >
        <div className="relative hidden min-h-150 flex-col justify-between border-r border-cyan-100/10 p-10 md:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.08),transparent_20rem)]" />
          <div className="relative">
            <div className="mb-12">
              <BrandLogo size="lg" />
            </div>
            <p className="eyebrow">Marine intelligence platform</p>
            <h1 className="mt-4 max-w-md text-5xl font-semibold tracking-[-.06em] text-white">
              Protecting the world&apos;s{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                living ocean.
              </span>
            </h1>
            <p className="mt-6 max-w-sm text-slate-400">
              Ocean Sentinel OS — a secure decision layer for conservation agencies, response teams, and marine
              intelligence operations.
            </p>
          </div>
          <div className="relative rounded-2xl border border-cyan-100/10 bg-cyan-300/5 p-5 text-sm text-cyan-50/80">
            <span className="mr-2 inline-block size-2 rounded-full bg-emerald-300 shadow-[0_0_15px_#34d399]" />
            Secure government network · System operational
          </div>
        </div>

        <div className="flex items-center p-7 sm:p-10">
          <div className="w-full">
            <div className="mb-8 md:hidden">
              <BrandLogo size="md" />
            </div>
            <p className="eyebrow">Secure access</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to access the Ocean Sentinel OS command center.</p>

            <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
              <label className="block text-sm font-medium text-slate-200">
                Government email
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-cyan-100/15 bg-slate-950/30 px-3 focus-within:border-cyan-300/60 focus-within:shadow-[0_0_0_4px_rgba(34,211,238,.08)]">
                  <Mail size={17} className="text-cyan-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="officer@agency.gov"
                    className="w-full bg-transparent py-3 outline-none placeholder:text-slate-600"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Password
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-cyan-100/15 bg-slate-950/30 px-3 focus-within:border-cyan-300/60 focus-within:shadow-[0_0_0_4px_rgba(34,211,238,.08)]">
                  <LockKeyhole size={17} className="text-cyan-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Authenticating…' : (
                  <>
                    Enter command center <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
