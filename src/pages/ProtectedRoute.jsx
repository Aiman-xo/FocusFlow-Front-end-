import React from 'react'
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth-context/auth'
import api from '../axiosInterceptor'

function ProtectedRoute() {
    const { token, logout, user } = useAuth()
    const nav = useNavigate()

    async function handleLogout() {
        try {
            // Call API logout
            await api.post('/api/logout', {})
        } catch (e) {
            console.error('Logout error:', e)
        }
        // Always logout locally
        logout()
        nav('/login')
    }

    if (!token) {
        return <Navigate to="/login" replace />
    }

    const username = user?.username || 'Focus User'

    // Shared active class calculator
    const getLinkClass = ({ isActive }) => 
        `flex items-center gap-sm px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
            isActive 
                ? 'text-primary-fixed bg-primary/10 shadow-[0_0_15px_rgba(95,251,214,0.1)] active-glow' 
                : 'text-on-surface-variant/60 hover:text-primary hover:bg-white/5'
        }`

    const getIconClass = (isActive) => 
        `material-symbols-outlined transition-all ${isActive ? 'active-glow' : 'opacity-80 group-hover:opacity-100'}`

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-radial from-[#0d1c32] to-[#041329] text-on-surface relative overflow-x-hidden pb-20 md:pb-0">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary-container/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* --- MOBILE TOP BAR --- */}
            <header className="md:hidden fixed top-0 left-0 w-full z-50 bg-[#041329]/70 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary-fixed/10 border border-primary-fixed/20 flex items-center justify-center shadow-[0_0_10px_rgba(95,251,214,0.1)]">
                        <span className="material-symbols-outlined text-[18px] text-primary-fixed active-glow" style={{ fontVariationSettings: "'FILL' 1" }}>
                            spa
                        </span>
                    </div>
                    <span className="font-bold text-lg text-primary tracking-tight">FlowState</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-on-surface-variant/80 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                        {username}
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        title="Logout"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                </div>
            </header>

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex md:w-[280px] shrink-0 glass-card m-4 mr-0 rounded-2xl flex-col justify-between p-6 z-10">
                <div className="space-y-8">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-primary-fixed/10 border border-primary-fixed/20 flex items-center justify-center shadow-[0_0_15px_rgba(95,251,214,0.1)]">
                            <span className="material-symbols-outlined text-[24px] text-primary-fixed active-glow" style={{ fontVariationSettings: "'FILL' 1" }}>
                                spa
                            </span>
                        </div>
                        <span className="font-bold text-xl text-primary tracking-tight">FlowState</span>
                    </div>

                    {/* Navigation list */}
                    <nav className="flex flex-col gap-2">
                        <NavLink to="/dashboard" className={getLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <span className={getIconClass(isActive)} style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                                        dashboard
                                    </span>
                                    <span className="font-semibold text-sm">Dashboard</span>
                                </>
                            )}
                        </NavLink>
                        <NavLink to="/todays-task" className={getLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <span className={getIconClass(isActive)} style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                                        checklist
                                    </span>
                                    <span className="font-semibold text-sm">Today's Focus</span>
                                </>
                            )}
                        </NavLink>
                        <NavLink to="/add-new-task" className={getLinkClass}>
                            {({ isActive }) => (
                                <>
                                    <span className={getIconClass(isActive)} style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                                        add_circle
                                    </span>
                                    <span className="font-semibold text-sm">Add Task</span>
                                </>
                            )}
                        </NavLink>
                    </nav>
                </div>

                {/* Desktop User Footer & Logout */}
                <div className="space-y-4 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-secondary-container/20 border border-secondary/20 flex items-center justify-center text-secondary font-bold text-sm uppercase">
                            {username.substring(0, 2)}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold text-white truncate">{username}</span>
                            <span className="text-[11px] text-on-surface-variant/60 truncate">Active Flow</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-error/20 bg-error-container/5 text-error font-semibold text-sm hover:bg-error-container/10 active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT WINDOW --- */}
            <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 z-10 overflow-y-auto max-w-container-max mx-auto w-full">
                <Outlet />
            </main>

            {/* --- MOBILE BOTTOM NAVBAR --- */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0d1c32]/80 backdrop-blur-2xl border-t border-white/5 rounded-t-2xl shadow-[0_-4px_25px_rgba(0,0,0,0.5)] flex justify-around items-center py-2 pb-safe">
                <NavLink to="/dashboard" className={({ isActive }) => 
                    `flex flex-col items-center justify-center px-4 py-1.5 transition-all ${
                        isActive ? 'text-primary-fixed' : 'text-on-surface-variant/60'
                    }`
                }>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined text-[24px] ${isActive ? 'active-glow' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                                dashboard
                            </span>
                            <span className="text-[10px] font-semibold mt-1">Dashboard</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/todays-task" className={({ isActive }) => 
                    `flex flex-col items-center justify-center px-4 py-1.5 transition-all ${
                        isActive ? 'text-primary-fixed' : 'text-on-surface-variant/60'
                    }`
                }>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined text-[24px] ${isActive ? 'active-glow' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                                checklist
                            </span>
                            <span className="text-[10px] font-semibold mt-1">Focus</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/add-new-task" className={({ isActive }) => 
                    `flex flex-col items-center justify-center px-4 py-1.5 transition-all ${
                        isActive ? 'text-primary-fixed' : 'text-on-surface-variant/60'
                    }`
                }>
                    {({ isActive }) => (
                        <>
                            <span className={`material-symbols-outlined text-[24px] ${isActive ? 'active-glow' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                                add_circle
                            </span>
                            <span className="text-[10px] font-semibold mt-1">Add</span>
                        </>
                    )}
                </NavLink>
            </nav>
        </div>
    )
}

export default ProtectedRoute