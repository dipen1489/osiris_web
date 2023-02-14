import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import { UsersListHeader } from './components/header/UsersListHeader'
import { UsersTable } from './UsersTable'
import { UserEditModal } from './user-edit-modal/UserEditModal'

const StudentList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <UsersListHeader />
      <UsersTable />
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const StudentListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <StudentList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {StudentListWrapper}
