import {FC, useState, createContext, useContext} from 'react'
import {
  WithChildren,
  initialInstrctorBroadcastQueryRequest,
  InstrctorBroadcastQueryState,
  InstrctorBroadcastQueryRequestContextProps,
} from '../../../../../_metronic/helpers'

const QueryRequestContext = createContext<InstrctorBroadcastQueryRequestContextProps>(initialInstrctorBroadcastQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<InstrctorBroadcastQueryState>(initialInstrctorBroadcastQueryRequest.state)

  const updateState = (updates: Partial<InstrctorBroadcastQueryState>) => {
    const updatedState = {...state, ...updates} as InstrctorBroadcastQueryState
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
