import { useContext } from 'react'
import { DirectoryContext } from './DirectoryContext'

export function useDirectory() {
  return useContext(DirectoryContext)
}