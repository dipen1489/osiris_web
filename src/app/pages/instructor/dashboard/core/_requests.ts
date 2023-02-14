import axios, {AxiosResponse} from 'axios'
import {getAuthUserEmail} from '../../../../modules/auth/core/AuthHelpers'
import {UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ALL_MEETINGS = `${API_URL}/meetings/instructor/`

const getAllMeetingList = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_MEETINGS}${getAuthUserEmail()}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
}


export { getAllMeetingList }
