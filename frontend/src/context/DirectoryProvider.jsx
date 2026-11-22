import { useState } from 'react'
import { DirectoryContext } from './DirectoryContext'
import { demoUsers } from '../data/demoUsers'
import { sampleStaff, sampleStudents } from '../data/directory'
import { handlingDepartments } from '../data/options'

const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

function DirectoryProvider({ children }) {
  // Demo: everything here lives in memory only, so it resets when you refresh the page.
  const [departments, setDepartments] = useState(handlingDepartments)
  const [staff, setStaff] = useState(sampleStaff)
  const [students, setStudents] = useState(sampleStudents)

  const addDepartment = (name) => setDepartments((current) => [...current, name.trim()])

  const removeDepartment = (name) =>
    setDepartments((current) => current.filter((item) => item !== name))

  const addStaff = ({ name, email, departments: list }) =>
    setStaff((current) => [
      ...current,
      { name: name.trim(), email: email.trim(), departments: list, active: true },
    ])

  const updateStaffDepartments = (email, list) =>
    setStaff((current) =>
      current.map((member) => (same(member.email, email) ? { ...member, departments: list } : member)),
    )

  const setStaffActive = (email, active) =>
    setStaff((current) =>
      current.map((member) => (same(member.email, email) ? { ...member, active } : member)),
    )

  const setStudentActive = (email, active) =>
    setStudents((current) =>
      current.map((student) => (same(student.email, email) ? { ...student, active } : student)),
    )

  // Called when a student registers, so the admin can see the new student.
  const addStudent = (form) =>
    setStudents((current) => [
      ...current,
      {
        name: form.fullName.trim(),
        email: form.email.trim(),
        rollNumber: form.rollNumber.trim(),
        department: form.department,
        year: form.year,
        phone: form.phone.trim(),
        active: true,
      },
    ])

  const emailInUse = (email) =>
    [...students, ...staff, ...demoUsers].some((person) => same(person.email, email))

  const isDeactivated = (email) =>
    [...students, ...staff].some((person) => same(person.email, email) && !person.active)

  // Only active staff who work in the department can be assigned complaints.
  const staffForDepartment = (department) =>
    staff
      .filter((member) => member.active && member.departments.includes(department))
      .map((member) => member.name)

  return (
    <DirectoryContext.Provider
      value={{
        departments,
        staff,
        students,
        addDepartment,
        removeDepartment,
        addStaff,
        updateStaffDepartments,
        setStaffActive,
        setStudentActive,
        addStudent,
        emailInUse,
        isDeactivated,
        staffForDepartment,
      }}
    >
      {children}
    </DirectoryContext.Provider>
  )
}

export default DirectoryProvider