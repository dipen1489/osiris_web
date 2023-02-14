
import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import { ScheduleList } from './ScheduleList';

const SchedulePage = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <ScheduleList />
    </>
  )
}
  
const ScheduleWrapper = () => {
  return (
    <>
      <QueryRequestProvider>
        <QueryResponseProvider>
          <ListViewProvider>
            <SchedulePage />
          </ListViewProvider>
        </QueryResponseProvider>
      </QueryRequestProvider>
    </>
  )
}

export { ScheduleWrapper }