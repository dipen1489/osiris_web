// @ts-nocheck
import clsx from 'clsx'
import {FC} from 'react'
import {Row} from 'react-table'
import { MeetingDataType } from '../../request/_models'
import { MultiSelect } from "react-multi-select-component";

type Props = {
  row: Row<MeetingDataType>
}

const CustomRow: FC<Props> = ({row}) => (
  <tr {...row.getRowProps()}>
    {row.cells.map((cell) => {
      if(cell.column.id === 'price'){
        return (
          <td
            {...cell.getCellProps()}
            className={clsx({'text-end min-w-100px': cell.column.id === 'actions'})}
          >
            ${row.original.price}
          </td>
        )
      }

      if(cell.column.id === 'total'){
        return (
          <td
            {...cell.getCellProps()}
            className={clsx({'text-end min-w-100px': cell.column.id === 'actions'})}
          >
            ${row.original.total}
          </td>
        )
      }

      // if(cell.column.id === 'instructor'){
      //   return (
      //     <td
      //       {...cell.getCellProps()}
      //       className={clsx({'text-end min-w-100px': cell.column.id === 'actions'})}
      //     >
      //       <MultiSelect
      //           className='form-control form-control-sm'
      //           options={instructor}
      //           value={[]}
      //           onChange={(e: any) => {
      //               // setRecipientsDataValue(e)
      //               // formik.setFieldValue('recipients', e, e.length > 0 ? true : false)
      //           }}
      //           labelledBy="Select Instructor"
      //       />
      //     </td>
      //   )
      // }
      
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
