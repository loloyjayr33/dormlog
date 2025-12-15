import React, { useEffect, useState } from 'react'
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

    async function signUpWithEmailAndPassword(e) {
        e?.preventDefault()
        if (!email || !password) {
            setStatus({ ok: false, message: 'Enter both email and password.' })
            return
        }
        setLoading(true)
        setStatus(null)
        try {
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) setStatus({ ok: false, message: error.message })
            else setStatus({ ok: true, message: `Account created for ${email}. Check email to confirm if required.` })
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
        <div className="landing">
            <section className="landing-hero">
                <h2>Welcome to DormLog</h2>
                <p>Quickly verify your Supabase connection and sign in with your email.</p>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <button onClick={testSupabase} disabled={loading}>{loading ? 'Testing…' : 'Test Supabase'}</button>
                    {status && (
                        <div className={`status ${status.ok ? 'ok' : 'err'}`}>
                            {status.message}
                        </div>
                    )}
                </div>

                <div className="auth-card">
                    <h3 style={{ marginTop: 0 }}>Sign in</h3>
                    {user ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div>Signed in as <strong>{user.email}</strong></div>
                            <button onClick={signOut}>Sign out</button>
                        </div>
                    ) : (
                        <form style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}
                            />
                            <input
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #e5e7eb' }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={signInWithEmailAndPassword} disabled={loading}>{loading ? 'Signing…' : 'Sign In'}</button>
                                <button onClick={signUpWithEmailAndPassword} type="button" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
                            </div>
                        </form>
                    )}
                </div>

                <small style={{ display: 'block', marginTop: 12, color: '#6b7280' }}>Important: ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env</small>
            </section>
        </div>
    )
}
