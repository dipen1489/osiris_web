/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import clsx from 'clsx'
import {FC} from 'react'
import {Row} from 'react-table'
import { UserData } from '../../../request/_models'
import { MultiSelect } from "react-multi-select-component";
import { UserInfoCell } from './UserInfoCell'

type Props = {
  row: Row<UserData>
  instructor: any
}

const CustomRow: FC<Props> = ({row, instructor}) =>
  (
  <tr {...row.getRowProps()}>
    {row.cells.map((cell, i) => {
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

      if(cell.column.id === 'instructor'){
        return (
          <td
            {...cell.getCellProps()}
            className={clsx({'text-end min-w-100px': cell.column.id === 'actions'})}
          >
            <UserInfoCell user={row.original.hostIds} instructor={instructor} id={row.original.id} key={`row-${i}-${row.id}`} />
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