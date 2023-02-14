import axios from 'axios'
import {AuthModel, UserModel} from './_models'
import { AUTH_TOKENS, getAuthUserEmail } from './AuthHelpers'

const API_URL = process.env.REACT_APP_BASE_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/users/authenticate`
export const REGISTER_URL = `${API_URL}/users/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/users/forgot_password`
export const REQUEST_RESETPASSWORD_URL = `${API_URL}/users/reset_password?uid=`
export const REQUEST_REFRESH_TOKEN = `${API_URL}/users/refresh`
export const SITEBASEURL = window.location.protocol + '//' + window.location.host

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  })
}

// Server should return AuthModel
// , dob: string
export function register(firstname: string, lastname: string, email: string, password: string, role: string, phoneno: string) {
  return axios.post(REGISTER_URL, {
    firstName: firstname,
    lastName: lastname,
    email: email,
    password: password,
    role: role,
    mobileNumber: phoneno,
  })
}
// dob: dob,


export function requestPassword(email: string) {
  return axios.post(REQUEST_PASSWORD_URL, {
    email,
    url: `${SITEBASEURL}/auth/reset_password`
  })
}

export function resetPassword(uid: string, newPassword: string, confirmPassword: string) {
  return axios.post(REQUEST_RESETPASSWORD_URL+uid, {
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}

export function getNewToken() {
  return axios.post<any>(REQUEST_REFRESH_TOKEN, {
    email: getAuthUserEmail(),
  }).then((response: { status: number; data: any; }) => {
    if(response.status === 200){
      localStorage.setItem(AUTH_TOKENS, response.data.accessToken)
    }
  });
}

