import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  return <p className={notification.style}>{notification.message}</p>
}

export default Notification
