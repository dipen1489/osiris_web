/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import { CategoryData } from '../../../request/_models'
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import clsx from 'clsx'

type Props = {
  user: CategoryData
}

const UserInfoCell: FC<Props> = ({user}) => (
  <div className='d-flex align-items-center'>
    <div className='symbol symbol-75px overflow-hidden me-3'>
    {user.image ? (
          <div className='symbol-label'>
            <img src={user.image} alt={user.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              `bg-light-${user.name}`,
              `text-${user.name}`
            )}
          >
            {user.name}
          </div>
        )}
    </div>
  </div>
)

export {UserInfoCell}
