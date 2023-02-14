import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {StudentRoutes} from './StudentRoutes'
import { AdminRoutes } from './AdminRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import '../modules/common.css'
const {PUBLIC_URL} = process.env

const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {currentUser && currentUser.role === 'student' ? (
            <>
              <Route path='/*' element={<StudentRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : currentUser && currentUser.role === 'instructor' ? (
              <>
                  <Route path='/*' element={<PrivateRoutes />} />
                  <Route index element={<Navigate to='/dashboard' />} />
              </>
          ) : currentUser && currentUser.role === 'admin' ? (
            <>
                <Route path='/*' element={<AdminRoutes />} />
                <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
              <>
                  <Route path='auth/*' element={<AuthPage />} />
                  <Route path='*' element={<Navigate to='/auth' />} />
              </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
