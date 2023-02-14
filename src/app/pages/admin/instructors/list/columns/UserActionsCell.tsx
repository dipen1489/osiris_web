/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {ID, KTSVG} from '../../../../../../_metronic/helpers'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { deleteUser } from '../../../request/_requests'
import toast from 'react-hot-toast'
import { useListView } from '../core/ListViewProvider'

type Props = {
  id: ID
}

const UserActionsCell: FC<Props> = ({id}) => {
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  const {setIsUpdated} = useListView()

  const deleteItem = useMutation(() => deleteUser(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      setIsUpdated(true)
      toast.success('User deleted successfully...')
      queryClient.invalidateQueries(['getallMeetingByInstructor'])
    },
  })

  return (
    <>
      <a
        className='menu-link px-3'
        data-kt-users-table-filter='delete_row'
        onClick={async () => await deleteItem.mutateAsync()}
      >
         <KTSVG path='/img/delete_ic.svg' className='svg-icon-2' />
      </a>
    </>
  )
}

export {UserActionsCell}
