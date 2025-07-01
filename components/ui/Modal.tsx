'use client'

import React from 'react'
import { FiX } from 'react-icons/fi'

interface ModalProps {
  children: React.ReactNode
  onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 text-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-500 transition"
        >
          <FiX size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}
