// @ts-nocheck
import {Column} from 'react-table'
import {UserCustomHeader} from './UserCustomHeader'
import { MeetingDataType } from '../../request/_models'
import { UserInfoCell } from './UserInfoCell'

const usersColumns: ReadonlyArray<Column<MeetingDataType>> = [
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-100px' />,
    accessor: 'name'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Instructor' className='min-w-125px' />,
    accessor: 'instructor'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Session Date Time' className='w-325px' />,
    accessor: 'recurrence',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index].recurrence} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Unique enrolled student' className='w-175px' />,
    accessor: 'uniqueUsers'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Session price' className='w-125px' />,
    accessor: 'price'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Total price' className='w-100px' />,
    accessor: 'total'
  },
]

export {usersColumns}
