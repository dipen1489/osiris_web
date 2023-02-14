
import {useIntl} from 'react-intl'
import {AsideMenuItem} from './AsideMenuItem'
import { FISRST_TIME_LOCAL_STORAGE_KEY } from '../../../../app/modules/auth'
import { useState } from 'react'

export function StudentAsideMenuMain() {
  const intl = useIntl()
  const isfirstTime: string | null = localStorage.getItem(FISRST_TIME_LOCAL_STORAGE_KEY)
  const [state, setState] = useState(isfirstTime)

  window.addEventListener('preferenceupdate', () => {
    setState(localStorage.getItem(FISRST_TIME_LOCAL_STORAGE_KEY))
  })

  return (
    <>
      {state === 'false' && (
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
              to='/settings'
              icon='/img/settings_ic.svg'
              title={intl.formatMessage({id: 'MENU.SETTINGS'})}
          />
        </>
      )
      }
    </>
  )
}
