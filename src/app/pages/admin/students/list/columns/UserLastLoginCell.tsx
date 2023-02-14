/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useState} from 'react'
import { KTSVG } from '../../../../../../_metronic/helpers'
import { MultiSelect } from "react-multi-select-component";

type Props = {
  user: any
  instructor: any
  id: any
  customeStyle: boolean
}

const styles = {
  zIndex: '105',
  margin: '0px',
  transform: 'translate(-270px, 17px)',
}

const UserLastLoginCell: FC<Props> = ({user, instructor, id, customeStyle}) => {
      const [recipientsDataValue, setRecipientsDataValue] = useState<any>([])
      const [isDataProcessing, setIsDataProcessing] = useState<boolean>(false)

      const updateinstData = () => {
        setIsDataProcessing(true)
        user.forEach((element: any) => {
          instructor.forEach((item: any) => {
            if(element === item.value) {
              const recipients = { label: item.label, value: item.value }
              recipientsDataValue.push(recipients)
            }
          })
        })
        setIsDataProcessing(false)
      }
      updateinstData()

      // useEffect(() => {
      //   user.forEach((element: any) => {
      //     instructor.forEach((item: any) => {
      //       if(element === item.value) {
      //         const recipients = { label: item.label, value: item.value }
      //         recipientsDataValue.push(recipients)
      //       }
      //     })
      //   })
      // }, [])
  
        return  (
            <div
              className={`menu menu-sub menu-sub-dropdown menu-column w-275px w-lg-300px ${customeStyle ? 'show': ''}`}
              data-kt-menu='true'
              style={{...styles, position: 'absolute'}}
            >
              <div className='tab-content'>
                <div className={`tab-pane fade ${customeStyle ? 'active show': ''}`} id='kt_topbar_notifications_1' role='tabpanel'>
                  <div className='scroll-y mh-325px my-5 px-8'>
                    {
                      !isDataProcessing && 
                      <MultiSelect
                        className='form-control form-control-sm'
                        options={instructor}
                        value={recipientsDataValue}
                        onChange={(e: any) => {
                            setRecipientsDataValue(e)
                        }}
                        labelledBy="Select Instructor"
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        }
export {UserLastLoginCell}
