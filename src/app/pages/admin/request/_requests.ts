import axios, {AxiosResponse} from 'axios'
import {BroadcastUserTypeUsersQueryResponse, CategoryDataQueryResponse, MeetingDataUsersQueryResponse, UsersDataQueryResponse} from './_models'
import { CategoryQueryResponse, IInstructor, InstructorQueryResponse, UsersQueryResponse } from '../instructors/form/core/_models'
import { ID } from '../../../../_metronic/helpers'
import { ICategory } from '../categories/form/core/_models'

const API_URL = process.env.REACT_APP_BASE_URL

const GET_ALL_USERS_STUDENT_INTRUCTOR = `${API_URL}/users`
const POST_BROADCAST_EMAIL = `${API_URL}/meetings/email`
const GET_ALL_CATEGORIES = `${API_URL}/categories?isImage=false`
const CREATE_INSTRUCTOR = `${API_URL}/users/register`
const GET_ALL_MEETINGS_ADMIN = `${API_URL}/meetings/admin/all`
const GET_ALL_CATEGORIES_W_IMAGE = `${API_URL}/categories?isImage=true`
const POST_CREATE_CATEGORY = `${API_URL}/categories`
const PUT_UPDATE_STUDENT_INSTRUCTOR = `${API_URL}/users`

const getAllUsersStudentIntructor= (query: string): Promise<BroadcastUserTypeUsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_USERS_STUDENT_INTRUCTOR}?${query}`)
    .then((d: AxiosResponse<BroadcastUserTypeUsersQueryResponse>) => d.data)
}

const postBroadcastMail = (query: any): Promise<any> => {
  return axios
    .post(`${POST_BROADCAST_EMAIL}`,query)
    .then((d: AxiosResponse<any>) => d.data)
}

const getAllCategory = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_CATEGORIES}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data)
}

const createInstructor = (instructor: IInstructor): Promise<InstructorQueryResponse> => {
  return axios
    .post(`${CREATE_INSTRUCTOR}`, instructor)
    .then((response: AxiosResponse<InstructorQueryResponse>) => response.data)
    // .then((response: Response<InstructorQueryResponse>) => response.data)
}

const createCategory = (category: ICategory): Promise<CategoryQueryResponse> => {
  return axios
    .post(`${POST_CREATE_CATEGORY}`, category)
    .then((response: AxiosResponse<CategoryQueryResponse>) => response.data)
    // .then((response: Response<InstructorQueryResponse>) => response.data)
}

const updateCategory = (category: ICategory, id: string): Promise<CategoryQueryResponse> => {
  return axios
    .put(`${POST_CREATE_CATEGORY}/${id}`, category)
    .then((response: AxiosResponse<CategoryQueryResponse>) => response.data)
    // .then((response: Response<InstructorQueryResponse>) => response.data)
}

const updateStudentInstructor = (hostid: any, id: any): Promise<void> => {
  return axios
    .put(`${PUT_UPDATE_STUDENT_INSTRUCTOR}/${id}`, hostid)
    .then((response: AxiosResponse<any>) => response.data)
}

const deleteCategory = (categoryId: ID): Promise<void> => {
  return axios.delete(`${POST_CREATE_CATEGORY}/${categoryId}`).then((d: AxiosResponse<any>) => d.data)
}

const getUsers = (query: string): Promise<UsersDataQueryResponse> => {
  return axios
    .get(`${GET_ALL_USERS_STUDENT_INTRUCTOR}?${query}`)
    .then((d: AxiosResponse<UsersDataQueryResponse>) => d.data)
}

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${GET_ALL_USERS_STUDENT_INTRUCTOR}/${userId}`).then((d: AxiosResponse<any>) => d.data)
}

const getAllMeetingAdmin = (query: string): Promise<MeetingDataUsersQueryResponse> => {
  return axios
    .get(`${GET_ALL_MEETINGS_ADMIN}?${query}`)
    .then((d: AxiosResponse<MeetingDataUsersQueryResponse>) => d.data)
}

const getAllMCategoryAdmin = (query: string): Promise<CategoryDataQueryResponse> => {
  return axios
    .get(`${GET_ALL_CATEGORIES_W_IMAGE}?${query}`)
    .then((d: AxiosResponse<CategoryDataQueryResponse>) => d.data)
}

export { getAllUsersStudentIntructor, postBroadcastMail, getAllCategory, createInstructor, getUsers, deleteUser, getAllMeetingAdmin, getAllMCategoryAdmin, createCategory, updateCategory, deleteCategory, updateStudentInstructor }
