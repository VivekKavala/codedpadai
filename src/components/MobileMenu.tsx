'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 1. Import createPortal
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

// Define the menu items
const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
  { name: 'Features', href: '/features' },
  { name: 'Security', href: '/security' },
  { name: 'How it works', href: '/how-it-works' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // 2. Add state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 3. Set mounted to true only on the client
    setIsMounted(true);

    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('overflow-hidden');
      // Set mounted to false on unmount
      setIsMounted(false);
    };
  }, [isOpen]); // The effect depends on the 'isOpen' state

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  // 4. Create the menu content as a variable
  const menuContent = (
    <div
      // Use the correct z-index syntax and high value
      className="fixed inset-0 top-0 left-0 w-screen h-screen bg-white z-[50000]"
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
    >
      {/* --- CLOSE BUTTON (INSIDE) --- */}
      <div className="flex justify-end p-4">
        <button
          onClick={closeMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-label="Close main menu"
        >
          <span className="sr-only">Close main menu</span>
          <X className="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* --- Navigation Links --- */}
      <nav className="flex flex-col px-4 pt-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={closeMenu}
            className="block px-4 py-3 text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    // 'md:hidden' ensures this menu only shows on mobile
    <div className="relative md:hidden">
      {/* --- MENU OPEN BUTTON --- */}
      <button
        onClick={openMenu}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-label="Open main menu"
      >
        <span className="sr-only">Open main menu</span>
        <Menu className="block h-5 w-5" aria-hidden="true" />
      </button>

      {/* --- FULL-SCREEN MENU OVERLAY --- */}
      {/* 5. Use the portal */}
      {/* Only render the portal if mounted (on client) and menu is open */}
      {isMounted && isOpen ? createPortal(menuContent, document.body) : null}
    </div>
  );
}
