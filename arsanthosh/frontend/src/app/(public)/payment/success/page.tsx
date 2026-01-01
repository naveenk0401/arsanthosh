"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function PaymentSuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const txnid = searchParams.get("txnid");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        // Clear cart immediately on success page entry
        clearCart();
        
        let interval: NodeJS.Timeout;

        if (txnid) {
            const fetchOrder = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/transaction/${txnid}`);
                    const data = await res.json();
                    
                    if (data.success) {
                        setOrder(data.data);
                        // If payment is already completed by webhook, stop loading
                        if (data.data.paymentStatus === "Completed") {
                            setLoading(false);
                            return true;
                        }
                    }
                    return false;
                } catch (err) {
                    console.error(err);
                    return false;
                }
            };

            // Initial fetch
            fetchOrder().then(found => {
                if (!found && retryCount < 10) {
                   // Continue polling
                } else if (retryCount >= 10) {
                    setLoading(false);
                }
            });

            // Poll every 3 seconds for up to 30 seconds
            interval = setInterval(async () => {
                const completed = await fetchOrder();
                if (completed) {
                    clearInterval(interval);
                }
                setRetryCount(prev => {
                    if (prev >= 10) {
                        clearInterval(interval);
                        setLoading(false);
                    }
                    return prev + 1;
                });
            }, 3000);
        } else {
            setLoading(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [txnid]);

    const handleDownloadInvoice = () => {
        if (order) {
            window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/${order._id}/invoice`, '_blank');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                Verifying Payment Status...
            </div>
            <p className="text-[8px] text-gray-400 mt-2 uppercase">Webhook processing may take a few seconds</p>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-xl font-bold mb-4 uppercase tracking-widest">Order Verification Pending</h1>
            <p className="text-gray-500 mb-8 max-w-md text-center text-sm">
                We are still waiting for confirmation from PayU. Please check your email or "My Orders" in a few minutes.
            </p>
            <Link href="/store" className="px-12 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-all shadow-lg">Back to Store</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white border border-gray-100 shadow-2xl overflow-hidden rounded-sm">
                    {/* Header */}
                    <div className="bg-green-600 p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 scale-110 shadow-inner">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="text-3xl font-bold font-display uppercase tracking-tight">
                            {order.paymentStatus === "Completed" ? "Payment Successful" : "Order Received"}
                        </h1>
                        <p className="text-green-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Order Confirmed • ID: {order.orderId}</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Status & Tracking */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-50 pb-8">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Order Status</h3>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-100 text-[9px] font-black uppercase tracking-widest rounded-[2px]">{order.orderStatus}</span>
                                    <span className={`px-3 py-1 ${order.paymentStatus === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'} border text-[9px] font-black uppercase tracking-widest rounded-[2px]`}>
                                        {order.paymentStatus === 'Completed' ? 'Paid' : 'Awaiting Confirmation'}
                                    </span>
                                </div>
                            </div>
                            {order.trackingNumber && (
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tracking Number</h3>
                                    <span className="text-lg font-mono font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded border border-gray-100">{order.trackingNumber}</span>
                                </div>
                            )}
                        </div>

                        {/* Customer & Shipping */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-6 border-b border-gray-50 pb-2">Customer Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Name</p>
                                        <p className="font-bold text-gray-900">{order.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Contact</p>
                                        <p className="text-sm font-medium text-gray-600">{order.email}</p>
                                        <p className="text-sm font-medium text-gray-600">{order.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-6 border-b border-gray-50 pb-2">Shipping Address</h3>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                        {order.address}<br />
                                        {order.street}<br />
                                        {order.city}, {order.state}<br />
                                        {order.pincode}, {order.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-6 border-b border-gray-50 pb-2">Order Summary</h3>
                            <div className="space-y-4">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-sm">
                                        <div className="w-16 h-16 bg-white p-1 flex-shrink-0 border border-gray-100">
                                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-sm text-gray-900">₹{item.price?.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-end gap-2">
                                <div className="flex justify-between w-full max-w-[200px] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Total Payable</span>
                                    <span className="text-black text-lg">₹{order.totalAmount?.toLocaleString()}</span>
                                </div>
                                <div className="text-[9px] text-gray-400 uppercase tracking-widest italic mt-2">Payment Method: PayU Gateway</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            {order.paymentStatus === "Completed" && (
                                <button 
                                    onClick={handleDownloadInvoice}
                                    className="flex-1 py-5 bg-white border-2 border-black text-black font-bold uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 group"
                                >
                                    <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download Invoice PDF
                                </button>
                            )}
                            <Link href="/store" className="flex-1 py-5 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-all flex items-center justify-center shadow-lg">
                                Return to Catalogue
                            </Link>
                        </div>
                    </div>
                </div>
                
                <p className="text-center mt-12 text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
                    All Architectural Products are handled with extreme care during delivery.
                </p>
            </div>

            <Footer />
        </main>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">Initiating Order Verification...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
