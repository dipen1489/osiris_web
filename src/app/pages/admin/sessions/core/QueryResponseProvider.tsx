/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from 'react-query'
import {
  createResponseContext,
  initialAdminScheduleQueryResponse,
  initialQueryState,
  PaginationState,
  stringifyMeetingRequestQuery,
  WithChildren,
} from '../../../../../_metronic/helpers'
import {useQueryRequest} from './QueryRequestProvider'
import { getAllMeetingAdmin } from '../../request/_requests'
import { MeetingDataType } from '../../request/_models'

const QueryResponseContext = createResponseContext<MeetingDataType>(initialAdminScheduleQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyMeetingRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyMeetingRequestQuery(state), [state])
 
  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])
  
  const { isFetching, refetch, data: response, } = useQuery('getallMeetingsAdmin', () => { return getAllMeetingAdmin(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  
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
