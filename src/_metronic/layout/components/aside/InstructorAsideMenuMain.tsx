/* eslint-disable react/jsx-no-target-blank */
import {useIntl} from 'react-intl'
import {AsideMenuItem} from './AsideMenuItem'

export function InstructorAsideMenuMain() {
  const intl = useIntl()

  return (
    <>
        <AsideMenuItem
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
          <AsideMenuItem
              to='/broadcastmessage'
              icon='/img/broadcast_ic.svg'
              title={intl.formatMessage({id: 'MENU.BROADCAST'})}
          />
        <AsideMenuItem
            to='/settings'
            icon='/img/settings_ic.svg'
            title={intl.formatMessage({id: 'MENU.PROFILESETTING'})}
        />
    </>
  )
}
