import {Response} from '../../../../../_metronic/helpers'

// Student Preference Instructor Model
export interface PreferenceInstructorModel {
  data:  PreferenceInstructor[];
  error: Error;
}

export interface PreferenceInstructor {
  verified:             boolean;
  zoomUserid:           string;
  role:                 string;
  dob:                  Date;
  isFirstTimeLogin:     boolean;
  meetings:             any[];
  expertise:            string
  hostIds:              any[];
  favouriteInstructor?: any[];
  firstName?:            string;
  firstname:            string;
  lastName:             string;
  email:                string;
  username:             string;
  createdDate:          Date;
  updatedDate:          Date;
  image:                   string;
  profilePic:           ProfilePicClass | any
  id:                   string;
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

export interface PreferenceCategoryModel {
  data: PreferenceCategory[]
  error: Error
}

export interface PreferenceCategory {
  name: string
  parentCategoryName?: string
  description: string
  image: ProfilePicClass | any
  createdDate: string
  updatedDate: string
  id: string
}

export interface PreferenceData {
  instructor:           PreferenceInstructorModel
  category:             PreferenceCategoryModel
  preference:           PreferencesGetDataModel
}

export interface PreferenceDataStore {
  categoryIds:        string[]
  instructorIds:      string[]
}

export interface PreferencesData {
  data: UserPreferencesData
  error: Error
}

export interface UserPreferencesData {
  userInterest?: UserInterest
  studentInterest?: StudentInterest
}

export interface StudentInterest {
  categoryIds: string[]
  instructorIds: string[]
  studentId: string
  id: string
}

export interface UserInterest {
  categoryIds: string[]
  instructorIds: string[]
  studentId: string
  id: string
}

export interface PreferencesGetDataModel {
  data: PreferencesGetData
  error: Error
}

export interface PreferencesGetData {
  categoryIds: any[]
  instructorIds: string[]
  studentId: string
  id: string
}

export type UsersQueryResponse = Response<Array<PreferenceInstructor>>
export type PreferenceCategoryQueryResponse = Response<Array<PreferenceCategory>>
export type PreferenceGetQueryResponse = Response<Array<PreferencesGetData>>
export type PreferenceDataQueryResponse = Response<Array<PreferenceData>>