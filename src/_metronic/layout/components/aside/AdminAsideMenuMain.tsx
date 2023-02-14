/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItem} from './AsideMenuItem'

export function AdminAsideMenuMain() {
  const intl = useIntl()
  return (
    <>
        <AsideMenuItem
            to='/sessions'
            icon='/menu/Sessions.svg'
            title={intl.formatMessage({id: 'MENU.SESSIONS'})}
        />
        <AsideMenuItem
          to='/create_instructor'
          icon='/menu/Instructor_Registration.svg'
          title={intl.formatMessage({id: 'MENU.INSTRUCTORREGISTER'})}
        />
        <AsideMenuItem
            to='/instructors'
            icon='/menu/Instructors.svg'
            title={intl.formatMessage({id: 'MENU.INSTRUCTORS'})}
        />
        <AsideMenuItem
            to='/create_category'
            icon='/menu/Category_Creation.svg'
            title={intl.formatMessage({id: 'MENU.CATEGORYCREATION'})}
        />
        <AsideMenuItem
            to='/categories'
            icon='/menu/Categories.svg'
            title={intl.formatMessage({id: 'MENU.CATEGORY'})}
        />
        <AsideMenuItem
            to='/students'
            icon='/menu/Students.svg'
            title={intl.formatMessage({id: 'MENU.STUDENTS'})}
        />
        <AsideMenuItem
            to='/broadcastemail'
            icon='/menu/Broadcast_Email.svg'
            title={intl.formatMessage({id: 'MENU.BROADCASTEMAIL'})}
        />
    </>
  )
}
