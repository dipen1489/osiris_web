/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {PageTitle} from '../../../../_metronic/layout/core'

const DashboardPage: FC = () => (
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

const ChatWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.CHAT'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {ChatWrapper}