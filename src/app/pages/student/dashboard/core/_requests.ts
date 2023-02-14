import axios, {AxiosResponse} from 'axios'
import {Response} from '../../../../../_metronic/helpers'
import { AuthModel } from '../../../../modules/auth'
import {getAuthUserId} from '../../../../modules/auth/core/AuthHelpers'
import {EnrollMeetingModel, EnrollMeetingRQModel, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ENROLLED_MEETINGS = `${API_URL}/meetings/student/enroll/`
const GET_INTERESTED_MEETINGS = `${API_URL}/meetings/interest/`
const GET_ALL_MEETINGS = `${API_URL}/meetings/all/`
const ENROLL_MEETING = `${API_URL}/meetings/student/enroll`
const PROFILE_IMAGE_UPLOAD = `${API_URL}/users/`
const GET_ALLMEETINGS = `${API_URL}/meetings/all/`

const getEnrolledMeetingList = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ENROLLED_MEETINGS}${getAuthUserId()}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getInterestedMeetingList = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_INTERESTED_MEETINGS}${getAuthUserId()}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getAllMeetingList = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_MEETINGS}${getAuthUserId()}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getAllMeetings = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ALLMEETINGS}${getAuthUserId()}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const enrollMeeting = (enrollmeeting: EnrollMeetingRQModel): Promise<EnrollMeetingModel | undefined> => {
  return axios
    .post(`${ENROLL_MEETING}`, enrollmeeting)
    .then((response: AxiosResponse<Response<EnrollMeetingModel>>) => response.data)
    .then((response: Response<EnrollMeetingModel>) => response.data)
}

const ProfilePicUpload = (profilePic: any) => {
  return axios
    .post<AuthModel>(`${PROFILE_IMAGE_UPLOAD}${getAuthUserId()}/uploadImage`, profilePic)
}

export {getEnrolledMeetingList, getInterestedMeetingList, getAllMeetingList, ProfilePicUpload, getAllMeetings}
