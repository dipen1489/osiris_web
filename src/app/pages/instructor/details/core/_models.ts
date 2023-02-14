import {Response} from '../../../../../_metronic/helpers'

export interface MeetingDetailModel {
  data: MeetingDetail
  error: Error
}

export interface MeetingDetail {
  schedule?: Schedule[]
  price?: number
  equipments_required?: string[]
  mark_as_delete?: boolean
  title?: string
  owner?: string
  owner_email?: string
  description?: string
  host_id?: string
  meeting_id?: string
  meeting_type?: number
  visibility?: string
  image?: Image
  category_id?: string
  tag?: string
  owner_joinlink?: string
  meeting_param?: MeetingParam
  created_date?: string
  updated_date?: string
  id?: string
}

export interface MeetingParam {
  topic: string
  type: number
  start_time: string
  duration: string
  agenda: string
  recurrence: Recurrence
}

export interface Recurrence {
  end_date_time: string
  type: number
  repeat_interval: number
  weekly_days: string
}

export interface Schedule {
  enrolled_users: any[]
  start_time: string
  duration: number
  join_link: string
  id: string
}

export interface Image {
  name: string
  data: ImgData
}

export interface ImgData {
  type: string
  data: number[]
}


export interface MeetingResponseData {
  data: MeetingResponse
  error: Error
}

export interface MeetingResponse {}

export interface Error {}

export type UsersQueryResponse = Response<Array<MeetingDetail>>
export type MDRUsersQueryResponse = Response<Array<MeetingResponseData>>