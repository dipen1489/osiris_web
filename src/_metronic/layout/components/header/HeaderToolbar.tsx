/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import {useLayout} from '../../core'
import {DefaultTitle} from './page-title/DefaultTitle'
import {Topbar} from "./Topbar";

const HeaderToolbar = () => {
  const {classes} = useLayout()
  const [status, setStatus] = useState<string>('1')

  return (
    <div className='toolbar d-flex align-items-stretch'>
      {/* begin::Toolbar container */}
      <div
        className={`${classes.headerContainer.join(
          ' '
        )} py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between`}
      >
        <DefaultTitle />
        <Topbar />
      </div>
    </div>
  )
}

export {HeaderToolbar}
