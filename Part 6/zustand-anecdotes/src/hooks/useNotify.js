import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

// Tiny helper so components don't have to import/useContext directly.
export const useNotify = () => useContext(NotificationContext)

