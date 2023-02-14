/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { FC, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../../_metronic/helpers'
import { PreferenceCategory } from './_models';
import { useQueryRequest } from './QueryRequestProvider'
import { useParams } from 'react-router-dom';
import { getMeetingDetails } from '../../../../instructor/details/core/_requests';
import { getAllCategory } from '../../../request/_requests';

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
  // console.log(queryid);

  // if(queryid !== undefined) {
  //   const { isFetching: fecthingCategory, refetch: refetchCategory, data: responseCategory, } = useQuery('admincategory', () => { return getAllCategory(query)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  //   const { isFetching: fecthingDetails, refetch: refetchDetails, data: responseDetails, } = useQuery('admingetdataEdit', () => { return getMeetingDetails(queryid)}, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })
  
  //   const isLoading = fecthingCategory || fecthingDetails
  //   const isRefetch = refetchCategory || refetchDetails

  //   const response: any = {
  //     category:responseCategory, 
  //     edit:responseDetails
  //   }
  //     const data: any = []
  //     data['data'] = response

  //   return (
  //     <QueryResponseContext.Provider value={{ isLoading: isLoading, refetch: isRefetch, response: data, query }}>
  //       {children}
  //     </QueryResponseContext.Provider>
  //   )
  // } getAllCategory(query)

  const { isFetching: isLoading, refetch, data: responseCategory, } = useQuery('admingetcategory', () => { return }, { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false })

    const response: any = {
      category:responseCategory, 
      edit:null
    }

    const data: any = []
    data['data'] = response

  return (
    <QueryResponseContext.Provider value={{ isLoading: false, refetch, response: data, query }}>
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
