import {FC, useState, createContext, useContext} from 'react'

import {
  WithChildren,
  InstrctorScheduleQueryRequestContextProps,
  initialInstrctorScheduleQueryRequest,
  InstrctorScheduleQueryState,
} from '../../../../../_metronic/helpers'

const QueryRequestContext = createContext<InstrctorScheduleQueryRequestContextProps>(initialInstrctorScheduleQueryRequest)

const QueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<InstrctorScheduleQueryState>(initialInstrctorScheduleQueryRequest.state)

  const updateState = (updates: Partial<InstrctorScheduleQueryState>) => {
    const updatedState = {...state, ...updates} as InstrctorScheduleQueryState
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

// import {
//   WithChildren,
//   MeetingQueryRequestContextProps,
//   initialMeetingQueryRequest,
//   MeetingQueryState,
// } from '../../../../../_metronic/helpers'

// const QueryRequestContext = createContext<MeetingQueryRequestContextProps>(initialMeetingQueryRequest)

// const QueryRequestProvider: FC<WithChildren> = ({children}) => {
//   const [state, setState] = useState<MeetingQueryState>(initialMeetingQueryRequest.state)

//   const updateState = (updates: Partial<MeetingQueryState>) => {
//     const updatedState = {...state, ...updates} as MeetingQueryState
//     setState(updatedState)
//   }
 
//   return (
//     <QueryRequestContext.Provider value={{state, updateState}}>
//       {children}
//     </QueryRequestContext.Provider>
//   )
// }

// const useQueryRequest = () => useContext(QueryRequestContext)
// export {QueryRequestProvider, useQueryRequest}
