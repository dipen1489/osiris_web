/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useState} from 'react'
import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {
  HeaderUserMenu,
  Search,
} from '../../../partials'
import { useAuth } from '../../../../app/modules/auth'
import { imgTobase64String, uint8array } from '../../../../app/modules/helper'
import { useLocation } from 'react-router-dom'

const toolbarButtonMarginClass = 'ms-1 ms-lg-10',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px'

const Topbar: FC = () => {
  const [profileFile, setSelectedProfileFile] = useState({
      image: false,
      imageName: '',
      imgData: {}
  });

  const location = useLocation()
  const [imgUrl, setImgUrl] = useState<any>(toAbsoluteUrl('/img/blank.svg'));
  const {currentUser} = useAuth()
  useEffect(() => {
    if(localStorage.getItem('profile') !== undefined && localStorage.getItem('profile') !== null) {
      const profile = localStorage.getItem('profile')
      setImgUrl(profile)
    }
    else if(currentUser?.profilePic){
      setImgUrl(currentUser?.profilePic)
      localStorage.setItem('profile', currentUser?.profilePic)
      if(currentUser?.profilePic_delete_token)
        localStorage.setItem('profile_dt', currentUser?.profilePic_delete_token)
    }
  }, [currentUser?.profilePic, profileFile]);

  const [total, setTotal] = useState<any>(0)

  window.addEventListener('storageupdate', () => {
    setTotal(localStorage.getItem('ttl') != null ? localStorage.getItem('ttl') : 0)
  })
  
  // const arrayBuffer = currentUser?.profilePic ? currentUser.profilePic.data.data : [] as ArrayLike<number> | ArrayBuffer
  // const base64String = imgTobase64String(uint8array(arrayBuffer))

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      {location.pathname === '/dashboard' && <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
        <Search />
      </div>}
      
      {location.pathname === '/sessions' && <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
        <div className="d-flex align-items-center">
          <div className="me-3">
            <KTSVG path='/img/wallet.svg' className='svg-icon-2x' />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-semibold fs-7 text-uppercase" style={{color: '#293039'}}>TOTAL EARNINGS</span>
            <span className="fw-bold fs-3" style={{color: '#144067'}}>${total}</span>
          </div>
        </div>
      </div>}

      <div
        className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
      >
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          <img src={imgUrl} alt='LOGO' />

           {/* {profileFile && profileFile.image ? 
                    (<img src={`${profileFile.imgData}`} alt='LOGO' />) : 
                    base64String ? (<img alt='Logo' src={`data:image/png;base64,${base64String}`} />) : 
                    (<img src={toAbsoluteUrl('/img/blank.png')} alt='LOGO' />)} */}
        </div>
        <HeaderUserMenu setSelectedProfileFile={setSelectedProfileFile}/>
        {/* end::Toggle */}
      </div>
      {/* end::User */}

      {/* begin::Aside Toggler */}

        <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_header_menu_mobile_toggle'
          >
            <KTSVG path='/img/txt001.svg' className='svg-icon-1' />
          </div>
        </div>

    </div>
  )
}

export {Topbar}
