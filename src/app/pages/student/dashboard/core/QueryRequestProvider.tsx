import {FC, useState, createContext, useContext} from 'react'
import {
  WithChildren,
  initialMeetingQueryRequest,
  MeetingQueryState,
  MeetingQueryRequestContextProps,
} from '../../../../../_metronic/helpers'

const QueryRequestContext = createContext<MeetingQueryRequestContextProps>(initialMeetingQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<MeetingQueryState>(initialMeetingQueryRequest.state)

  const updateState = (updates: Partial<MeetingQueryState>) => {
    const updatedState = {...state, ...updates} as MeetingQueryState
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
