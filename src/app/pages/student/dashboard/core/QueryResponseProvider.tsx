/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from 'react-query'
import {
  createResponseContext,
  initialMeetingQueryResponse,
  initialQueryState,
  PaginationState,
  stringifyMeetingRequestQuery,
  WithChildren,
} from '../../../../../_metronic/helpers'
import {getAllMeetings} from './_requests'
import {GetAllMeeting} from './_models'
import {useQueryRequest} from './QueryRequestProvider'

const QueryResponseContext = createResponseContext<GetAllMeeting>(initialMeetingQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyMeetingRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyMeetingRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])
  
  const { isFetching, refetch, data: response, } = useQuery('getallMeeting', () => { return getAllMeetings(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
    
  // const { isFetching: fecthingEnrolled, refetch: refetchEnrolled, data: responseEnrolled, } = useQuery('enrolledMeeting', () => { return getEnrolledMeetingList(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  // const { isFetching: fecthingInterested, refetch: refetchInterested, data: responseInterested, } = useQuery('interestedMeeting', () => { return getInterestedMeetingList(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  // const { isFetching: fecthingAll, refetch: refetchAll, data: responseAll, } = useQuery('allMeeting', () => { return getAllMeetingList(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })

  // const isLoading = fecthingEnrolled || fecthingInterested || fecthingAll
  // const isRefetch = refetchEnrolled || refetchInterested || refetchAll
  
  // const datares: any = {
  //   0:{enrolled:responseEnrolled}, 
  //   1:{interest:responseInterested},
  //   2:{all:responseAll}
  // }

  // const data: any = []
  // data['data'] = datares
  
  return (
    <QueryResponseContext.Provider value={{ isLoading: isFetching, refetch, response, query }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) {
    return []
  }

  return response?.data || []
}

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  }

  const {response} = useQueryResponse()
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState
  }

  return response.payload.pagination
}

const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
