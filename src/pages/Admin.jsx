import React, { useState } from 'react'

export default function Admin() {
    const [emails, setEmails] = useState('')
    const [result, setResult] = useState(null)

    const handleCreate = () => {
        const list = emails
            .split(/\s*,\s*|\s+/)
            .map(e => e.trim())
            .filter(Boolean)
        // placeholder: actual creation happens via backend (Supabase)
        setResult({ created: list.length, emails: list })
    }

    return (
        <div>
            <h2>Admin — Bulk Account Creation</h2>
            <p>Paste occupant emails (comma or newline separated):</p>
            <textarea
                value={emails}
                onChange={e => setEmails(e.target.value)}
                rows={6}
                style={{ width: '100%' }}
            />
            <div style={{ marginTop: 8 }}>
                <button onClick={handleCreate}>Create Account(s)</button>
            </div>

            {result && (
                <div style={{ marginTop: 12 }}>
                    <strong>Created:</strong> {result.created} accounts
                    <pre>{JSON.stringify(result.emails, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
