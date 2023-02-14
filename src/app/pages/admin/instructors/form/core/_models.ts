import {Response} from '../../../../../../_metronic/helpers'

export interface PreferenceCategoryModel {
  data: PreferenceCategory[]
  error: Error
}

export interface MeetingAddEditModel {
  category: PreferenceCategoryModel
  edit?: any
}

export interface PreferenceCategory {
  name: string
  parentCategoryName?: string
  description: string
  image?: ProfilePicClass | any
  createdDate: string
  updatedDate: string
  id: string
}

export interface ProfilePicClass {
  name: string;
  data: ImgData
}

export interface ImgData {
  type: string
  data: number[]
}

export interface InstructorRS {
  data: InstructorRSData
}

export interface InstructorRSData {
  message: string
}

export interface IInstructor {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmpasword: string
  role: string
  expertise: string
}

export const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmpasword: "",
  role: "instructor",
  expertise: "",
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

export interface Error {}


export type InstructorQueryResponse = Response<InstructorRS>
export type CategoryQueryResponse = Response<InstructorRS>
export type UsersQueryResponse = Response<Array<PreferenceCategory>>
export type MeetingDataUsersQueryResponse = Response<Array<MeetingDataArray>>