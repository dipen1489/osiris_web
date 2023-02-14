/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {ID, KTSVG} from '../../../../../../_metronic/helpers'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { deleteCategory } from '../../../request/_requests'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useListView } from '../core/ListViewProvider'

type Props = {
  id: ID
}

const UserActionsCell: FC<Props> = ({id}) => {
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  const {setIsUpdated} = useListView()

  const deleteItem = useMutation(() => deleteCategory(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      setIsUpdated(true)
      toast.success('Category deleted successfully...')
      queryClient.invalidateQueries(['getallCategories'])
    },
  })

  return (
    <>
      <Link
        className='menu-link px-3'
        to={'edit_category/'+id}
      >
         <KTSVG path='/img/edit_ic.svg' className='svg-icon-2' />
      </Link>
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
