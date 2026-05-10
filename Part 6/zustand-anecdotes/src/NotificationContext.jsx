import { createContext, useState } from 'react'

const NotificationContext = createContext()

let timeoutId = null

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  const notify = (message, seconds = 5) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setNotification(message)

    timeoutId = setTimeout(() => {
      setNotification('')
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext

