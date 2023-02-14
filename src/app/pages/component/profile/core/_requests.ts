import axios, {AxiosResponse} from 'axios'
import {getAuthUserEmail} from '../../../../modules/auth/core/AuthHelpers'
import {UsersQueryResponse} from './_models'
import { ForgotPasswordModel, ProfileUserModel, UserChangePasswordModel, UserModel } from '../../../../modules/auth'
import {Response} from '../../../../../_metronic/helpers'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ALL_MEETINGS = `${API_URL}/meetings/instructor/`
const UPDATE_USER_PROFILE = `${API_URL}/users/`
export const REQUEST_RESETPASSWORD_URL = `${API_URL}/users/reset_password?uid=`

const getAllMeetingList = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_MEETINGS}${getAuthUserEmail()}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
}

const updateUser = (uid: any, user: ProfileUserModel): Promise<ProfileUserModel | undefined> => {
  return axios
    .put(`${UPDATE_USER_PROFILE}${uid}`, user)
    .then((response: AxiosResponse<ProfileUserModel>) => response.data)
}

const changePassword = (uid: any, user: UserChangePasswordModel): Promise<ForgotPasswordModel> => {
  return axios
    .post(`${REQUEST_RESETPASSWORD_URL}${uid}`, user)
    .then((response: AxiosResponse<ForgotPasswordModel>) => response.data)
}

export { getAllMeetingList, updateUser, changePassword }
