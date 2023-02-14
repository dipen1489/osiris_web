import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {KTCard} from '../../../../_metronic/helpers'
import { DashboardWrapper } from './DashboardWrapper'

const DashboardList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <DashboardWrapper />
    </>
  )
}

const InstructorDashboardWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <DashboardList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {InstructorDashboardWrapper}
