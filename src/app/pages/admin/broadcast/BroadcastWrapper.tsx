import { useListView, ListViewProvider } from "./core/ListViewProvider"
import { QueryRequestProvider } from "./core/QueryRequestProvider"
import { QueryResponseProvider } from "./core/QueryResponseProvider"
import { BroadcastMessage } from "./BroadcastMessage"

type Props = {
}

const BroadcastMessageWrapper = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
        <BroadcastMessage />
    </>
  )
}

const BroadcastWrapper: React.FC<Props> = () => {

  return (
    <>
      <QueryRequestProvider>
        <QueryResponseProvider>
          <ListViewProvider>
            <BroadcastMessageWrapper/>
          </ListViewProvider>
        </QueryResponseProvider>
      </QueryRequestProvider>
    </>
  )
}
export { BroadcastWrapper }