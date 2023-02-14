import axios, {AxiosResponse} from 'axios'
import { getAuthUserEmail } from '../../../../modules/auth/core/AuthHelpers'
import { UsersScheduleQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ENROLLED_MEETINGS = `${API_URL}/meetings/instructor/`

const getEnrolledMeetingList = (query: string): Promise<UsersScheduleQueryResponse> => {
  return axios
    .get(`${GET_ENROLLED_MEETINGS}${getAuthUserEmail()}?${query}`)
    .then((d: AxiosResponse<UsersScheduleQueryResponse>) => d.data)
}

export {getEnrolledMeetingList}
