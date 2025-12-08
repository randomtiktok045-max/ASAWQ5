'use client'

import React from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <div className={className ? className : ''}>
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white text-slate-900 placeholder-slate-500 shadow-sm"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="مسح البحث"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}