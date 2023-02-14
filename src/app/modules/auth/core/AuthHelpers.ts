import {AuthModel} from './_models'
import { getNewToken } from './_requests'

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'
const FISRST_TIME_LOCAL_STORAGE_KEY = 'FTT'
const AUTH_TOKENS = 'tk'

const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const getAuthUserId = (): string | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth.data.id
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const getAuthUserEmail = (): string | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth) {
      // You can easily check auth_token expiration also
      return auth.data.email
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth)
    localStorage.setItem(AUTH_TOKENS, auth.data.token)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    localStorage.removeItem('profile')
    localStorage.removeItem('profile_dt')
    localStorage.removeItem('updata')
    localStorage.removeItem('kt-auth-react-v1')
    localStorage.removeItem(AUTH_TOKENS)
    localStorage.removeItem(FISRST_TIME_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      const auth = getAuth()
      const authToken = localStorage.getItem(AUTH_TOKENS)
      if (auth && auth.data.token) {
        config.headers.Authorization = `Bearer ${authToken}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )

  axios.interceptors.response.use((response: any) => {
    return response;
  }, 
  async (error: any) => {
      if(error.response !== undefined && error.response.status === 401){
        //localStorage.clear()
        localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
        localStorage.removeItem('profile')
        localStorage.removeItem('profile_dt')
        localStorage.removeItem('updata')
        localStorage.removeItem('kt-auth-react-v1')
        localStorage.removeItem(AUTH_TOKENS)
        localStorage.removeItem(FISRST_TIME_LOCAL_STORAGE_KEY)
        localStorage.removeItem('ttl')
        window.dispatchEvent(new Event("clean"));
        // return window.location.href = '/auth'
      }
      else if(error.response !== undefined && error.response.status === 500)
      {
        if(error.response.data.message !== "Cannot read properties of null (reading 'id')"){
          await getNewToken();
        }
      }
      return Promise.reject(error);
  });

}

export {getAuth, getAuthUserId, getAuthUserEmail, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY, AUTH_TOKENS, FISRST_TIME_LOCAL_STORAGE_KEY}


