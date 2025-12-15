import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Landing() {
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        let mounted = true
        async function fetchUser() {
            try {
                const { data } = await supabase.auth.getUser()
                if (mounted) setUser(data?.user || null)
            } catch (e) {
                if (mounted) setUser(null)
            }
        }
        fetchUser()
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })
        return () => {
            mounted = false
            listener?.subscription?.unsubscribe?.()
        }
    }, [])

    const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
    const anonKeyPresent = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY)
    let envHost = ''
    try {
        envHost = envUrl ? new URL(envUrl).host : ''
    } catch (e) {
        envHost = envUrl
    }

    const [showPassword, setShowPassword] = useState(false)

    async function testSupabase() {
        setLoading(true)
        setStatus(null)
        try {
            const { data, error } = await supabase.from('occupants').select('*').limit(1)
            if (error) {
                setStatus({ ok: false, message: error.message })
            } else {
                setStatus({ ok: true, message: `Connected — returned ${Array.isArray(data) ? data.length : 0} rows.` })
            }
        } catch (err) {
            setStatus({ ok: false, message: String(err) })
        } finally {
            setLoading(false)
        }
    }

    async function signInWithEmailAndPassword(e) {
        e?.preventDefault()
        if (!email || !password) {
            setStatus({ ok: false, message: 'Enter both email and password.' })
            return
        }
        setLoading(true)
        setStatus(null)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setStatus({ ok: false, message: error.message })
            else setStatus({ ok: true, message: `Signed in as ${data.user.email}` })
        } catch (err) {
            setStatus({ ok: false, message: String(err) })
        } finally {
            setLoading(false)
        }
    }

    async function signOut() {
        setLoading(true)
        try {
            await supabase.auth.signOut()
            setStatus({ ok: true, message: 'Signed out.' })
        } catch (err) {
            setStatus({ ok: false, message: String(err) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="landing center-page">
            <section className="landing-hero landing-grid">
                <div className="hero-left">
                    <h1>DormLog</h1>
                    <p className="muted">A simple dorm occupant logging app — connect with Supabase and try the demo.</p>

                    <div className="hero-features">
                        <div>• Quick sign-in / sign-up</div>
                        <div>• View and manage occupants</div>
                        <div>• Admin and occupant views</div>
                    </div>

                    <div style={{ marginTop: 18 }}>
                        <Link to="/admin" className="btn-secondary">Admin</Link>
                        <Link to="/occupant" style={{ marginLeft: 8 }}>Occupant</Link>
                    </div>

                    <div style={{ marginTop: 18, fontSize: 13 }}>
                        <div>Supabase host: <strong>{envHost || 'not set'}</strong></div>
                        <div>Anon key: <strong className={anonKeyPresent ? 'ok' : 'err'}>{anonKeyPresent ? 'present' : 'missing'}</strong></div>
                    </div>
                </div>

                <div className="hero-right">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>Sign in</h2>
                        <button onClick={testSupabase} className="btn-link" disabled={loading}>{loading ? 'Testing…' : 'Test DB'}</button>
                    </div>
                    {status && (
                        <div style={{ marginTop: 8 }} className={`status ${status.ok ? 'ok' : 'err'}`}>{status.message}</div>
                    )}

                    <div className="auth-card" style={{ marginTop: 12 }}>
                        {user ? (
                            <div>
                                <div>Signed in as <strong>{user.email}</strong></div>
                                <div style={{ fontSize: 12, color: '#6b7280' }}>id: {user.id}</div>
                                <div style={{ marginTop: 8 }}>
                                    <button onClick={signOut}>Sign out</button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={signInWithEmailAndPassword} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>{showPassword ? 'Hide' : 'Show'}</button>
                                </div>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="submit" disabled={loading}>{loading ? 'Signing…' : 'Sign In'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
