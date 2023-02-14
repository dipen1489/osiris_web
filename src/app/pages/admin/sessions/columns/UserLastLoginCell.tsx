import {FC} from 'react'
import { KTSVG } from '../../../../../_metronic/helpers'

type Props = {
  user: any
  customeStyle: boolean
}

const styles = {
  zIndex: '105',
  margin: '0px',
  transform: 'translate(-295px, 15px)',
}

const UserLastLoginCell: FC<Props> = ({user, customeStyle}) => (
  
  <div
    className={`menu menu-sub menu-sub-dropdown menu-column w-275px w-lg-325px ${customeStyle ? 'show': ''}`}
    data-kt-menu='true'
    style={{...styles, position: 'absolute'}}
  >
    <div className='tab-content'>
      <div className={`tab-pane fade ${customeStyle ? 'active show': ''}`} id='kt_topbar_notifications_1' role='tabpanel'>
        <div className='scroll-y mh-325px my-5 px-8'>
          {user.map((alert: any, index: number) => (
            <div className='d-flex justify-content-between pt-3 pb-2'>
              <div className='me-3'>
                <KTSVG path='/img/Calander.svg' className='svg-icon-2 me-2' />
                {alert.split(' : ')[0]}
              </div>
              <div className='me-3'>
                <KTSVG path='/img/userjoin.svg' className='svg-icon-2 me-1' />
                {alert.split(' : ')[1].replace(/students/g, "")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export {UserLastLoginCell}
