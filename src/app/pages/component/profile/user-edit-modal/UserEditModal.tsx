import {useEffect} from 'react'
import {UserEditModalHeader} from './UserEditModalHeader'
import {UserEditModalFormWrapper} from './UserEditModalFormWrapper'

const UserEditModal = () => {
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  return (
    <>
      <div
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        <div className='modal-dialog modal-dialog-centered mw-750px'>
          <div className='modal-content'>
            <UserEditModalHeader />
            <div className='modal-body scroll-y mx-4 mx-xl-4 my-2'>
              <UserEditModalFormWrapper />
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  )
}

export {UserEditModal}
