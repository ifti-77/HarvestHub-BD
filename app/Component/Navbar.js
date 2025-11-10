"use client"
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="sticky top-0 z-50 w-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-200 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <Link
          href="/"
          className="text-2xl font-extrabold text-gray-800 hover:text-red-600 transition-all duration-300"
        >
          HarvestHub-BD
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-amber-500 hover:text-white transition-all duration-300"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-amber-500 hover:text-white transition-all duration-300"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-amber-500 hover:text-white transition-all duration-300"
          >
            Contact
          </Link>
          <Link
            href={`/${session?'admindashboard':'signin'}`}
            className="px-5 py-2 bg-white border border-amber-400 text-amber-700 font-semibold rounded-xl hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {`${session?'Dashboard':'Sign In'}`}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
