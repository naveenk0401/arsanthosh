"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";

export default function NewsletterTab() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0 });

    // Compose State
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [testEmail, setTestEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState<{ success: boolean; msg: string } | null>(null);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        const response = await api.get("/subscribers");
        if (response.success) {
            setSubscribers(response.data as any[]);
            const total = (response.data as any[]).length;
            const active = (response.data as any[]).filter((s: any) => s.isSubscribed).length;
            setStats({ total, active });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setSendResult(null);

        // Confirmation
        if (!testEmail && !window.confirm(`Are you sure you want to send this email to all ${stats.active} subscribers?`)) {
            setSending(false);
            return;
        }

        try {
            const response = await api.post("/subscribers/send-update", {
                subject,
                message,
                testEmail: testEmail || undefined // Only send test email if provided
            });

            if (response.success) {
                setSendResult({ success: true, msg: "Email sent successfully!" });
                if (!testEmail) {
                    // Clear form only if real send
                    setSubject("");
                    setMessage("");
                }
            } else {
                setSendResult({ success: false, msg: response.error?.message || "Failed to send." });
            }
        } catch (error) {
            setSendResult({ success: false, msg: "Network error occurred." });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Stats */}
            <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold font-display text-gray-900">Newsletter Management</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Manage subscribers & updates</p>
                </div>
                <div className="flex gap-6">
                    <div className="text-right">
                        <p className="text-3xl font-bold text-[var(--primary)]">{stats.total}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total Users</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Active Subs</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Compose Section */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-gray-800 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Compose Update
                    </h3>

                    <form onSubmit={handleSend} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Subject</label>
                            <input 
                                type="text" 
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. New Collection Arrival!" 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Message Content (HTML Allowed)</label>
                            <textarea 
                                rows={8}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="<p>Hello Subscribers,</p>..." 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none focus:border-[var(--accent)] text-sm font-mono text-xs"
                            />
                            <p className="text-[10px] text-gray-400 italic">Basic HTML tags supported for formatting.</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                             <div className="space-y-2 mb-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Send Test Email To (Optional)</label>
                                <input 
                                    type="email" 
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="Enter your email to test first" 
                                    className="w-full px-4 py-2 bg-white border border-gray-200 outline-none focus:border-[var(--accent)] text-xs"
                                />
                            </div>

                            {sendResult && (
                                <div className={`p-3 mb-4 text-xs font-bold border ${sendResult.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {sendResult.msg}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={sending}
                                className="w-full bg-[var(--primary)] text-white py-4 font-bold hover:bg-black transition-all uppercase tracking-widest text-xs disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        {testEmail ? "Send Test Email" : "Send to All Subscribers"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Subscribers List */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm flex flex-col h-[600px]">
                    <h3 className="font-bold text-sm uppercase tracking-[0.2em] mb-6 text-gray-800 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Subscriber List
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-sm" />)}
                            </div>
                        ) : subscribers.length > 0 ? (
                            <div className="space-y-2">
                                {subscribers.map((sub) => (
                                    <div key={sub._id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 hover:bg-white hover:border-[var(--primary)]/20 transition-colors group">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{sub.email}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                                                Joined {new Date(sub.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm ${sub.isSubscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {sub.isSubscribed ? 'Active' : 'Unsub'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                                No subscribers found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
