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

    const summary = data?.summary || { totalRevenue: 0, netProfit: 0, revenueGrowth: 0 };
    const inventory = data?.inventory || { summary: { totalStock: 0, totalReturned: 0, totalDamaged: 0 }, fastMovers: [], slowMovers: [] };
    const clients = data?.clients || { contacted: 0, closed: 0, conversionRate: 0 };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
            {/* Range Selector */}
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900">Executive Intelligence</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Cross-platform business performance metrics</p>
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

            {/* Top Level Financials */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard label="Gross Revenue" value={`₹${summary.totalRevenue.toLocaleString()}`} growth={summary.revenueGrowth} />
                <StatCard label="Net Profit" value={`₹${summary.netProfit.toLocaleString()}`} highlight />
                <StatCard label="Deal Value" value={clients.closed} sub="Deals Closed" />
                <StatCard label="Conversion" value={`${clients.conversionRate.toFixed(1)}%` || "0%"} statusItem />
            </div>

            {/* Inventory & Client Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Total Inventory</p>
                    <h4 className="text-2xl font-bold font-display italic">{inventory.summary.totalStock}</h4>
                    <p className="text-[9px] font-bold text-gray-500 uppercase mt-2 tracking-tighter">Live Units In Warehouse</p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-4">Returns & Damages</p>
                    <div className="flex gap-4 items-end">
                        <h4 className="text-2xl font-bold font-display italic text-red-600">{inventory.summary.totalReturned + inventory.summary.totalDamaged}</h4>
                        <span className="text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">
                            {inventory.summary.totalReturned}R / {inventory.summary.totalDamaged}D
                        </span>
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase mt-2 tracking-tighter">Total Stock Loss Metric</p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-4">Active Leads</p>
                    <h4 className="text-2xl font-bold font-display italic">{clients.contacted}</h4>
                    <p className="text-[9px] font-bold text-gray-500 uppercase mt-2 tracking-tighter">Clients Contacted This Month</p>
                </div>
                <div className="bg-white p-6 border border-gray-100 shadow-sm">
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-4">Closed Projects</p>
                    <h4 className="text-2xl font-bold font-display italic">{clients.closed}</h4>
                    <p className="text-[9px] font-bold text-gray-500 uppercase mt-2 tracking-tighter">Direct Revenue Generation</p>
                </div>
            </div>

            {/* Inventory Velocity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fast Movers */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full blur-3xl -mr-10 -mt-10" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                        Fast Moving Assets
                        <span className="text-green-500">HOT</span>
                    </h3>
                    <div className="space-y-4">
                        {inventory.fastMovers.length > 0 ? inventory.fastMovers.slice(0, 3).map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50/50 border border-gray-100 rounded-sm">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">{item.name}</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">{item.totalSold} Units Sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-900">₹{item.revenue.toLocaleString()}</p>
                                    <div className="w-20 h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: '85%' }} />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-[10px] text-gray-400 py-10 text-center uppercase font-bold tracking-widest italic">Awaiting high-volume sales data...</p>
                        )}
                    </div>
                </div>

                {/* Slow Movers */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full blur-3xl -mr-10 -mt-10" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                        Slow Moving Assets
                        <span className="text-red-500">STAGNANT</span>
                    </h3>
                    <div className="space-y-4">
                        {inventory.slowMovers.length > 0 ? inventory.slowMovers.slice(0, 3).map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50/50 border border-gray-100 rounded-sm">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">{item.name}</p>
                                    <p className="text-[9px] text-gray-500 mt-0.5">{item.totalSold || 0} Units Sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-900">₹{(item.revenue || 0).toLocaleString()}</p>
                                    <div className="w-20 h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-400" style={{ width: '15%' }} />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-[10px] text-gray-400 py-10 text-center uppercase font-bold tracking-widest italic">All catalog items are moving optimally.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Trend Graphs */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Discovery Volume Chart */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 pb-4 border-b border-gray-100 italic">Inquiry Flux Tracker ({range})</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.inquiryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} label={{ value: range === 'daily' ? 'Hour' : range === 'yearly' ? 'Month' : 'Day', position: 'insideBottom', offset: -5, fontSize: 9 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563' }} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontSize: '10px', fontStyle: 'italic', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" barSize={24} radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center gap-10">
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Discovery</p>
                            <p className="text-sm font-bold mt-1">{data?.inquiryData.reduce((acc: any, cur: any) => acc + cur.count, 0)} leads</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Avg Growth</p>
                            <p className="text-sm font-bold mt-1 text-green-500">+12.5%</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Trajectory Chart */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 pb-4 border-b border-gray-100 italic">Revenue Velocity ({range})</h3>
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
                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center gap-10">
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Highest Peak</p>
                            <p className="text-sm font-bold mt-1 text-green-600">₹{Math.max(...(data?.revenueData.map((d: any) => d.revenue) || [0])).toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Sustainability</p>
                            <p className="text-sm font-bold mt-1 uppercase text-blue-500">Optimal</p>
                        </div>
                    </div>
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
