import { useIntl } from 'react-intl'
import { PageTitle } from '../../../../_metronic/layout/core'
import {useState} from "react";
import { UserPreference } from '../preference/PreferenceList';
import { FISRST_TIME_LOCAL_STORAGE_KEY } from '../../../modules/auth/core/AuthHelpers';
import { ProfileViewWrapper } from '../../component/profile/ProfileViewWrapper';

const SettingsWrapper = () => {
  const intl = useIntl()
  const [isPreference, setIsPreference] = useState<boolean>(false)
  const isfirstTime: string | null = localStorage.getItem(FISRST_TIME_LOCAL_STORAGE_KEY)
    let isfirstTimes: String, setIsFirstTime: (value: (((prevState: String) => String) | String)) => void;
    // @ts-ignore
    [isfirstTimes, setIsFirstTime] = useState<String>(isfirstTime);

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.SETTINGS' })}</PageTitle>
      <div className="d-flex flex-stack flex-wrap flex-lg-nowrap settingBtn mb-10">
        <button type="button" onClick={() => setIsPreference(false)} className={isPreference ? "btn text-grey-color fw-semibold px-15 py-2" : "btn themebtnblue fw-semibold px-15 py-2" }>
          <span className="indicator-label">PROFILE</span>
        </button>
        <button type="button" onClick={() => setIsPreference(true)} className={isPreference ? "btn themebtnblue fw-semibold px-15 py-2" : "btn text-grey-color fw-semibold px-15 py-2" }>
          <span className="indicator-label">PREFERENCE</span>
        </button>
      </div>
      {isPreference ? <UserPreference setIsFirstTime={setIsFirstTime}/> : <ProfileViewWrapper />}
    </>
  )
}
export { SettingsWrapper }
