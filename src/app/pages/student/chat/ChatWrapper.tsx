import { useIntl } from 'react-intl'
import { PageTitle } from '../../../../_metronic/layout/core'
import React from "react";
import { toAbsoluteUrl } from '../../../../_metronic/helpers';

const ChatPage = () => (
  <>
      <div className="card">
          <div className="card-body">
              <div className="card-px text-center pt-15 pb-15">
                  <h2 className="fs-2x fw-bold mb-0">Under Development</h2>
              </div>
              <div className="text-center pb-15 px-5">
                  <img src={toAbsoluteUrl('/img/2.png')} alt=""
                       className="mw-100 h-200px h-sm-325px"/>
              </div>
          </div>
      </div>
  </>
)

const ChatWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.CHAT' })}</PageTitle>
      <ChatPage />
    </>
  )
}
export { ChatWrapper }
