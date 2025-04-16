"use client"

import React from 'react'
import { Button } from './button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  className?: string
}

export function SuccessPopup({
  isOpen,
  onClose,
  title = "Success!",
  message,
  className
}: SuccessPopupProps) {
  if (!isOpen) return null
  
  // Add a click handler to prevent closing when clicking inside the popup
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={onClose} // Close when clicking the overlay
    >
      <div 
        className={cn(
          "bg-background rounded-lg shadow-lg p-6 max-w-md w-full animate-in fade-in zoom-in duration-300",
          className
        )}
        onClick={handlePopupClick} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="mb-6 text-muted-foreground">
          {message}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
