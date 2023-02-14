// import {useQuery} from 'react-query'
import {UserEditModalForm} from './UserEditModalForm'
// import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import { useAuth } from '../../../../modules/auth'
// import {getUserById} from '../core/_requests'

const UserEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const error = false
  const isLoading = false
  const { currentUser } = useAuth()
  // const user = currentUser
  // const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  // const {
  //   isLoading,
  //   data: user,
  //   error,
  // } = useQuery(
  //   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
  //   () => {
  //     return getUserById(itemIdForUpdate)
  //   },
  //   {
  //     cacheTime: 0,
  //     enabled: enabledQuery,
  //     onError: (err) => {
  //       setItemIdForUpdate(undefined)
  //       console.error(err)
  //     },
  //   }
  // )

  // if (!itemIdForUpdate) {
  //   return <UserEditModalForm isUserLoading={isLoading} user={{id: undefined}} />
  // }

  if (!isLoading && !error && currentUser) {
    return <UserEditModalForm isUserLoading={isLoading} user={currentUser} />
  }

  return null
}

export {UserEditModalFormWrapper}
