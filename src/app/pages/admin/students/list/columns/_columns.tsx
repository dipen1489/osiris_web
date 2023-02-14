// @ts-nocheck
import {Column} from 'react-table'
import {UserActionsCell} from './UserActionsCell'
import {UserCustomHeader} from './UserCustomHeader'
import { UserData } from '../../../request/_models'

const usersColumns: ReadonlyArray<Column<UserData>> = [
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    accessor: 'firstName'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Email' className='min-w-125px' />,
    accessor: 'email'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Instructor' className='min-w-125px' />,
    accessor: 'instructor',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-50px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
