import { KTSVG } from '../../../../../../_metronic/helpers';
import {useListView} from '../core/ListViewProvider'

const UserEditModalHeader = () => {
  const {setItemIdForUpdate, setItemIdForChange} = useListView()

  return (
    <div className='modal-header pt-4 pb-4'>
      <h2 className='fw-bolder textColor'>Update Instructors</h2>
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => {setItemIdForUpdate(undefined); setItemIdForChange(undefined)}}
        style={{cursor: 'pointer'}}
      >
        <KTSVG path='/img/arr061.svg' className='svg-icon-1' />
      </div>
    </div>
  )
}

export {UserEditModalHeader}
