"use client";
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function LogoutButton() {
  const pathname = usePathname();

  // We don't want the logout button to show up ON the login screen!
  if (pathname === '/login') return null;

  const handleLogout = async () => {
    // Call the logout API we made earlier
    await fetch('/api/auth/logout', { method: 'POST' });
    // Send the user back to the login screen
    window.location.href = '/login';
  };

  return (
    <button 
      onClick={handleLogout} 
      className="fixed bottom-8 right-8 bg-gray-900 hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center justify-center group"
      title="Secure Logout"
    >
      <LogOut size={24} />
      {/* This creates a tiny text pop-out when you hover over it */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 ease-in-out font-bold">
        Logout
      </span>
    </button>
  );
}