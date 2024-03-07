import { useReducer, createContext, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SETUP_USER':
      return action.user
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const valueAndDispatch = useContext(UserContext)
  return valueAndDispatch[0]
}

export default UserContext
