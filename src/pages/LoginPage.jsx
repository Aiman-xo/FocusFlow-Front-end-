import React, { useState } from 'react'
import api from '../axiosInterceptor'
import { useAuth } from '../auth-context/auth'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const [isRegister, setIsRegister] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const nav = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields')
            return
        }

        setError('')
        setLoading(true)

        const endpoint = isRegister 
            ? '/api/register/' 
            : '/api/login/'

        try {
            const resp = await api.post(endpoint, {
                username: username.trim(),
                password: password.trim()
            })

            const data = resp.data
            if (data.access_token) {
                const decoded = jwtDecode(data.access_token)
                login(data.access_token, decoded)
                nav('/dashboard')
            } else {
                setError('Authentication succeeded but access token was missing.')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.message || 'Something went wrong'
            setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-radial from-[#0d1c32] to-[#041329]">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-fixed/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-secondary-container/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-[440px] z-10">
                {/* Header Logo */}
                <div className="flex flex-col items-center mb-base text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary-fixed/10 border border-primary-fixed/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(95,251,214,0.1)]">
                        <span className="material-symbols-outlined text-[32px] text-primary-fixed active-glow" style={{ fontVariationSettings: "'FILL' 1" }}>
                            spa
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">FlowState</h1>
                    <p className="text-on-surface-variant/80 text-sm max-w-[280px] mb-3">
                        {isRegister ? 'Begin your productivity journey' : 'Enter your workspace & restore focus'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card glow-primary rounded-2xl p-6 md:p-8">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-white/10 mb-6">
                        <button 
                            type="button"
                            onClick={() => { setIsRegister(false); setError(''); }}
                            className={`flex-1 pb-3 text-center font-semibold text-sm transition-all duration-300 border-b-2 relative ${!isRegister ? 'text-primary-fixed border-primary-fixed font-bold' : 'text-on-surface-variant/50 border-transparent hover:text-on-surface-variant'}`}
                        >
                            Sign In
                        </button>
                        <button 
                            type="button"
                            onClick={() => { setIsRegister(true); setError(''); }}
                            className={`flex-1 pb-3 text-center font-semibold text-sm transition-all duration-300 border-b-2 relative ${isRegister ? 'text-primary-fixed border-primary-fixed font-bold' : 'text-on-surface-variant/50 border-transparent hover:text-on-surface-variant'}`}
                        >
                            Create Account
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                                Username
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant/50">
                                    person
                                </span>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="yourusername"
                                    className="w-full bg-surface-container-low/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-on-surface-variant/30 text-sm focus:outline-none focus:border-primary-fixed/50 focus:ring-1 focus:ring-primary-fixed/30 transition-all"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                                Password
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant/50">
                                    lock
                                </span>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    maxLength={10}
                                    className="w-full bg-surface-container-low/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-on-surface-variant/30 text-sm focus:outline-none focus:border-primary-fixed/50 focus:ring-1 focus:ring-primary-fixed/30 transition-all"
                                    disabled={loading}
                                />
                            </div>
                            {isRegister && (
                                <p className="text-[11px] text-on-surface-variant/60">
                                    Maximum 10 characters.
                                </p>
                            )}
                        </div>

                        {/* Error Notification */}
                        {error && (
                            <div className="p-3 bg-error-container/20 border border-error/20 text-error rounded-xl text-xs flex items-start gap-2 animate-pulse">
                                <span className="material-symbols-outlined text-[16px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    error
                                </span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 mt-2 text-[14px] rounded-[9px] bg-primary-fixed text-on-primary-fixed font-bold shadow-[0_0_20px_rgba(95,251,214,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-on-primary-fixed/30 border-t-on-primary-fixed rounded-full animate-spin"></div>
                                    <span>{isRegister ? 'Registering...' : 'Signing in...'}</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">
                                        {isRegister ? 'person_add' : 'login'}
                                    </span>
                                    <span>{isRegister ? 'Register & Enter Flow' : 'Enter Workspace'}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage