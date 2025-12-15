import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Admin from './pages/Admin'
import Occupant from './pages/Occupant'
import Landing from './pages/Landing'

export default function App() {
    return (
        <div className="app">
            <header className="header">
                <h1>DormLog</h1>
                <nav>
                    <Link to="/">Home</Link>
                    {' | '}
                    <Link to="/admin">Admin</Link>
                    {' | '}
                    <Link to="/occupant">Occupant</Link>
                </nav>
            </header>

            <main className="container">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/occupant" element={<Occupant />} />
                </Routes>
            </main>
        </div>
    )
}

