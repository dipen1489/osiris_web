/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../_metronic/helpers'
import { getAllCategory, getAllIntructor, getPreference } from './_requests'
import { PreferenceData } from './_models';
import { useQueryRequest } from './QueryRequestProvider'

const QueryResponseContext = createResponseContext<PreferenceData>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({ children }): JSX.Element => {
  const { state } = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])
  
  const { isFetching: fecthingIntructor, refetch: refetchIntructor, data: responseIntructor, } = useQuery('intructor', () => { return getAllIntructor(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  const { isFetching: fecthingCategory, refetch: refetchCategory, data: responseCategory, } = useQuery('category', () => { return getAllCategory(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  const { isFetching: fecthingPreference, refetch: refetchPreference, data: responsePreference, } = useQuery('getPreferences', () => { return getPreference(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })

  const isLoading = fecthingIntructor || fecthingCategory || fecthingPreference
  const isRefetch = refetchIntructor || refetchCategory || refetchPreference
  const datares: any = {0:{instructor:responseIntructor}, 1:{category:responseCategory}, 2:{preference:responsePreference}}

  const data: any = []
  data['data'] = datares
  
  return (
    <QueryResponseContext.Provider value={{ isLoading: isLoading, refetch: isRefetch, response: data, query }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const { response } = useQueryResponse()
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

  const { response } = useQueryResponse()
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState
  }

  return response.payload.pagination
}

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
