/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../../_metronic/layout/core'
import { ProfileViewWrapper } from '../../component/profile/ProfileViewWrapper'

const SettingsWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.PROFILESETTING' })}</PageTitle>
      <ProfileViewWrapper />
    </>
  )
}

export { SettingsWrapper }