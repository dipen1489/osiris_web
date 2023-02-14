import {Response} from '../../../../_metronic/helpers'

export interface BroadcastUserTypeModel {
  data: BroadcastUserType[]
  error: Error
}

export interface BroadcastUserType {
  firstName: string
  lastName: string
  email: string
  role: string
  profilePic: string
  expertise: string
  isFirstTimeLogin: boolean
  id: string
  verified: boolean
}

export type UserData = {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  profilePic?: string
  expertise?: string
  isFirstTimeLogin?: boolean
  id?: string
  verified?: boolean
  NoOfStudentAssigned?: number
  hostIds?: []
}


export interface AllMeetingRS {
  data: MeetingDataArray[]
  error: Error
}

export interface MeetingDataArray {
  name: string
  instructor: string
  recurrence: string[]
  uniqueUsers: number
  price: number
  total: number
}

export type MeetingDataType = {
  name?: string
  instructor?: string
  recurrence?: string[]
  uniqueUsers?: number
  price?: number
  total?: number
}

export interface CategoryDataModel {
  data: CategoryData[]
  error: Error
}

export interface CategoryData {
  name?: string
  parentCategoryName?: string
  description?: string
  createdDate?: string
  updatedDate?: string
  image?: string
  image_delete_token?: string
  id?: string
  NoOfStudentFavourite?: number
}

export interface Error {}

export type MeetingDataUsersQueryResponse = Response<Array<MeetingDataType>>

export type UsersDataQueryResponse = Response<Array<UserData>>

export type CategoryDataQueryResponse = Response<Array<CategoryData>>

export type BroadcastUserTypeUsersQueryResponse = Response<Array<BroadcastUserType>>