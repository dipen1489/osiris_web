import {Response} from '../../../../../_metronic/helpers'

export interface MeetingDataList {
  data: MeetingData[] 
  error: Error
}

export interface MeetingData {
  title: string
  id: string
  joinlink?: string
  start_time?: string
  owner_joinlink?: string
  enrolled_users: number
  instructor: string
  image?: ProfilePicModel | any
  duration?: number
  date_time?: DateTime[]
}

export interface ScheduleData {
  title: string
  owner_joinlink: string
  id: string
  duration: number
  date_time: DateTime[]
  tag: string
}

export interface ProfilePicModel {
  name: string;
  data: ImgData
}

export interface DateTime {
  start_time: string
  enrolled_users: number
}

export interface ImgData {
  type: string
  data: number[]
}

export interface Error {}

export type UsersQueryResponse = Response<Array<MeetingData>>
export type UsersScheduleQueryResponse = Response<Array<ScheduleData>>