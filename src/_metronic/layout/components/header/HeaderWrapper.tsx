/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {HeaderToolbar} from './HeaderToolbar'
import { useAuth } from '../../../../app/modules/auth'

export function HeaderWrapper() {
  const {config, classes, attributes} = useLayout()
  const {currentUser} = useAuth()

  return (
    <div
      id='kt_header'
      className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
      {...attributes.headerMenu}
    >
      {/* begin::Brand */}
      <div className='header-brand'>
        {/* begin::Logo */}
        <Link to='/'>
          <img
            alt='Logo'
            src={
              (currentUser?.role === 'admin') ? toAbsoluteUrl('/logo/admin_logo.png') :
              (currentUser?.role === 'student') ? toAbsoluteUrl('/logo/student.png') : toAbsoluteUrl('/logo/instructor.png')
            } 
            className='w-200px w-lg-200px'
          />
        </Link>
        {/* end::Logo */}

        {/* begin::Aside toggle */}
        <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-30px h-30px'
            id='kt_aside_mobile_toggle'
          >
            <KTSVG path='/img/abs015.svg' className='svg-icon-1' />
          </div>
        </div>
        {/* end::Aside toggle */}
      </div>
      {/* end::Brand */}
      <HeaderToolbar />
    </div>
  )
}
