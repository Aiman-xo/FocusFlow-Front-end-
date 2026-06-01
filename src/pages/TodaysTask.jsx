import React, { useEffect, useState } from 'react'
import api from '../axiosInterceptor'
import { useNavigate } from 'react-router-dom'

function TodaysTask() {
    const token = localStorage.getItem('token')
    const nav = useNavigate()
    
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [countdown, setCountdown] = useState('12h 00m')
    const [error, setError] = useState('')

    // 1. Calculate Countdown time to Midnight dynamically
    useEffect(() => {
        let initialDate = new Date().getDate()
        function updateCountdown() {
            const now = new Date()
            if (now.getDate() !== initialDate) {
                setCountdown('0h 0m')
                fetchTasks() 
                initialDate = now.getDate()
                return
            }
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)
            
            const diff = endOfDay - now
            const h = Math.floor(diff / (1000 * 60 * 60))
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            
            setCountdown(`${h}h ${m}m`)
        }
        
        updateCountdown()
        const timer = setInterval(updateCountdown, 30000)
        return () => clearInterval(timer)
    }, [])

    // 2. Fetch Tasks
    async function fetchTasks() {
        setLoading(true)
        setError('')
        try {
            const resp = await api.get('/todo/tasks')
            setTasks(resp.data || [])
        } catch (err) {
            // Handle the 400 'No Tasks detected' as an empty list, not a generic fatal error
            if (err.response?.status === 400 && err.response?.data?.detail?.includes('No Tasks')) {
                setTasks([])
            } else {
                const errorMsg = err.response?.data?.detail || err.message || 'Error loading tasks'
                setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchTasks()
            console.log(tasks);
        }
    }, [token])

    // 3. Toggle Task Completion (PATCH)
    async function handleToggleStatus(taskId, currentStatus) {
        // Optimistic UI update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t))
        
        try {
            await api.patch(`/todo/task/${taskId}/status`, {
                status: !currentStatus
            })
        } catch (err) {
            console.error('Failed to update task status:', err)
            // Revert state on failure
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: currentStatus } : t))
        }
    }

    // 4. Delete Task (DELETE)
    async function handleDeleteTask(taskId) {
        if (!window.confirm('Delete this focus task?')) return

        // Save original list for fallback
        const originalTasks = [...tasks]
        setTasks(prev => prev.filter(t => t.id !== taskId))

        try {
            await api.delete(`/todo/task/${taskId}`)
        } catch (err) {
            console.error('Failed to delete task:', err)
            // Restore state on failure
            setTasks(originalTasks)
            alert('Failed to delete task. Please try again.')
        }
    }

    // 5. Keyword-based Smart Badges (Auto-categorizer)
    function getTaskBadge(taskText) {
        const text = taskText.toLowerCase()
        
        // Technical topics
        if (/\b(code|debug|compile|dependency|git|api|database|tech|npm|vite|react|fastapi)\b/.test(text)) {
            return {
                label: 'Tech',
                icon: 'code',
                classes: 'text-tertiary-fixed-dim bg-tertiary-container/10'
            }
        }
        // Health/Fitness
        if (/\b(gym|workout|protein|diet|meal|run|fitness|sleep|stretch|water|yoga)\b/.test(text)) {
            return {
                label: 'Health',
                icon: 'fitness_center',
                classes: 'text-primary-fixed-dim bg-primary-container/10'
            }
        }
        // Personal Growth
        if (/\b(read|book|learn|course|study|pages|chapter|growth|meditate|journal)\b/.test(text)) {
            return {
                label: 'Growth',
                icon: 'auto_stories',
                classes: 'text-secondary-fixed-dim bg-secondary-container/10'
            }
        }
        // Work/Professional
        if (/\b(work|meeting|presentation|report|q4|strategy|office|task|project|email|schedule)\b/.test(text)) {
            return {
                label: 'Work',
                icon: 'work',
                classes: 'text-secondary-fixed-dim bg-secondary-container/30'
            }
        }
        // Default
        return {
            label: 'Focus',
            icon: 'spa',
            classes: 'text-on-surface-variant/80 bg-white/5'
        }
    }

    // Split tasks
    const activeTasks = tasks.filter(t => !t.is_completed)
    const completedTasks = tasks.filter(t => t.is_completed)

    return (
        <div className="space-y-8 max-w-[800px] mx-auto animate-fade-in pb-12">
            {/* Header Section */}
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="font-headline-xl text-4xl font-bold tracking-tight text-white mb-1">
                        Today's Focus
                    </h1>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        <p>Clears in <span className="text-primary-fixed font-bold">{countdown}</span></p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => nav('/add-new-task')}
                        className="px-5 py-2.5 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(95,251,214,0.2)] hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add Task</span>
                    </button>
                </div>
            </section>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-primary-fixed/20 border-t-primary-fixed rounded-full animate-spin"></div>
                    <p className="text-sm text-on-surface-variant/70">Syncing focus checklist...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-error-container/20 border border-error/20 text-error rounded-xl text-sm flex items-start gap-2 max-w-md mx-auto">
                    <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        error
                    </span>
                    <div>
                        <h4 className="font-bold mb-1">Failed to fetch focus list</h4>
                        <p>{error}</p>
                        <button onClick={fetchTasks} className="mt-2 text-xs font-bold text-white underline block cursor-pointer">
                            Retry Sync
                        </button>
                    </div>
                </div>
            ) : tasks.length === 0 ? (
                /* Glowing Empty State Layout */
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 max-w-sm mx-auto">
                    <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-primary-fixed/20 border border-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary-fixed/5 blur-[20px] rounded-full"></div>
                        <span className="material-symbols-outlined text-[48px] text-primary-fixed/50 relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                            bedtime
                        </span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">All focused out</h3>
                        <p className="text-sm text-on-surface-variant max-w-[280px]">
                            Your focus list is empty. Add a task to start your flow.
                        </p>
                    </div>
                    <button 
                        onClick={() => nav('/add-new-task')}
                        className="px-6 py-2.5 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold shadow-[0_0_20px_rgba(95,251,214,0.2)] hover:scale-105 transition-transform duration-200 cursor-pointer"
                    >
                        Create first task
                    </button>
                </div>
            ) : (
                /* Checklist container */
                <div className="space-y-2">
                    {/* Active Focus Checklist */}
                    <div className="space-y-3">
                        {activeTasks.map((t) => {
                            const badge = getTaskBadge(t.task)
                            return (
                                <div 
                                    key={t.id}
                                    className="task-item glass-card glow-primary p-4 rounded-xl flex items-center justify-between group transition-all duration-300 hover:border-primary/20"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Custom Checkbox */}
                                        <div className="relative flex items-center justify-center">
                                            <input 
                                                type="checkbox"
                                                checked={t.is_completed}
                                                onChange={() => handleToggleStatus(t.id, t.is_completed)}
                                                className="task-checkbox check-animation appearance-none w-6 h-6 rounded-full border border-white/30 bg-transparent checked:bg-primary-fixed checked:border-primary-fixed transition-all cursor-pointer z-10 focus:outline-none focus:ring-1 focus:ring-primary-fixed"
                                            />
                                            <span 
                                                className={`material-symbols-outlined absolute text-[16px] text-on-primary-fixed pointer-events-none select-none transition-opacity ${t.is_completed ? 'opacity-100' : 'opacity-0'}`} 
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                check
                                            </span>
                                        </div>
                                        {/* Task Label & Smart Badge */}
                                        <div className="task-label flex flex-col transition-all">
                                            <span className="text-md font-semibold text-white tracking-wide">{t.task}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.classes}`}>
                                                    <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                                                    {badge.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action button */}
                                    <button 
                                        onClick={() => handleDeleteTask(t.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-on-surface-variant hover:text-error"
                                        title="Delete task"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Completed Section Divider */}
                    {completedTasks.length > 0 && (
                        <div className="py-6 flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-white/5"></div>
                            <span className="text-[10px] font-bold tracking-widest text-on-surface-variant/40">COMPLETED</span>
                            <div className="h-[1px] flex-1 bg-white/5"></div>
                        </div>
                    )}

                    {/* Completed Checklist */}
                    <div className="space-y-3">
                        {completedTasks.map((t) => {
                            const badge = getTaskBadge(t.task)
                            return (
                                <div 
                                    key={t.id}
                                    className="task-item glass-card opacity-50 p-4 rounded-xl flex items-center justify-between group grayscale-[0.3]"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Custom Checkbox */}
                                        <div className="relative flex items-center justify-center">
                                            <input 
                                                type="checkbox"
                                                checked={t.is_completed}
                                                onChange={() => handleToggleStatus(t.id, t.is_completed)}
                                                className="task-checkbox appearance-none w-6 h-6 rounded-full border border-primary-fixed bg-primary-fixed transition-all cursor-pointer z-10 focus:outline-none"
                                            />
                                            <span 
                                                className="material-symbols-outlined absolute text-[16px] text-on-primary-fixed pointer-events-none select-none transition-opacity opacity-100" 
                                                style={{ fontVariationSettings: "'FILL' 1" }}
                                            >
                                                check
                                            </span>
                                        </div>
                                        {/* Task Label & Smart Badge */}
                                        <div className="task-label flex flex-col line-through text-on-surface-variant">
                                            <span className="text-md font-medium">{t.task}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                                                    {badge.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action button */}
                                    <button 
                                        onClick={() => handleDeleteTask(t.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-on-surface-variant hover:text-error"
                                        title="Delete task"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TodaysTask