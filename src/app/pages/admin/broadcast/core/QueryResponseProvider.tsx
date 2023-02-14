/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from 'react-query'
import {useQueryRequest} from './QueryRequestProvider'
import { initialQueryResponse, initialQueryState } from '../../../../../_metronic/helpers/crud-helper/broadcastmodels'
import { PaginationState, WithChildren, createResponseContext, stringifyRequestQueryAdmin } from '../../../../../_metronic/helpers'
import { BroadcastUserType } from '../../request/_models'
import { getAllUsersStudentIntructor } from '../../request/_requests'

const QueryResponseContext = createResponseContext<BroadcastUserType>(initialQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQueryAdmin(state))
  const updatedQuery = useMemo(() => stringifyRequestQueryAdmin(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const { isFetching, refetch, data: response, } = useQuery('getAllusersstin', () => { return getAllUsersStudentIntructor(query)}, { cacheTime: 0, keepPreviousData: false, refetchOnWindowFocus: false })

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
    page: 0,
    items_per_page: 100
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
