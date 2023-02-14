import {FC, useState, createContext, useContext} from 'react'
import {
  WithChildren,
  InstrctorQueryRequestContextProps,
  initialInstrctorQueryRequest,
  InstrctorQueryState,
} from '../../../../../_metronic/helpers'

const QueryRequestContext = createContext<InstrctorQueryRequestContextProps>(initialInstrctorQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<InstrctorQueryState>(initialInstrctorQueryRequest.state)

  const updateState = (updates: Partial<InstrctorQueryState>) => {
    const updatedState = {...state, ...updates} as InstrctorQueryState
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
