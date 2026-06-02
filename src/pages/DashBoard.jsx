import React, { useEffect, useState } from 'react'
import api from '../axiosInterceptor'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth-context/auth'
import {Line,XAxis,YAxis,Tooltip,ResponsiveContainer,LineChart,Legend,CartesianGrid} from 'recharts'

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Unknown Date') return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return dateStr;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-container/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-[0_12px_30px_rgba(1,14,36,0.6)] space-y-2">
                <p className="text-xs font-semibold text-on-surface-variant/80 tracking-wide">
                    {formatDate(label)}
                </p>
                <div className="space-y-1.5">
                    {payload.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 justify-between">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="w-2.5 h-2.5 rounded-full" 
                                    style={{ backgroundColor: item.stroke }}
                                />
                                <span className="text-xs text-on-surface-variant">
                                    {item.name === 'Total Tasks' ? 'Total Quests' : item.name}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-white ml-4">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

function DashBoard() {
    const { token, user } = useAuth()
    const nav = useNavigate()
    
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        percent: 0
    })

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true)
            try {
                const resp = await api.get('/todo/dash-data')
                
                const taskList = resp.data || []
                setTasks(taskList)
                
                // Calculate stats
                const total = taskList.length
                const completed = taskList.filter(t => t.is_completed).length
                const pending = total - completed
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0
                
                setStats({ total, completed, pending, percent })
            } catch (err) {
                // If 400 is returned because no tasks exist, reset stats to 0
                if (err.response?.status === 400) {
                    setStats({ total: 0, completed: 0, pending: 0, percent: 0 })
                } else {
                    console.error('Error fetching dashboard stats:', err)
                }
            } finally {
                setLoading(false)
            }
        }

        if (token) {
            fetchTasks()
        }
    }, [token])

    const username = user?.username || 'Focus User'

    // SVG Circle constants for progress wheel
    const radius = 60
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (stats.percent / 100) * circumference

    

    // const dashboard_data=[
    //     {created_at:'12/06/26',tasks:'do 1 leetcode question', id:3, is_completed:false, user_id:1},
    //     {created_at:'12/06/26',tasks:'jump in lawn', id:4, is_completed:false, user_id:1},
    //     {created_at:'12/06/26',tasks:'read 1 book', id:5, is_completed:true, user_id:1},
    //     {created_at:'12/06/26',tasks:'clean room', id:6, is_completed:true, user_id:1}
    // ]

    function group_incoming_dashboard_data(raw_data){
        const result_object={}
        for(let i=0;i<raw_data.length;i++){
            const date = raw_data[i].created_at ? raw_data[i].created_at.slice(0, 10) : 'Unknown Date'
            if(!result_object[date]){
                result_object[date] = {'created_at':raw_data[i].created_at,'Total_tasks':0,'Tasks_completed':0}
            }
            result_object[date].Total_tasks+=1
            if(raw_data[i].is_completed){
                result_object[date].Tasks_completed+=1
            }
        }
        return Object.values(result_object)
    }
    console.log(tasks);
    
//     const taks1 =[
//         { created_at: "2026-06-01", Total_tasks: 4, Tasks_completed: 0 },
//   { created_at: "2026-06-02", Total_tasks: 3, Tasks_completed: 2 },
//   { created_at: "2026-06-03", Total_tasks: 5, Tasks_completed: 5 }
//     ]

    const chart_data=group_incoming_dashboard_data(tasks)

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Greeting */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-headline-xl text-4xl font-bold tracking-tight text-white mb-1">
                        Workspace Dashboard
                    </h1>
                    <p className="text-on-surface-variant/80 text-sm">
                        Welcome back, <span className="text-primary-fixed font-semibold">{username}</span>. Ready to cultivate your flow?
                    </p>
                </div>
                <button 
                    onClick={() => nav('/add-new-task')}
                    className="px-6 py-3 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(95,251,214,0.3)] hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                    <span>Add Focus Task</span>
                </button>
            </section>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-primary-fixed/20 border-t-primary-fixed rounded-full animate-spin"></div>
                    <p className="text-sm text-on-surface-variant/70">Syncing workspace...</p>
                </div>
            ) : (
                <>
                    {/* Big Summary Section with Radial Progress Wheel */}
                    <div className="glass-card glow-primary p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">
                        {/* Progress Wheel */}
                        <div className="relative w-36 h-36 flex items-center justify-center bg-white/5 rounded-full border border-white/5 shadow-inner">
                            <svg className="w-32 h-32 transform -rotate-90">
                                {/* Background circle */}
                                <circle 
                                    cx="64" 
                                    cy="64" 
                                    r={radius} 
                                    stroke="rgba(255, 255, 255, 0.05)" 
                                    strokeWidth="8" 
                                    fill="transparent" 
                                />
                                {/* Glow circle (underlay) */}
                                {stats.percent > 0 && (
                                    <circle 
                                        cx="64" 
                                        cy="64" 
                                        r={radius} 
                                        stroke="#5ffbd6" 
                                        strokeWidth="8" 
                                        fill="transparent" 
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="opacity-40 blur-[4px] transition-all duration-1000 ease-out"
                                    />
                                )}
                                {/* Foreground progress circle */}
                                <circle 
                                    cx="64" 
                                    cy="64" 
                                    r={radius} 
                                    stroke="#5ffbd6" 
                                    strokeWidth="8" 
                                    fill="transparent" 
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-extrabold text-white tracking-tight">{stats.percent}%</span>
                                <span className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-semibold mt-0.5">Flow</span>
                            </div>
                        </div>

                        {/* Progress Message details */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {stats.percent === 100 
                                        ? 'Flow State Achieved!' 
                                        : stats.percent > 0 
                                            ? 'Entering Flow State' 
                                            : 'Initialize Daily Focus'}
                                </h2>
                                <p className="text-on-surface-variant text-sm max-w-lg">
                                    {stats.percent === 100
                                        ? 'Phenomenal! You have successfully cleared every single task on your list. Enjoy your well-earned focus state.'
                                        : stats.percent > 0
                                            ? `You are making wonderful progress! You have cleared ${stats.completed} out of ${stats.total} focus points today. Maintain the velocity!`
                                            : 'Your daily list is empty or tasks haven\'t been started yet. Dedicate a new focus task and activate your flow.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <button 
                                    onClick={() => nav('/todays-task')}
                                    className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-primary-fixed/30 hover:bg-primary-fixed/5 text-sm text-white font-semibold flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">checklist</span>
                                    <span>Open Focus List</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Numeric Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Pending Tasks */}
                        <div className="glass-card p-6 rounded-2xl space-y-3 hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                                    Active Focus
                                </span>
                                <div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary-container/30">
                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                                        schedule
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-white tracking-tight">{stats.pending}</p>
                                <p className="text-xs text-on-surface-variant/60 mt-1">Pending tasks remaining today</p>
                            </div>
                        </div>

                        {/* Completed Tasks */}
                        <div className="glass-card p-6 rounded-2xl space-y-3 hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                                    Completed
                                </span>
                                <div className="w-8 h-8 rounded-lg bg-primary-fixed-dim/10 flex items-center justify-center text-primary-fixed border border-primary-fixed/20">
                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        check_circle
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-white tracking-tight">{stats.completed}</p>
                                <p className="text-xs text-on-surface-variant/60 mt-1">Focus points cleared</p>
                            </div>
                        </div>

                        {/* Total Tasks */}
                        <div className="glass-card p-6 rounded-2xl space-y-3 hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                                    Total Quests
                                </span>
                                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed-dim/10 flex items-center justify-center text-tertiary-fixed-dim border border-tertiary-fixed-dim/20">
                                    <span className="material-symbols-outlined text-[18px]">
                                        assignment
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-white tracking-tight">{stats.total}</p>
                                <p className="text-xs text-on-surface-variant/60 mt-1">Total focus items created</p>
                            </div>
                        </div>
                    </div>
                </>
            )}


            <div className="glass-card glow-primary p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary-fixed active-glow">
                                insights
                            </span>
                            <span>Activity & Progress</span>
                        </h3>
                        <p className="text-xs text-on-surface-variant/70 mt-0.5">
                            Daily overview of your focus points and completed quests
                        </p>
                    </div>
                </div>

                <div className="w-full h-[300px] mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chart_data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <filter id="chart-glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <CartesianGrid stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                            <XAxis 
                                dataKey="created_at" 
                                stroke="rgba(214, 227, 255, 0.15)" 
                                tick={{ fill: '#bacac3', fontSize: 11, fontFamily: "'Geist', sans-serif" }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatDate}
                                dy={10}
                            />
                            <YAxis 
                                allowDecimals={false} 
                                stroke="rgba(214, 227, 255, 0.15)" 
                                tick={{ fill: '#bacac3', fontSize: 11, fontFamily: "'Geist', sans-serif" }}
                                tickLine={false}
                                axisLine={false}
                                dx={-5}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                            <Legend 
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ 
                                    paddingTop: '20px', 
                                    fontSize: '12px', 
                                    fontFamily: "'Geist', sans-serif",
                                    color: '#bacac3'
                                }}
                            />
                            <Line 
                                name="Completed Tasks"
                                type="linear" 
                                dataKey="Tasks_completed" 
                                stroke="#5ffbd6" 
                                strokeWidth={3}
                                dot={{ stroke: '#5ffbd6', strokeWidth: 1.5, fill: '#041329', r: 4 }}
                                activeDot={{ r: 6, stroke: '#041329', strokeWidth: 2, fill: '#5ffbd6' }} 
                                filter="url(#chart-glow)"
                            />
                            <Line 
                                name="Total Tasks"
                                type="linear" 
                                dataKey="Total_tasks" 
                                stroke="#d4bbff" 
                                strokeWidth={2}
                                strokeDasharray="4 4" 
                                dot={{ stroke: '#d4bbff', strokeWidth: 1, fill: '#041329', r: 3 }}
                                activeDot={{ r: 5, stroke: '#041329', strokeWidth: 2, fill: '#d4bbff' }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default DashBoard