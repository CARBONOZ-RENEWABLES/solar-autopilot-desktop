import React from 'react'
import AdvancedLoadingOverlay from './AdvancedLoadingOverlay'
import { useTheme } from '../hooks/useTheme'

export default function LoadingOverlay({ message = "Loading..." }) {
  const { isDark } = useTheme()
  return <AdvancedLoadingOverlay message={message} isDark={isDark} />
}