/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import { ResetPassword } from './components/ResetPassword'

const AuthLayout = () => {
  useEffect(() => {
    document.body.style.backgroundImage = 'none'
    return () => {}
  }, [])

  return (
    <div
      className='theme-white bg-body d-flex flex-column flex-lg-row flex-column-fluid'
    >
      <div className='d-flex flex-lg-row-fluid'>
        <div className="d-flex flex-column flex-center w-100" style={{background: '#e0f4f4'}}>
          <img
              alt='Logo'
              src={toAbsoluteUrl('/img/bg.svg')}
              className='theme-white mx-100 mw-75'
            />
        </div>
        <div className='bg-body d-flex flex-column flex-center pb-0 pb-lg-10 p-10 w-100'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='reset_password' element={<ResetPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
