import {useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {AsideDefault} from './components/aside/AsideDefault'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {PageDataProvider} from './core'
import {useLocation} from 'react-router-dom'
import {MenuComponent} from '../assets/ts/components'
import { Toaster, toast } from 'react-hot-toast'

const MasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])

  return (
    <PageDataProvider>
      <div className='page d-flex flex-row flex-column-fluid'>
        <AsideDefault />
        <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
          <HeaderWrapper />

          <div id='kt_content' className='bg-body content d-flex flex-column flex-column-fluid'>
            <div className='post d-flex flex-column-fluid' id='kt_post'>
              <Content>
                <Outlet />
              </Content>
              <div><Toaster
                    position="bottom-center"
                    reverseOrder={false}
                    />
                </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollTop />
    </PageDataProvider>
  )
}

export {MasterLayout}
