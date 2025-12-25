import AdminLoginForm from "@/components/common/AdminLoginForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-[#111111]">
            <Navbar />
            <div className="flex items-center justify-center px-6 py-12 md:py-24">
                <div className="bg-[#1a1a1a] w-full max-w-md p-8 md:p-12 shadow-2xl border border-gray-800">
                    <div className="text-center mb-10">
                        <div className="w-16 h-1 bg-[var(--accent)] mx-auto mb-6" />
                        <h1 className="text-white text-3xl font-bold mb-2">Admin Portal</h1>
                        <p className="text-gray-500 text-sm">Authorized personnel only</p>
                    </div>

                    <AdminLoginForm />

                    <p className="mt-8 text-center text-xs text-gray-600">
                        Contact system administrator if you lost your credentials.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
