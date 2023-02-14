/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState } from 'react'
import { ID, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useListView } from './core/ListViewProvider'
import { useAuth } from '../../../modules/auth'
import { format } from 'date-fns'
type Props = {
  id?: ID
}

const ProfileWrapper: FC<Props> = ({id}) => {
  const { currentUser } = useAuth()
  const [value,setValue] = useState<any>();
  const {setItemIdForUpdate} = useListView()
  const openEditModal = () => {
    setItemIdForUpdate(currentUser?.id)
  }
  const {setItemIdForChange} = useListView()
  const openChangePasswordModal = () => {
    setItemIdForChange(currentUser?.id)
  }

  const blankImg = currentUser?.profilePic ? currentUser.profilePic : localStorage.getItem('profile') != null ? localStorage.getItem('profile')! : toAbsoluteUrl('/img/blank.svg')

  return (
  <div className='card mb-5 mb-xl-10' style={{background: '#f6f8fa'}}>
    <div className='card-body pt-9 pb-0'>
      <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
        <div className='me-7 mb-4'>
          <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative border border-2 border-gray-900 border-blue-theme p-2 border-radius-20 rounded-9 image-input-outline'>
            <img className='border-radius-20' src={blankImg} alt='Metornic' />
          </div>
        </div>

        <div className='flex-grow-1'>
          <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
            <div className='d-flex flex-column'>
              <div className='d-flex align-items-center mb-2'>
                <a href='#' className='text-hover-primary textColor fs-2 fw-bolder me-1'>
                  {currentUser?.firstname} {currentUser?.lastName}
                </a>
              </div>

              <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                <span
                  className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                >
                {currentUser?.role === "student" ? 'Student' : 'Instructor'}
                </span>
                {currentUser?.role === "student" ? (<></>) : (<span
                  className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                >
                {currentUser?.expertise}
                </span>)}
              </div>
            </div>
          </div>

          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex flex-column flex-grow-1 pe-8'>
              <div className='d-flex flex-wrap'>
                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='fw-bold fs-6 text-gray-400'>Email ID</div>
                  <div className='d-flex align-items-center'>
                    <div className='fs-4 textColor semibold'>{currentUser?.email}</div>
                  </div>
                </div>

                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='fw-bold fs-6 text-gray-400'>Date Of Birth</div>
                  <div className='d-flex align-items-center'>
                    <div className='fs-2 textColor semibold'>{currentUser?.dob?.toString() !== "" ? format(new Date(currentUser?.dob!), 'y-MM-dd') : "NA"}</div>
                  </div>  
                </div>

                <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                  <div className='fw-bold fs-6 text-gray-400'>Mobile Number</div>
                  <div className='d-flex align-items-center'>
                    <div className='fs-2 textColor semibold'>{currentUser?.mobileNumber}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex align-items-start w-300px w-sm-400px flex-column mt-3'>
            <div className='d-flex justify-content-between w-200 mt-auto mb-2'>
              <button
                type='button'
                className='btn themebtnblue fw-bolder px-15 py-2'
                onClick={openEditModal}
              >
                <span className='indicator-label'>EDIT</span>
              </button>
              <button
                type='button'
                className='btn themebtnblue ms-5 fw-bolder px-15 py-2'
                onClick={openChangePasswordModal}
              >
                <span className='indicator-label'>CHANGE PASSWORD</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export { ProfileWrapper }