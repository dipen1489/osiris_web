
import { KTSVG } from '../../../../_metronic/helpers'
import { useListView } from '../profile/core/ListViewProvider'

const UserChangePaswordModalHeader = () => {
  const {setItemIdForChange} = useListView()

  return (
    <div className='modal-header pt-4 pb-4 '>
      <h2 className='fw-bolder textColor'>Change Password</h2>
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => setItemIdForChange(undefined)}
        style={{cursor: 'pointer'}}
      >
        <KTSVG path='/img/arr061.svg' className='svg-icon-1' />
      </div>
    </div>
  )
}

export {UserChangePaswordModalHeader}
