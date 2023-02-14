import axios, {AxiosResponse} from 'axios'
import {UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_OCCURRENCE = `${API_URL}/meetings/occurrence/`
const POST_BROADCAST_EMAIL = `${API_URL}/meetings/email`

const getOccurrenceByMeeting = (query: string): Promise<any> => {
  return axios
    .get(`${GET_OCCURRENCE}${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const getBroadcastMail = (query: any): Promise<any> => {
  return axios
    .post(`${POST_BROADCAST_EMAIL}`,query)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}


export { getOccurrenceByMeeting, getBroadcastMail }
