import axios, {AxiosResponse} from 'axios'
import {Response} from '../../../../../_metronic/helpers'
import { getAuthUserId } from '../../../../modules/auth/core/AuthHelpers'
import {PreferenceCategoryQueryResponse, PreferenceDataStore, PreferenceGetQueryResponse, UserPreferencesData, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ALL_INTRUCTOR = `${API_URL}/users?role=instructor&isImage=true`
const GET_ALL_CATEGORIES = `${API_URL}/categories?isImage=true`
const SAVE_PREFERENCE_DATA= `${API_URL}/users`
const GET_ALL_PREFERENCE= `${API_URL}/users`

const getAllIntructor = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_INTRUCTOR}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getAllCategory = (query: string): Promise<PreferenceCategoryQueryResponse> => {
  return axios
    .get(`${GET_ALL_CATEGORIES}`)
    .then((d: AxiosResponse<PreferenceCategoryQueryResponse>) => d.data)
}

const getPreference = (query: string): Promise<PreferenceGetQueryResponse> => {
  return axios
    .get(`${GET_ALL_PREFERENCE}/${getAuthUserId()}/favourites`)
    .then((d: AxiosResponse<PreferenceGetQueryResponse>) => d.data)
}

const savePreference = (preferenceData: PreferenceDataStore): Promise<UserPreferencesData | undefined> => {
  return axios
    .post(`${SAVE_PREFERENCE_DATA}/${getAuthUserId()}/favourites`, preferenceData)
    .then((response: AxiosResponse<Response<UserPreferencesData>>) => response.data)
    .then((response: Response<UserPreferencesData>) => response.data)
}

export { getAllIntructor, getAllCategory, savePreference, getPreference }
