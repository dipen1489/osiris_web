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
    Header: (props) => <UserCustomHeader tableProps={props} title='Area of Expertise' className='min-w-125px' />,
    accessor: 'expertise'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='No of user assigned to Instructor' className='min-w-125px' />,
    accessor: 'NoOfStudentAssigned',
    id: 'NoOfStudentAssigned',
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
