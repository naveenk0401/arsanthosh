"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell
} from "recharts";

export default function AnalyticsTab() {
    const [data, setData] = useState<any>(null);
    const [range, setRange] = useState("monthly");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [range]);

    const fetchStats = async () => {
        setIsLoading(true);
        const response = await api.get(`/stats/business?range=${range}`);
        if (response.success) {
            setData(response.data);
        }
        setIsLoading(false);
    };

    if (isLoading) return <div className="p-20 text-center animate-pulse text-gray-600 font-bold uppercase tracking-[0.3em]">Decoding Business Intelligence...</div>;

    const summary = data?.summary || { totalRevenue: 0, estimatedExpenses: 0, netProfit: 0, revenueGrowth: 0 };

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Range Selector */}
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900">Executive Performance</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Real-time revenue & consultation metrics</p>
                </div>
                <div className="flex flex-wrap bg-gray-50 p-1 rounded-sm border border-gray-100 mt-4 md:mt-0">
                    {["daily", "weekly", "monthly", "yearly"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${range === r ? "bg-white text-[var(--primary)] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* High Level Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard label="Gross Revenue" value={`₹${summary.totalRevenue.toLocaleString()}`} growth={summary.revenueGrowth} />
                <StatCard label="Operating Costs" value={`₹${summary.estimatedExpenses.toLocaleString()}`} sub="Estimated 45%" />
                <StatCard label="Net Yield" value={`₹${summary.netProfit.toLocaleString()}`} highlight />
                <StatCard label="Status" value={summary.netProfit > 0 ? "PROFIT" : "RECOVERY"} statusItem />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 pb-4 border-b border-gray-100">Revenue Trajectory</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Consultation Chart */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 pb-4 border-b border-gray-100">Discovery Volume</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.inquiryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '0' }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" barSize={20} radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Ledger Table */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] italic text-gray-900">Operational Ledger</h3>
                    <div className="flex gap-4">
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1">Direct Profit</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Metric Point</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Activity Count</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Gross Generation</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Market Avg</th>
                                <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em] text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data?.revenueData.map((item: any) => (
                                <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-gray-900 text-sm">{range === 'yearly' ? `Month ${item._id}` : `Day ${item._id}`}</td>
                                    <td className="px-8 py-6 text-xs text-gray-600 font-bold uppercase tracking-widest">{item.count} Transactions</td>
                                    <td className="px-8 py-6 text-sm text-gray-900 font-display">₹{item.revenue.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-xs text-gray-500 italic font-bold">Expected Value</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-sm border border-green-100">
                                            Optimal
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, growth, highlight, statusItem, sub }: any) {
    return (
        <div className={`p-6 border border-gray-100 shadow-sm ${highlight ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${highlight ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
            <div className="flex items-end justify-between">
                <div>
                    <h4 className="text-xl font-display font-bold italic tracking-tighter">{value}</h4>
                    {sub && <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{sub}</p>}
                </div>
                {growth !== undefined && (
                    <span className={`text-[10px] font-black ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}%
                    </span>
                )}
                {statusItem && (
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[8px] font-black text-[var(--primary)] uppercase italic">
                        Live
                    </div>
                )}
            </div>
        </div>
    );
}
