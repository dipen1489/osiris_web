import {Response} from '../../../../../_metronic/helpers'

export interface Occurrence {
  data: OccurrenceByMeeting[]
  error: Error
}

export interface OccurrenceByMeeting {
  start_time: string
  enrolled_users: EnrolledUser[]
}

export interface EnrolledUser {
  email: string
  name: string
}

export interface Error {
}

export type UsersQueryResponse = Response<Array<Occurrence>>