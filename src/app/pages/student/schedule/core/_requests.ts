import axios, {AxiosResponse} from 'axios'
import { getAuthUserId } from '../../../../modules/auth/core/AuthHelpers'
import { UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ENROLLED_MEETINGS = `${API_URL}/meetings/student/enroll/`

const getEnrolledMeetingList = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ENROLLED_MEETINGS}${getAuthUserId()}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

export {getEnrolledMeetingList}
