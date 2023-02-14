/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {FC, useEffect} from 'react'
import { UserLastLoginCell } from './UserLastLoginCell'
import {useState} from 'react';
import { KTSVG } from '../../../../../../_metronic/helpers';
import { useListView } from '../core/ListViewProvider'

type Props = {
  user: any,
  instructor: any,
  id: any
}

const itemClass = 'ms-4'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-20px h-20px w-md-24px h-md-24px'
const btnIconClass = 'svg-icon-3'

const UserInfoCell: FC<Props> = ({user, instructor, id}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [instructorName, setInstructorName] = useState<any>([])
  const {setItemIdForUpdate, setItemIdForChange} = useListView()
  const openEditModal = () => {
    setItemIdForChange(user.toString())
    setItemIdForUpdate(id)
    localStorage.setItem('instructor', JSON.stringify(instructor))
  }

  const updateinstData = () => {
    console.log("")
    instructorName.splice(0);
    user.forEach((element: any) => {
      console.log("")
      instructor.forEach((item: any) => {
        console.log("")
        if(element === item.value) {
          console.log(". ")
          instructorName.push(item.label)
        }
      })
    })
  }
  // setTimeout(() => {
  // }, 100);
  
  updateinstData()  

  return (
    <div className='d-flex pointer justify-content-between' onClick={openEditModal}>
      <div className='me-4'>
      { 
        instructorName.join(', ')
      }
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
        {/* openEditModal <UserLastLoginCell user={user} instructor={instructor} id={id} customeStyle={ isOpen }/> */}
      </div>
    </div>
  )
}

export {UserInfoCell}