import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { demoUsers } from '../data/demoUsers'

const STORAGE_KEY = 'ccrs_demo_user'

function loadSavedUser() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSavedUser)

  const saveUser = (newUser) => {
    setUser(newUser)
    try {
      if (newUser) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // Storage not available: the user simply stays logged in until refresh.
    }
  }

  const login = (email, password) => {
    const match = demoUsers.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
    )
    if (!match) return { ok: false, message: 'Incorrect email or password.' }
    saveUser({ name: match.name, email: match.email, role: match.role })
    return { ok: true }
  }

  // Demo: a new student is logged in straight away. Nothing is stored permanently.
  const registerStudent = (details) => {
    saveUser({ name: details.fullName.trim(), email: details.email.trim(), role: 'student' })
  }

  const logout = () => saveUser(null)

  return (
    <AuthContext.Provider value={{ user, login, registerStudent, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider