'use client';

import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Open GPT</h1>
      <nav className="space-x-6">
        <Link href="/" className="text-gray-700 hover:text-black">
          Home
        </Link>
        <Link href="/sign-in" className="text-gray-700 hover:text-black">
          Login
        </Link>
      </nav>
    </header>
  );
}
