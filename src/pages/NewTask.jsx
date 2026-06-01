import React, { useState } from 'react'
import api from '../axiosInterceptor'
import { useNavigate } from 'react-router-dom'

function NewTask() {
    const [newTask, setNewTask] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    
    const token = localStorage.getItem('token')
    const nav = useNavigate()

    const presets = [
        { text: 'Finalize Q4 Strategy Presentation', category: 'Work', icon: 'work' },
        { text: 'Post-workout protein meal prep', category: 'Health', icon: 'fitness_center' },
        { text: 'Read 20 pages of "Deep Work"', category: 'Growth', icon: 'auto_stories' },
        { text: 'Update project dependencies', category: 'Tech', icon: 'code' }
    ]

    async function handleAddTask(e) {
        e.preventDefault()
        if (!newTask.trim()) {
            setError('Please enter a task description')
            return
        }

        setError('')
        setSuccess('')
        setLoading(true)

        try {
            await api.post('/todo/task/', {
                task: newTask.trim()
            })

            setSuccess('Task successfully added to today\'s focus list!')
            setNewTask('')
            
            // Redirect after a short delay so the user sees the success state
            setTimeout(() => {
                nav('/todays-task')
            }, 1000)
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.message || 'Failed to create task'
            setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-[640px] mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header Title */}
            <section className="flex items-center gap-3">
                <button 
                    onClick={() => nav('/todays-task')}
                    className="p-2.5 rounded-xl glass-card flex items-center justify-center text-on-surface-variant hover:text-white transition-all cursor-pointer"
                    title="Back to Focus"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div>
                    <h1 className="font-headline-xl text-4xl font-bold tracking-tight text-white mb-1">
                        Add New Task
                    </h1>
                    <p className="text-on-surface-variant/80 text-sm">
                        Dedicate a new focal point to your daily quest.
                    </p>
                </div>
            </section>

            {/* Input Card Container */}
            <div className="glass-card glow-primary p-6 md:p-8 rounded-2xl space-y-6">
                <form onSubmit={handleAddTask} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                            Task Description
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-on-surface-variant/50">
                                edit_note
                            </span>
                            <input 
                                type="text"
                                value={newTask}
                                onChange={(e) => { setNewTask(e.target.value); setError(''); }}
                                placeholder="What's your next focus?"
                                className="w-full bg-surface-container-low/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-on-surface-variant/30 text-md focus:outline-none focus:border-primary-fixed/50 focus:ring-1 focus:ring-primary-fixed/30 transition-all"
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Alert Notifications */}
                    {error && (
                        <div className="p-3 bg-error-container/20 border border-error/20 text-error rounded-xl text-xs flex items-start gap-2 animate-pulse">
                            <span className="material-symbols-outlined text-[16px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                                error
                            </span>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-xl text-xs flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                                check_circle
                            </span>
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Submit Actions */}
                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => nav('/todays-task')}
                            className="flex-1 py-3.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-sm font-semibold text-white transition-all cursor-pointer text-center"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 text-[13px] rounded-xl bg-primary-fixed text-on-primary-fixed font-bold shadow-[0_0_20px_rgba(95,251,214,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-on-primary-fixed/30 border-t-on-primary-fixed rounded-full animate-spin"></div>
                                    <span>Registering...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                    <span>Add Focus Item</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Presets suggestions */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70 px-2">
                    Quick Suggestions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {presets.map((preset, idx) => (
                        <div 
                            key={idx}
                            onClick={() => {
                                if (!loading) {
                                    setNewTask(preset.text)
                                    setError('')
                                }
                            }}
                            className="glass-card p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-primary-fixed/20 hover:bg-white/5 hover:scale-[1.01] transition-all duration-200"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary-fixed transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">
                                        {preset.icon}
                                    </span>
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest">{preset.category}</span>
                                    <span className="text-xs font-medium text-white truncate max-w-[200px] mt-0.5">{preset.text}</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant/30 group-hover:text-primary-fixed group-hover:translate-x-0.5 transition-all">
                                arrow_forward
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewTask