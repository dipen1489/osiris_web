// @ts-nocheck
import {Column} from 'react-table'
import {UserActionsCell} from './UserActionsCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserInfoCell} from './UserInfoCell'
import { CategoryData } from '../../../request/_models'

const usersColumns: ReadonlyArray<Column<CategoryData>> = [
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Thumbnail' className='min-w-100px' />,
    accessor: 'image',
    Cell: ({...props}) => <UserInfoCell id={props.data[props.row.index].id} user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    accessor: 'name'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Description' className='min-w-125px' />,
    accessor: 'description'
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title="No of User's Favorite" className='min-w-150px' />,
    accessor: 'NoOfStudentFavourite',
    id: 'NoOfStudentFavourite',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-center min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}


//9909467937 Govindbhai