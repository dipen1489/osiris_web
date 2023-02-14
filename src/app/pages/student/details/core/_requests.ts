import axios, {AxiosResponse} from 'axios'
import { MDRUsersQueryResponse, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_MEETING_DETAILS = `${API_URL}/meetings/`
const ENROLL_MEETING = `${API_URL}/meetings/student/enroll`

const getMeetingDetails = (query: any): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_MEETING_DETAILS}${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const enrollMeeting = (meetingData: any): Promise<MDRUsersQueryResponse> => {
  return axios
    .post(`${ENROLL_MEETING}`, meetingData)
}

const enrollMeetingCancel = (meetingData: any): Promise<MDRUsersQueryResponse> => {
  return axios
    .delete(`${ENROLL_MEETING}`,{ data: meetingData})
}

export {getMeetingDetails, enrollMeeting, enrollMeetingCancel}
