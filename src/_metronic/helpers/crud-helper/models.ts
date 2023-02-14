import { format } from 'date-fns'
import {Dispatch, SetStateAction} from 'react'
import { getMonthEndDate, pagesize } from '../../../app/modules/helper'
import moment from 'moment'

export type ID = undefined | null | number | string 

export type PaginationState = {
  page: number
  items_per_page: 10 | 30 | 50 | 100
  // limit: 10 | 30 | 50 | 100
  links?: Array<{label: string; active: boolean; url: string | null; page: number | null}>
}

export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: unknown
}

export type SearchState = {
  search?: string
}

export type Response<T> = {
  data?: T
  payload?: {
    message?: string
    errors?: {
      [key: string]: Array<string>
    }
    pagination?: PaginationState
  }
}

export type QueryState = PaginationState & SortState & FilterState & SearchState

export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

export const initialQueryState: QueryState = {
  page: 1,
  // limit: 10,
  items_per_page: 10,
}

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}

export type MeetingState = {
  gte: any
  limit: string
}

export type LteState = {
  lte?: string
}

export type MeetingQueryState = MeetingState & SearchState & LteState

export const initialMeetingQueryState: MeetingQueryState = {
  gte:  moment().format("YYYY-MM-DD"), //format(new Date(), 'y-MM-dd'),
  limit: '10',
  search: '',
}

export type MeetingQueryRequestContextProps = {
  state: MeetingQueryState
  updateState: (updates: Partial<MeetingQueryState>) => void
}

export const initialMeetingQueryRequest: MeetingQueryRequestContextProps = {
  state: initialMeetingQueryState,
  updateState: () => {},
}

export type InstrctorState = {
  gte: any
  limit: any
}

export type InstrctorSortState = {
  lte?: any
  search?: string
}

export type InstrctorQueryState = InstrctorState & InstrctorSortState

export type InstrctorQueryRequestContextProps = {
  state: InstrctorQueryState
  updateState: (updates: Partial<InstrctorQueryState>) => void
}

export const initialInstrctorQueryState: InstrctorQueryState = {
  gte: moment().format("YYYY-MM-DD"),//format(new Date(), 'y-MM-dd'),
  limit: 'all',
  lte: getMonthEndDate(), //moment().format("YYYY-MM-DD"), //format(new Date(), 'y-MM-dd'),
}

export const initialInstrctorQueryRequest: InstrctorQueryRequestContextProps = {
  state: initialInstrctorQueryState,
  updateState: () => {},
}

//SCHEDULE LIST HELPER START

export type InstrctorScheduleState = {
  gte: any
  limit: any
  isRecurrence: boolean
}

export type InstrctorScheduleSortState = {
  lte?: any
  search?: string
}

export type InstrctorScheduleQueryState = InstrctorScheduleState & InstrctorScheduleSortState & SortState

export type InstrctorScheduleQueryRequestContextProps = {
  state: InstrctorScheduleQueryState
  updateState: (updates: Partial<InstrctorScheduleQueryState>) => void
}

export const initialInstrctorScheduleQueryState: InstrctorScheduleQueryState = {
  gte: moment().format("YYYY-MM-DD"), //format(new Date(), 'y-MM-dd'),
  limit: 'all',
  isRecurrence: true,
}

export const initialInstrctorScheduleQueryRequest: InstrctorScheduleQueryRequestContextProps = {
  state: initialInstrctorScheduleQueryState,
  updateState: () => {},
}

//SCHEDULE LIST HELPER END

//ADMIN SCHEDULE LIST HELPER START

export type AdminScheduleState = {
  page: number
  gte: any
  limit: any
  isRecurrence?: boolean
}

export type AdminScheduleSortState = {
  lte?: any
  search?: string
}

export type AdminScheduleQueryState = AdminScheduleState & AdminScheduleSortState & SortState

export type AdminScheduleQueryRequestContextProps = {
  state: AdminScheduleQueryState
  updateState: (updates: Partial<AdminScheduleQueryState>) => void
}

export const initialAdminScheduleQueryState: AdminScheduleQueryState = {
  gte: '2022-01-26', //format(new Date(), 'y-MM-dd')
  page: 1,
  limit: pagesize,
}

export const initialAdminScheduleQueryRequest: AdminScheduleQueryRequestContextProps = {
  state: initialAdminScheduleQueryState,
  updateState: () => {},
}

//ADMIN SCHEDULE LIST HELPER END

//BROADCAST LIST HELPER START
export type InstrctorBroadcastState = {
  gte: any
  limit: any
}

export type InstrctorBroadcastSortState = {
  lte?: any
  search?: string
}

export type InstrctorBroadcastQueryState = InstrctorBroadcastState & InstrctorBroadcastSortState

export type InstrctorBroadcastQueryRequestContextProps = {
  state: InstrctorBroadcastQueryState
  updateState: (updates: Partial<InstrctorBroadcastQueryState>) => void
}

export const initialInstrctorBroadcastQueryState: InstrctorBroadcastQueryState = {
  gte: moment().format("YYYY-MM-DD"), //format(new Date(), 'y-MM-dd'),
  limit: 'all',
}

export const initialInstrctorBroadcastQueryRequest: InstrctorBroadcastQueryRequestContextProps = {
  state: initialInstrctorBroadcastQueryState,
  updateState: () => {},
}

//BROADCAST LIST HELPER END


export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export const initialMeetingQueryResponse = {refetch: () => {}, isLoading: false, query: ''}
export const initialInstrctorQueryResponse = {refetch: () => {}, isLoading: false, query: ''}
export const initialInstrctorScheduleQueryResponse = {refetch: () => {}, isLoading: false, query: ''}
export const initialAdminScheduleQueryResponse = {refetch: () => {}, isLoading: false, query: ''}
export const initialInstrctorBroadcastQueryResponse = {refetch: () => {}, isLoading: false, query: ''}
export const initialQueryResponse = {refetch: () => {}, isLoading: false, query: ''}

export type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  // NULL => (CREATION MODE) | MODAL IS OPENED
  // NUMBER => (EDIT MODE) | MODAL IS OPENED
  // UNDEFINED => MODAL IS CLOSED
  itemIdForUpdate?: ID
  itemIdForChange?: ID
  isUpdated?: boolean
  setItemIdForUpdate: Dispatch<SetStateAction<ID>>
  setItemIdForChange: Dispatch<SetStateAction<ID>>
  setIsUpdated: Dispatch<SetStateAction<boolean>>
  isAllSelected: boolean
  disabled: boolean
}

export const initialListView: ListViewContextProps = {
  selected: [],
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  setItemIdForUpdate: () => {},
  setItemIdForChange: () => {},
  setIsUpdated: () => {},
  isUpdated: false,
  isAllSelected: false,
  disabled: false,
}
