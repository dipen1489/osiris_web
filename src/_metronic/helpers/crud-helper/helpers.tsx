import {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react'
import qs from 'qs'
import {ID, MeetingQueryState, QueryResponseContextProps, QueryState} from './models'
import { BCQueryState } from './broadcastmodels'

function createResponseContext<T>(initialState: QueryResponseContextProps<T>) {
  return createContext(initialState)
}

function isNotEmpty(obj: unknown) {
  return obj !== undefined && obj !== null && obj !== ''
}

// Example: page=1&items_per_page=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
function stringifyRequestQuery(state: QueryState): string {
  const pagination = qs.stringify(state, {filter: ['page', 'items_per_page'], skipNulls: true})
  const sort = qs.stringify(state, {filter: ['sort', 'order'], skipNulls: true})
  const search = isNotEmpty(state.search)
    ? qs.stringify(state, {filter: ['search'], skipNulls: true})
    : ''
  const role = qs.stringify(state, {filter: ['role'], skipNulls: true})
  const limit = qs.stringify(state, {filter: ['limit'], skipNulls: true})

  const filter = state.filter
    ? Object.entries(state.filter as Object)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => {
          return `filter_${obj[0]}=${obj[1]}`
        })
        .join('&')
    : ''

  return [pagination, sort, search, filter, role, limit]
    .filter((f) => f)
    .join('&')
    .toLowerCase()
}

function stringifyRequestQueryAdmin(state: BCQueryState): string {
  const role = qs.stringify(state, {filter: ['role'], skipNulls: true})
  const limit = qs.stringify(state, {filter: ['limit'], skipNulls: true})

  return [role, limit]
    .filter((f) => f)
    .join('&')
    .toLowerCase()
}

function stringifyMeetingRequestQuery(state: MeetingQueryState): string {
  const date =  qs.stringify(state, {filter: ['gte'], skipNulls: false})
  const limit = qs.stringify(state, {filter: ['limit'], skipNulls: true})
  const lte = qs.stringify(state, {filter: ['lte'], skipNulls: true})
  const isRecurrence = qs.stringify(state, {filter: ['isRecurrence'], skipNulls: true})
  const role = qs.stringify(state, {filter: ['role'], skipNulls: true})
  const page = qs.stringify(state, {filter: ['page'], skipNulls: true})

  const search = isNotEmpty(state.search)
    ? qs.stringify(state, {filter: ['search'], skipNulls: true})
    : ''
  if(lte.trim().length === 4) {
    return [date, limit, search]
    .filter((f) => f)
    .join('&')
    // .toLowerCase()
  }
  return [date, limit, lte, search, isRecurrence, role, page]
    .filter((f) => f)
    .join('&')
    // .toLowerCase()
}


function parseRequestQuery(query: string): QueryState {
  const cache: unknown = qs.parse(query)
  return cache as QueryState
}

function calculatedGroupingIsDisabled<T>(isLoading: boolean, data: Array<T> | undefined): boolean {
  if (isLoading) {
    return true
  }

  return !data || !data.length
}

function calculateIsAllDataSelected<T>(data: Array<T> | undefined, selected: Array<ID>): boolean {
  if (!data) {
    return false
  }

  return data.length > 0 && data.length === selected.length
}

function groupingOnSelect(
  id: ID,
  selected: Array<ID>,
  setSelected: Dispatch<SetStateAction<Array<ID>>>
) {
  if (!id) {
    return
  }

  if (selected.includes(id)) {
    setSelected(selected.filter((itemId) => itemId !== id))
  } else {
    const updatedSelected = [...selected]
    updatedSelected.push(id)
    setSelected(updatedSelected)
  }
}

function groupingOnSelectAll<T>(
  isAllSelected: boolean,
  setSelected: Dispatch<SetStateAction<Array<ID>>>,
  data?: Array<T & {id?: ID}>
) {
  if (isAllSelected) {
    setSelected([])
    return
  }

  if (!data || !data.length) {
    return
  }

  setSelected(data.filter((item) => item.id).map((item) => item.id))
}

// Hook
function useDebounce(value: string | undefined, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

export {
  createResponseContext,
  stringifyRequestQuery,
  stringifyMeetingRequestQuery,
  stringifyRequestQueryAdmin,
  parseRequestQuery,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  groupingOnSelectAll,
  useDebounce,
  isNotEmpty,
}
