import { useEffect } from 'react'

import { useNotificationDispatch } from '../NotificationContext'

const Notification = ({ message }) => {
  const notificationDispatch = useNotificationDispatch()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }
  useEffect(() => {
    if (message) {
      setTimeout(
        () => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }),
        5000
      )
    }
  }, [message, notificationDispatch])

  if (!message) return null
  return <div style={style}>{message}</div>
}

export default Notification
