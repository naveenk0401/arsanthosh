"use client";
import { useState, useEffect } from "react";

export default function PaymentsTab() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveClick = () => {
        setShowConfirmModal(true);
    };

    const confirmApproval = async () => {
        if (!selectedOrder) return;
        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/${selectedOrder._id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: "Approved" })
            });

            if (res.ok) {
                // Show success animation
                setShowSuccess(true);

                // Wait for 2 seconds before closing
                setTimeout(() => {
                    setShowSuccess(false);
                    setShowConfirmModal(false);
                    setSelectedOrder(null);
                    fetchOrders();
                }, 2000);
            } else {
                alert("Failed to approve order");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsProcessing(false);
        }
    };

    const updateStatus = async (orderId: string, status: string) => {
        if (status === "Approved") return handleApproveClick();
        if (!confirm(`Mark order as ${status}?`)) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchOrders();
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder({ ...selectedOrder, orderStatus: status });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white border border-gray-100 animate-in fade-in duration-500 shadow-sm relative">
            <div className="px-5 sm:px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-bold text-lg font-display uppercase italic tracking-tight text-gray-900 leading-tight">Order Management</h2>
                <div className="flex gap-4 w-full sm:w-auto">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-3 py-1 bg-white border border-gray-100 shadow-sm w-full sm:w-auto text-center">Live Orders</span>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-6 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Order ID</th>
                            <th className="px-6 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Customer</th>
                            <th className="px-6 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Details</th>
                            <th className="px-6 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Payment</th>
                            <th className="px-6 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-[9px] uppercase font-black text-gray-600 tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan={6} className="text-center py-8">Loading orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8">No orders found</td></tr>
                        ) : orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                                <td className="px-6 py-6 text-xs font-bold font-mono text-gray-600">{order.orderId}</td>
                                <td className="px-6 py-6">
                                    <div className="text-xs font-bold text-gray-900">{order.customerName}</div>
                                    <div className="text-[10px] text-gray-500">{order.phone}</div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="space-y-1">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.slice(0, 2).map((item: any, idx: number) => (
                                                <div key={idx} className="text-xs text-gray-600">
                                                    <span className="font-bold text-black">{item.quantity}x</span> {item.name || "Product"}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No items</span>
                                        )}
                                        {order.items && order.items.length > 2 && (
                                            <div className="text-[10px] text-gray-400 italic">+{order.items.length - 2} more...</div>
                                        )}
                                    </div>
                                    <div className="mt-2 text-[10px] text-gray-400 border-t border-gray-100 pt-1 truncate max-w-[200px]" title={order.address}>
                                        {order.address}
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="text-sm font-black text-gray-900">₹{order.totalAmount?.toLocaleString()}</div>
                                    <div className="text-[10px] bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">{order.paymentMethod}</div>
                                </td>
                                <td className="px-6 py-6">
                                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-[2px] border ${order.orderStatus === 'Approved' || order.orderStatus === 'Shipped' ? 'bg-green-50 border-green-100 text-green-600' :
                                        order.orderStatus === 'Rejected' ? 'bg-red-50 border-red-100 text-red-600' :
                                            'bg-yellow-50 border-yellow-100 text-yellow-600'
                                        }`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-6 flex flex-col gap-2">
                                    <button
                                        onClick={async () => {
                                            try {
                                                // Fetch fresh details
                                                const token = localStorage.getItem("token");
                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/${order._id}`, {
                                                    headers: { Authorization: `Bearer ${token}` }
                                                });
                                                const data = await res.json();
                                                if (data.success) {
                                                    setSelectedOrder(data.data);
                                                } else {
                                                    alert("Failed to load order details");
                                                }
                                            } catch (e) {
                                                console.error(e);
                                                alert("Error loading order");
                                            }
                                        }}
                                        className="p-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors text-[10px] font-bold uppercase text-center w-full"
                                    >
                                        View Order
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden p-4 space-y-4">
                {isLoading ? (
                    <p className="text-center text-xs text-gray-500">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-xs text-gray-500">No orders found</p>
                ) : orders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-100 p-4 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold font-mono text-gray-600 mb-1">{order.orderId}</div>
                                <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                                <div className="text-[10px] text-gray-500">{order.phone}</div>
                            </div>
                            <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-[2px] border ${order.orderStatus === 'Approved' || order.orderStatus === 'Shipped' ? 'bg-green-50 border-green-100 text-green-600' :
                                order.orderStatus === 'Rejected' ? 'bg-red-50 border-red-100 text-red-600' :
                                    'bg-yellow-50 border-yellow-100 text-yellow-600'
                                }`}>
                                {order.orderStatus}
                            </span>
                        </div>

                        <div className="border-t border-b border-gray-50 py-3 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Items ({order.items?.length || 0})</span>
                                <span className="font-bold">₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Method</span>
                                <div className="text-[10px] bg-gray-100 px-2 py-0.5 rounded inline-block">{order.paymentMethod}</div>
                            </div>
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem("token");
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/${order._id}`, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                        setSelectedOrder(data.data);
                                    } else {
                                        alert("Failed to load order details");
                                    }
                                } catch (e) {
                                    console.error(e);
                                    alert("Error loading order");
                                }
                            }}
                            className="w-full p-3 bg-black text-white rounded text-[10px] font-bold uppercase tracking-widest text-center"
                        >
                            View Order Details
                        </button>
                    </div>
                ))}
            </div>

            {/* View Order Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-white w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 rounded-t-xl sm:rounded-xl">
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight">Order Details</h3>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-mono">{selectedOrder.orderId}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 sm:space-y-8">
                            {/* Tracking Info (If Approved) */}
                            {selectedOrder.trackingNumber && (
                                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">Tracking Number</p>
                                    <p className="font-mono font-bold text-lg text-green-900">{selectedOrder.trackingNumber}</p>
                                </div>
                            )}

                            {/* Status & Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-[2px] border inline-block ${selectedOrder.orderStatus === 'Approved' || selectedOrder.orderStatus === 'Shipped' ? 'bg-green-50 border-green-100 text-green-600' :
                                            selectedOrder.orderStatus === 'Rejected' ? 'bg-red-50 border-red-100 text-red-600' :
                                                'bg-yellow-50 border-yellow-100 text-yellow-600'
                                            }`}>
                                            {selectedOrder.orderStatus}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment</p>
                                        <div className="font-bold text-sm">
                                            {selectedOrder.paymentMethod} <span className="text-gray-400 font-normal">({selectedOrder.paymentStatus})</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Amount</p>
                                        <div className="font-black text-2xl">₹{selectedOrder.totalAmount?.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="space-y-4 p-4 bg-gray-50 rounded border border-gray-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</p>
                                        <div className="font-bold">{selectedOrder.customerName}</div>
                                        <div className="text-xs text-gray-500">{selectedOrder.email}</div>
                                        <div className="text-xs text-gray-500">{selectedOrder.phone}</div>
                                    </div>
                                    <div className="space-y-1 pt-2 border-t border-gray-200">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Shipping Address</p>
                                        <div className="text-xs leading-relaxed text-gray-600">{selectedOrder.address}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">Order Items ({selectedOrder.items?.length || 0})</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded hover:bg-white hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden border border-gray-200">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400">IMG</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900">{item.name}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Qty: {item.quantity}</div>
                                                </div>
                                            </div>
                                            <div className="font-mono font-bold text-sm">₹{item.price?.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                            {selectedOrder.orderStatus === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(selectedOrder._id, 'Rejected')}
                                        className="w-full sm:w-auto px-6 py-3 border border-red-200 text-red-600 font-bold uppercase text-xs tracking-widest hover:bg-red-50 transition-colors"
                                    >
                                        Reject Order
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedOrder._id, 'Approved')}
                                        className="w-full sm:w-auto px-6 py-3 bg-black text-white font-bold uppercase text-xs tracking-widest hover:bg-green-600 transition-colors shadow-lg"
                                    >
                                        Approve Order
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full sm:w-auto px-6 py-3 border border-gray-300 font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Approval Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 rounded-2xl border border-gray-100">
                        {showSuccess ? (
                            <div className="p-12 text-center animate-in fade-in zoom-in-90 duration-500">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black font-display uppercase italic tracking-tighter text-gray-900">Order Approved!</h3>
                                <p className="text-gray-500 text-xs mt-3 font-bold uppercase tracking-widest">Confirmation email has been sent.</p>
                                <div className="mt-8 flex justify-center">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-${i * 200}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-8 pb-0 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-6 border border-yellow-100">
                                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-black font-display uppercase tracking-tight text-center text-gray-900 leading-tight">Confirm Order Approval</h3>
                                    <p className="text-gray-500 text-[11px] text-center mt-3 uppercase tracking-widest font-bold leading-relaxed px-4">
                                        Approving this order will generate a <span className="text-black">Tracking Number</span> and send an <span className="text-black">Order Confirmation Email</span> to <span className="italic">{selectedOrder?.email}</span>.
                                    </p>
                                </div>

                                <div className="p-8 space-y-3">
                                    <button
                                        disabled={isProcessing}
                                        onClick={confirmApproval}
                                        className={`w-full py-4 rounded-xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-green-600 hover:shadow-green-200'}`}
                                    >
                                        {isProcessing ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        )}
                                        {isProcessing ? 'Processing Approval...' : 'Confirm Approval'}
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setShowConfirmModal(false)}
                                        className="w-full py-4 rounded-xl text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-900 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="p-6 sm:p-12 text-center border-t border-gray-50 bg-gray-50/20">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Banking API Connection Secured</p>
                <p className="text-[9px] text-gray-600 mt-2 uppercase tracking-widest italic font-bold">All transactions are zero-knowledge encrypted</p>
            </div>
        </div>
    );
}
