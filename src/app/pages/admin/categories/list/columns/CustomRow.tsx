// @ts-nocheck
import clsx from 'clsx'
import {FC} from 'react'
import {Row} from 'react-table'
import { UserData } from '../../../request/_models'

type Props = {
  row: Row<UserData>
}

const CustomRow: FC<Props> = ({row}) => (
  <tr {...row.getRowProps()}>
    {row.cells.map((cell) => {
      if(cell.column.id === 'firstName'){
        return (
          <td
            {...cell.getCellProps()}
            className={clsx({'text-end min-w-100px': cell.column.id === 'actions'})}
          >
            {row.original.firstName} {row.original.lastName}
          </td>
        )
      }
      
      return (
        <td
          {...cell.getCellProps()}
          className={clsx({'text-center min-w-50px': cell.column.id === 'actions'})}
        >
          {cell.render('Cell')}
        </td>
      )
    })}
  </tr>
)

export {CustomRow}
