/* eslint-disable react-hooks/rules-of-hooks */
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
import { getAllCategory } from './_requests'
import { PreferenceCategory } from './_models';
import { useQueryRequest } from './QueryRequestProvider'
import { useParams } from 'react-router-dom';
import { getMeetingDetails } from '../../details/core/_requests';

const QueryResponseContext = createResponseContext<PreferenceCategory>(initialQueryResponse)

const QueryResponseProvider: FC<WithChildren> = ({ children }): JSX.Element => {
  const { state } = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])
  const params = useParams();
  
  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const queryid : string | undefined = params.id

  if(queryid !== undefined) {
    const { isFetching: fecthingCategory, refetch: refetchCategory, data: responseCategory, } = useQuery('category', () => { return getAllCategory(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
    const { isFetching: fecthingDetails, refetch: refetchDetails, data: responseDetails, } = useQuery('getdataEdit', () => { return getMeetingDetails(queryid)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  
    const isLoading = fecthingCategory || fecthingDetails
    const isRefetch = refetchCategory || refetchDetails

    const response: any = {
      category:responseCategory, 
      edit:responseDetails
    }
      const data: any = []
      data['data'] = response

    return (
      <QueryResponseContext.Provider value={{ isLoading: isLoading, refetch: isRefetch, response: data, query }}>
        {children}
      </QueryResponseContext.Provider>
    )
  }

  const { isFetching: isLoading, refetch, data: responseCategory, } = useQuery('getcategory', () => { return getAllCategory(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })

    const response: any = {
      category:responseCategory, 
      edit:null
    }

    const data: any = []
    data['data'] = response

  return (
    <QueryResponseContext.Provider value={{ isLoading: isLoading, refetch, response: data, query }}>
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
