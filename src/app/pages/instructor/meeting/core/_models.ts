import {Response} from '../../../../../_metronic/helpers'

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

export interface Error {
}

export type UsersQueryResponse = Response<Array<PreferenceCategory>>