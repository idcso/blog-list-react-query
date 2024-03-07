const Notification = ({ message, style }) => {
  if (!message) return null

  return (
    <p className={style}>
      {message}
    </p>
  )
}

export default Notification