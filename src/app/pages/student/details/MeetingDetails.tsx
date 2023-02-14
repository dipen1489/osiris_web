import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import { EnrolledWrapper } from './EnrolledWrapper'

const EnrolledMeetingWrapper = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <EnrolledWrapper />
    </>
  )
}

const MeetingDetailsWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <EnrolledMeetingWrapper />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {MeetingDetailsWrapper}
