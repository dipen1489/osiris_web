import {FC, useState, createContext, useContext} from 'react'
import {
  WithChildren,
  AdminScheduleQueryRequestContextProps,
  AdminScheduleQueryState,
  initialAdminScheduleQueryRequest,
} from '../../../../../../_metronic/helpers'

const QueryRequestContext = createContext<AdminScheduleQueryRequestContextProps>(initialAdminScheduleQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<AdminScheduleQueryState>(initialAdminScheduleQueryRequest.state)

  const updateState = (updates: Partial<AdminScheduleQueryState>) => {
    const updatedState = {...state, ...updates} as AdminScheduleQueryState
    setState(updatedState)
  }

  return (
    <QueryRequestContext.Provider value={{state, updateState}}>
      {children}
    </QueryRequestContext.Provider>
  )
}

const useQueryRequest = () => useContext(QueryRequestContext)
export {QueryRequestProvider, useQueryRequest}
