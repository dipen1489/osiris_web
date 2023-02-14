/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import { KTSVG } from '../../../../../_metronic/helpers'
import { UserLastLoginCell } from './UserLastLoginCell'
import {useState} from 'react';

type Props = {
  user: any
}
const itemClass = 'ms-4'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-20px h-20px w-md-24px h-md-24px'
const btnIconClass = 'svg-icon-3'

const UserInfoCell: FC<Props> = ({user}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
  <div className='d-flex pointer justify-content-between' onClick={() => setIsOpen(!isOpen)}>
    <div className='me-3'>
      <KTSVG path='/img/Calander.svg' className='svg-icon-3 me-2' />
      {user[0].split(' : ')[0]}
    </div>
    <div className='me-3'>
      <KTSVG path='/img/userjoin.svg' className='svg-icon-3 me-1' />
      {user[0].split(' : ')[1].replace(/students/g, "")}
    </div>
    
    <div className={clsx('app-navbar-item', itemClass)}>
      <div
        data-kt-menu-trigger="{default: 'click'}"
        data-kt-menu-attach='parent'
        data-kt-menu-placement='top-end'
        className={btnClass + isOpen ? 'show menu-dropdown' : ''}
      >
        <KTSVG path='/img/dropdown_ic.svg' className={btnIconClass} />
      </div>
      <UserLastLoginCell user={user} customeStyle={ isOpen }/>
    </div>
  </div>
)
}

export {UserInfoCell}
