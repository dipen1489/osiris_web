import { Dispatch, SetStateAction } from "react"
import { useListView, ListViewProvider } from "./core/ListViewProvider"
import { QueryRequestProvider } from "./core/QueryRequestProvider"
import { QueryResponseProvider } from "./core/QueryResponseProvider"
import { Preference } from "./Preference"

type Props = {
  setIsFirstTime: Dispatch<SetStateAction<any>>;
}
const UserPreference: React.FC<Props> = ({setIsFirstTime}) => {
  const { itemIdForUpdate } = useListView()

  return (
    <>
      <QueryRequestProvider>
        <QueryResponseProvider>
          <ListViewProvider>
            <Preference setIsFirstTime={setIsFirstTime}/>
          </ListViewProvider>
        </QueryResponseProvider>
      </QueryRequestProvider>
    </>
  )
}

export { UserPreference }