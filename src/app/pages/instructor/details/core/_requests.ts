import axios, {AxiosResponse} from 'axios'
import { MDRUsersQueryResponse, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_MEETING_DETAILS = `${API_URL}/meetings/`
const ENROLL_MEETING = `${API_URL}/meetings/student/enroll`
const DELETE_MEETING = `${API_URL}/meetings/`

const getMeetingDetails = (query: any): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_MEETING_DETAILS}${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const enrollMeeting = (meetingData: any): Promise<MDRUsersQueryResponse> => {
  return axios
    .post(`${ENROLL_MEETING}`, meetingData)
}

const deleteMeeting = (meetingData: any): Promise<MDRUsersQueryResponse> => {
  return axios
    .delete(`${DELETE_MEETING}/${meetingData}`)
}

export {getMeetingDetails, enrollMeeting, deleteMeeting}
