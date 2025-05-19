
import { ReactNode } from "react";
import { BarChart4, BellRing, CircleHelp, CreditCard, Search, Settings, Users } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="px-6 py-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Card Journey Tracker</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <a href="#" className="flex items-center px-3 py-2.5 text-blue-600 bg-blue-50 rounded-lg">
                <CreditCard className="mr-3 h-5 w-5" />
                Card Tracking
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg">
                <BarChart4 className="mr-3 h-5 w-5" />
                Analytics
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="mr-3 h-5 w-5" />
                User Management
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg">
                <CircleHelp className="mr-3 h-5 w-5" />
                Help & Support
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900 md:hidden">Card Journey Tracker</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <BellRing className="h-5 w-5 text-gray-500" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">ZO</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
