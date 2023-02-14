import axios, {AxiosResponse} from 'axios'
import {UsersQueryResponse} from './_models'
import {Response} from '../../../../../_metronic/helpers'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ALL_CATEGORIES = `${API_URL}/categories?isImage=false`
const CREATE_SESSION = `${API_URL}/meetings`

const getAllCategory = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_CATEGORIES}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const createSession = (session: any): Promise<UsersQueryResponse | undefined> => {
  return axios
    .post(`${CREATE_SESSION}`, session)
    .then((response: AxiosResponse<Response<UsersQueryResponse>>) => response.data)
    .then((response: Response<UsersQueryResponse>) => response.data)
}

const updateSession = (session: any, meetingId: string): Promise<UsersQueryResponse | undefined> => {
  return axios
    .patch(`${CREATE_SESSION}/${meetingId}`, session)
    .then((response: AxiosResponse<Response<UsersQueryResponse>>) => response.data)
    .then((response: Response<UsersQueryResponse>) => response.data)
}

export { getAllCategory, createSession, updateSession }
