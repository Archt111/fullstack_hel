import { create } from 'zustand'

let timeoutId = null

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: (message, seconds = 5) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      set(() => ({ notification: message }))

      timeoutId = setTimeout(() => {
        set(() => ({ notification: '' }))
      }, seconds * 1000)
    },
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions)

