import { KTCard } from "../../../../_metronic/helpers/components/KTCard"
import { useListView, ListViewProvider } from "./core/ListViewProvider"
import { QueryRequestProvider } from "./core/QueryRequestProvider"
import { QueryResponseProvider } from "./core/QueryResponseProvider"
import { MeetingWrapper } from "./MeetingWrapper"

type Props = {
}

const MeetingListWrapper = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <MeetingWrapper />
    </>
  )
}

const SessionWrapper: React.FC<Props> = () => {

  return (
    <>
      <QueryRequestProvider>
        <QueryResponseProvider>
          <ListViewProvider>
            <MeetingListWrapper/>
          </ListViewProvider>
        </QueryResponseProvider>
      </QueryRequestProvider>
    </>
  )
}

export { SessionWrapper }