import {Response} from '../../../../../_metronic/helpers'

export interface MeetingListData {
  enrolled: MeetingDataList
  interest: MeetingDataList
  all: MeetingDataList
}

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

export interface EnrollMeetingModel {
  data: EnrollMeeting
  error: Error
}

export interface EnrollMeeting {
  message: string
}

export interface EnrollMeetingRQModel {
  meetingId: string
  userId: string
  occurrenceId: string
}

export type MeetingLSData = {
  title: string
  id: string
  joinlink?: string
  start_time: string
  enrolled_users: number
  instructor: string
  image?: ProfilePicModel | any
  duration?: string
}




// GET ALL MEETING
export interface GetAllMeetingModel {
  data: GetAllMeeting
  error: Error
}

export interface GetAllMeeting {
  enrolled: Enrolled[]
  interest: Interest[]
  all: All[]
}

export interface Enrolled {
  image: Image
  title: string
  joinlink: string
  id: string
  duration: number
  start_time: string
  enrolled_users: number
  tag: string
  instructor: string
}

export interface Image {
  name: string
  data: Data2
}

export interface Data2 {
  type: string
  data: number[]
}

export interface Interest {
  image: Image2
  title: string
  id: string
  duration: number
  start_time: string
  enrolled_users: number
  instructor: string
  tag: string
}

export interface Image2 {
  name: string
  data: Data3
}

export interface Data3 {
  type: string
  data: number[]
}

export interface All {
  image: Image3
  title: string
  id: string
  duration: number
  start_time: string
  enrolled_users: number
  instructor: string
  tag: string
}

export interface Image3 {
  name: string
  data: Data4
}

export interface Data4 {
  type: string
  data: number[]
}


export interface Error {}

export type UsersQueryResponse = Response<Array<GetAllMeeting>>
export type MSUsersQueryResponse = Response<Array<MeetingLSData>>