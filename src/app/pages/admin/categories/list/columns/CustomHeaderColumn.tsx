import {FC} from 'react'
import {ColumnInstance} from 'react-table'
import { UserData } from '../../../request/_models';

type Props = {
  column: ColumnInstance<UserData>
}

// const generateSortingIndicator = column => {
//   return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
// }

const CustomHeaderColumn: FC<Props> = ({column}) => (
  <>
    {column.Header && typeof column.Header === 'string' ? (
      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
    ) : (
      column.render('Header')
    )}
  </>
)

export {CustomHeaderColumn}
