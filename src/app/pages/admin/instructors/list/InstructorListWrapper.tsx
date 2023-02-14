import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import { UsersListHeader } from './components/header/UsersListHeader'
import { UsersTable } from './UsersTable'

const InstructorList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <UsersListHeader />
      <UsersTable />
    </>
  )
}

const InstructorListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <InstructorList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {InstructorListWrapper}
