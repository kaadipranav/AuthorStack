'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function useToaster() {
  const { toast } = useToast()
  
  const showSuccess = (message: string) => {
    toast({
      title: 'Success',
      description: message,
    })
  }

  const showError = (message: string) => {
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    })
  }

  const showLoading = (message: string) => {
    const { id } = toast({
      title: 'Loading',
      description: message,
      duration: 100000, // Long duration for loading
    })
    return id
  }

  const updateToast = (id: string, message: string, isError: boolean = false) => {
    toast({
      id,
      title: isError ? 'Error' : 'Success',
      description: message,
      variant: isError ? 'destructive' : 'default',
      duration: 3000,
    })
  }

  return {
    showSuccess,
    showError,
    showLoading,
    updateToast,
  }
}
