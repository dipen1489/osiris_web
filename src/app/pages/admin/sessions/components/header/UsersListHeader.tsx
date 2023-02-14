import {useListView} from '../../core/ListViewProvider'
import {UsersListSearchComponent} from './UsersListSearchComponent'

const UsersListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <UsersListSearchComponent />
      
      {/* <div className='card-toolbar'>
        {selected.length > 0 ? <UsersListGrouping /> : <UsersListToolbar />}
      </div> */}
    </div>
  )
}

export {UsersListHeader}
