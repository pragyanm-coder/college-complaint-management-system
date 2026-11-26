import { useContext } from 'react'
import { ComplaintsContext } from './ComplaintsContext'

export function useComplaints() {
  return useContext(ComplaintsContext)
}