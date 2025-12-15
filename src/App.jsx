import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Admin from './pages/Admin'
import Occupant from './pages/Occupant'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Logs from './pages/Logs'

export default function App() {
    return (
        <div className="app">
            <header className="header">
                <h1>DormLog</h1>
                <nav>
                    <Link to="/">Home</Link>
                    {' | '}
                    <Link to="/dashboard">Dashboard</Link>
                    {' | '}
                    <Link to="/admin">Admin</Link>
                    {' | '}
                    <Link to="/occupant">Occupant</Link>
                    {' | '}
                    <Link to="/logs">Logs</Link>
                    {' | '}
                    <Link to="/profile">Profile</Link>
                </nav>
            </header>

            <main className="container">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/occupant" element={<Occupant />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/logs" element={<Logs />} />
                </Routes>
            </main>
        </div>
    )
}

