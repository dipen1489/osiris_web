/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {ID, KTSVG, QUERIES} from '../../../../../_metronic/helpers'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { deleteUser } from '../../request/_requests'

type Props = {
  id: ID
}

const UserActionsCell: FC<Props> = ({id}) => {
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()

  const deleteItem = useMutation(() => deleteUser(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
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
