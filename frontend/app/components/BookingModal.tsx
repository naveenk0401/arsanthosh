"use client";


export default function BookingModal({ isOpen, onCloseAction }: { isOpen: boolean, onCloseAction: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseAction} />

            <div className="relative bg-white w-full max-w-xl p-8 md:p-12 shadow-2xl rounded-sm animate-in zoom-in-95 duration-300">
                <button
                    onClick={onCloseAction}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Book Consultation</h3>
                    <p className="text-gray-500 text-xs md:text-sm uppercase tracking-widest font-bold">1-on-1 Design Discussion</p>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Full Name</label>
                            <input type="text" className="w-full border-b border-gray-200 py-3 focus:border-[var(--accent)] outline-none text-sm transition-colors" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Project Type</label>
                            <select className="w-full border-b border-gray-200 py-3 focus:border-[var(--accent)] outline-none text-sm bg-white cursor-pointer">
                                <option>Residential Architecture</option>
                                <option>Home Interior</option>
                                <option>Commercial / Retail</option>
                                <option>Online Consultation</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Preferred Date</label>
                        <input type="date" className="w-full border-b border-gray-200 py-3 focus:border-[var(--accent)] outline-none text-sm cursor-pointer" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Contact Number</label>
                        <input type="tel" className="w-full border-b border-gray-200 py-3 focus:border-[var(--accent)] outline-none text-sm" placeholder="+91 XXXX XXX XXX" />
                    </div>

                    <div className="pt-6">
                        <button className="w-full bg-[var(--accent)] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-opacity-90 transition-all shadow-xl">
                            Request Booking
                        </button>
                        <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-widest">Our team will call you to confirm the time slot</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
