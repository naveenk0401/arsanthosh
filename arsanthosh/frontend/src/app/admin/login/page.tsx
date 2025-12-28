import AdminLoginForm from "@/components/common/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <div className="flex items-center justify-center px-6 py-12 md:py-24 min-h-screen">
                <div className="bg-white w-full max-w-md p-8 md:p-12 shadow-2xl border border-gray-100">
                    <div className="text-center mb-10">
                        <div className="w-16 h-1 bg-[var(--accent)] mx-auto mb-6" />
                        <h1 className="text-gray-900 text-3xl font-bold mb-2">Admin Portal</h1>
                        <p className="text-gray-500 text-sm">Authorized personnel only</p>
                    </div>

                    <AdminLoginForm />

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Contact system administrator if you lost your credentials.
                    </p>
                </div>
            </div>
        </main>
    );
}
