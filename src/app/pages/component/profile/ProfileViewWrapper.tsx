import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {KTCard} from '../../../../_metronic/helpers'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { ProfileWrapper } from './ProfileWrapper'
import { UserChangePaswordModal } from '../change-password-modal/UserChangePaswordModal'

const ProfileView = () => {
  const {itemIdForUpdate, itemIdForChange} = useListView()
  return (
    <>
      <ProfileWrapper />
      {itemIdForUpdate !== undefined && <UserEditModal />}
      {itemIdForChange !== undefined && <UserChangePaswordModal />}
    </>
  )
}

const ProfileViewWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ProfileView />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {ProfileViewWrapper}
