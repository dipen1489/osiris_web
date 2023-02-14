import {Response, toAbsoluteUrl} from '../../../../../../_metronic/helpers'

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

export interface ICategory {
  type: {
    parent: boolean
    sub: boolean
  }
  name: string
  parentCategoryName: string
  description: string
  image: {
    name: string
    delete_token: string
  }
}

export const initialValues = {
  type: {
    parent: true,
    sub: false
  },
  name: "",
  parentCategoryName: "",
  description: "",
  image: {
    name: toAbsoluteUrl('/img/blank.svg'),
    delete_token: ""
  }
}

export interface CategoryRS {
  data: CategoryDataRS
  error: Error
}

export interface CategoryDataRS {
  name: string
  parentCategoryName: string
  description: string
  createdDate: string
  updatedDate: string
  image: string
  image_delete_token: string
  id: string
}

export interface Error {}


export type CategoryQueryResponse = Response<CategoryRS>
export type UsersQueryResponse = Response<Array<PreferenceCategory>>