
import { CategoryForm } from './CategoryForm'
import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'

const CategoryFormData = () => {
  const {itemIdForUpdate} = useListView()
  return (<CategoryForm />)
}

const CategoryFormWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <CategoryFormData />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {CategoryFormWrapper}
