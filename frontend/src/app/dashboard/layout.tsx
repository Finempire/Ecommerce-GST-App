import Sidebar, { TopBar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar - Flex Item */}
            <Sidebar />

            {/* Main Content Area - Flex Grow */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <TopBar />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
