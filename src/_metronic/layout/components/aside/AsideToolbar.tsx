/* eslint-disable jsx-a11y/anchor-is-valid */
import {useAuth} from '../../../../app/modules/auth'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, Search} from '../../../partials'

const AsideToolbar = () => {
  const {currentUser} = useAuth()

  return (
    <>
      <div className='aside-user d-flex align-items-sm-center justify-content-center py-5'>
        <div className='symbol symbol-50px'>
          <img src={toAbsoluteUrl('/img/blank.png')} alt='' />
        </div>
        <div className='aside-user-info flex-row-fluid flex-wrap ms-5'>
          <div className='d-flex'>
            <div className='flex-grow-1 me-2'>
              <a href='#' className='text-white text-hover-primary fs-6 fw-bold'>
                {currentUser?.firstname} {currentUser?.lastName}
              </a>
              <span className='text-gray-600 fw-bold d-block fs-8 mb-1'>Python dev</span>
              <div className='d-flex align-items-center text-success fs-9'>
                <span className='bullet bullet-dot bg-success me-1'></span>online
              </div>
            </div>
            <div className='me-n2'>
              <a
                href='#'
                className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-start'
                data-kt-menu-overflow='false'
              >
                <KTSVG
                  path='/img/cod001.svg'
                  className='svg-icon-muted svg-icon-12'
                />
              </a>

              {/* <HeaderUserMenu setSelectedProfileFile={} /> */}
            </div>
          </div>
        </div>
      </div>
      <div className='aside-search py-5'>
         <Search />
      </div>
    </>
  )
}

export {AsideToolbar}
