import {Response} from '../../../../../_metronic/helpers'

export interface MeetingDataList {
  data: MeetingData[] 
  error: Error
}

export interface MeetingData {
  title: string
  id: string
  joinlink?: string
  start_time: string
  enrolled_users: number
  instructor: string
  image?: ProfilePicModel | any
  duration?: string
}

export interface ProfilePicModel {
  name: string;
  data: ImgData
}

export interface ImgData {
  type: string
  data: number[]
}

export interface Error {}

export type UsersQueryResponse = Response<Array<MeetingData>>