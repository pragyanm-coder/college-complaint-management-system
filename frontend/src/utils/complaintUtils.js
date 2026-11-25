
import { toDateInputValue } from './formatters'

export const emptyFilters = {
  search: '',
  status: '',
  priority: '',
  category: '',
  department: '',
  assignment: '',
  from: '',
  to: '',
}

export const priorityRank = { Urgent: 0, High: 1, Medium: 2, Low: 3 }

// Most urgent first. For the same priority, the complaint waiting longest comes first.
export function sortByPriority(list) {
  return [...list].sort(
    (a, b) =>
      priorityRank[a.priority] - priorityRank[b.priority] ||
      new Date(a.submittedAt) - new Date(b.submittedAt),
  )
}

// Keeps only the complaints that match every filter that has been filled in.
export function filterComplaints(list, filters) {
  const text = filters.search.trim().toLowerCase()

  return list.filter((item) => {
    if (text) {
      const haystack =
        `${item.id} ${item.title} ${item.description} ${item.location} ${item.studentName}`.toLowerCase()
      if (!haystack.includes(text)) return false
    }
    if (filters.status && item.status !== filters.status) return false
    if (filters.priority && item.priority !== filters.priority) return false
    if (filters.category && item.category !== filters.category) return false
    if (filters.department && item.department !== filters.department) return false
    if (filters.assignment === 'Unassigned' && item.assignedStaff) return false
    if (filters.assignment === 'Assigned' && !item.assignedStaff) return false

    const day = toDateInputValue(item.submittedAt)
    if (filters.from && day < filters.from) return false
    if (filters.to && day > filters.to) return false
    return true
  })
}
