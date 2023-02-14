
import { InstructorForm } from './InstructorForm'
import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'

const InstructorFormData = () => {
  const {itemIdForUpdate} = useListView()
  return (<InstructorForm />)
}

const InstructorFormWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <InstructorFormData />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {InstructorFormWrapper}
