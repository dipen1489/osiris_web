import {FC, useState, createContext, useContext} from 'react'
import { BCQueryState, QueryRequestContextProps, initialQueryRequest } from '../../../../../_metronic/helpers/crud-helper/broadcastmodels'
import { WithChildren } from '../../../../../_metronic/helpers'

const QueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<BCQueryState>(initialQueryRequest.state)

  const updateState = (updates: Partial<BCQueryState>) => {
    const updatedState = {...state, ...updates} as BCQueryState
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
