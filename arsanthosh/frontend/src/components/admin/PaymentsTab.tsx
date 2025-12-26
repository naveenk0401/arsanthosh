"use client";

export default function PaymentsTab() {
    // This will eventually fetch real payment data from a collection
    const mockPayments = [
        { id: "#2391", client: "Naveen K", date: "2025-12-25", amount: "₹45,000", method: "Razorpay", status: "Verified" },
        { id: "#2390", client: "Santhosh", date: "2025-12-24", amount: "₹1,200", method: "UPI", status: "Pending" },
        { id: "#2389", client: "Client-X", date: "2025-12-23", amount: "₹8,500", method: "Card", status: "Verified" },
    ];

    return (
        <div className="bg-[#111111] border border-white/5 animate-in fade-in duration-500">
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h2 className="font-bold text-lg font-display uppercase italic italic tracking-tight text-white">Payment Ledger</h2>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/5">Total Vol: ₹54,700</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.01] border-b border-white/5">
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Transaction ID</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Customer Identity</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Timestamp</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Net Amount</th>
                            <th className="px-8 py-5 text-[9px] uppercase font-black text-gray-500 tracking-[0.2em]">Auth Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockPayments.map((p, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6 text-xs font-bold font-mono text-gray-400">{p.id}</td>
                                <td className="px-8 py-6 text-sm font-bold text-white uppercase tracking-tight">{p.client}</td>
                                <td className="px-8 py-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">{p.date}</td>
                                <td className="px-8 py-6 text-sm font-black text-white tabular-nums">{p.amount}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-[2px] ${p.status === 'Verified' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-12 text-center border-t border-white/5 bg-white/[0.01]">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Banking API Connection Secured</p>
                <p className="text-[9px] text-gray-700 mt-2 uppercase tracking-widest italic">All transactions are zero-knowledge encrypted</p>
            </div>
        </div>
    );
}
