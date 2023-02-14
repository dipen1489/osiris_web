import { useAuth } from '../../../../app/modules/auth/core/Auth'
import { AdminAsideMenuMain } from './AdminAsideMenuMain'
import { StudentAsideMenuMain } from './StudentAsideMenuMain'
import { InstructorAsideMenuMain } from './InstructorAsideMenuMain'
import { AsideMenuItem } from './AsideMenuItem'

export function AsideMenuMain() {
  const {currentUser} = useAuth()

  if(currentUser?.role === 'admin'){
    return <AdminAsideMenuMain />
  }
  else if(currentUser?.role === 'student'){
    return <StudentAsideMenuMain />
  }
  else if(currentUser?.role === 'instructor'){
    return <InstructorAsideMenuMain />
  }

  return (
    <>
        {/* <AsideMenuItem
          to='/dashboard'
          icon='/img/summary_ic.svg'
          title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        />
        <AsideMenuItem
            to='/schedule'
            icon='/img/schedule_ic.svg'
            title={intl.formatMessage({id: 'MENU.SCHEDULE'})}
        />
        {/* <AsideMenuItem
            to='/chat'
            icon='/img/chat_ic.svg'
            title={intl.formatMessage({id: 'MENU.CHAT'})}
        /> */}
        {/* {
          currentUser && currentUser.role === 'instructor' && 
          <AsideMenuItem
              to='/broadcastmessage'
              icon='/img/broadcast_ic.svg'
              title={intl.formatMessage({id: 'MENU.BROADCAST'})}
          />
        }
        <AsideMenuItem
            to='/settings'
            icon='/img/settings_ic.svg'
            title={intl.formatMessage({id: 'MENU.SETTINGS'})}
        /> */}
    </>
  )
}
