/* eslint-disable react-hooks/exhaustive-deps */

import {FC, useEffect, useState} from 'react'
import {useListView} from '../core/ListViewProvider'
import toast from 'react-hot-toast'
import { MultiSelect } from "react-multi-select-component";
import { updateStudentInstructor } from '../../../request/_requests';
import { useQueryClient } from 'react-query';

type Props = {
  isUserLoading: boolean
  user: any
}

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const {itemIdForUpdate, setItemIdForUpdate, itemIdForChange, setItemIdForChange, setIsUpdated} = useListView()
  const [recipientsDataValue, setRecipientsDataValue] = useState<any>([])
  const [instructorDropDownData, setInstructorDropDownData] = useState<any>([])
  const [instructorDropDown, setInstructorDropDown] = useState<any>([])
  const queryClient = useQueryClient()

  const cancel = (withRefresh?: boolean) => {
    setItemIdForUpdate(undefined)
  }

  useEffect(() => {
    if(user != null) {
      setInstructorDropDownData(user);
      setInstructorDropDown(user)
    }
  })
  
  useEffect(() => {
    const hostdata: any = itemIdForChange?.toString().split(',');
    if(instructorDropDownData.length > 0){
      for(var i = 0; i < instructorDropDownData.length; i++) {
        for(var j = 0; j < hostdata.length; j++) {
          if(hostdata[j] === instructorDropDownData[i].value){
            const recipients = { label: instructorDropDownData[i].label, value: instructorDropDownData[i].value }
            recipientsDataValue.push(recipients)
          }
        }
        // instructorDropDown.push(recipients);
      }
      // setInstructorDropDown(instructorDropDownData);
    }
  }, [instructorDropDown, instructorDropDownData])
  
  const formik = async () => {
    try {
      const email: any = []
      for (let i = 0; i < recipientsDataValue.length; i++) {
          email.push(recipientsDataValue[i].value);
      }
      const hostIds = {
        hostIds: email
      };

      await updateStudentInstructor(hostIds, itemIdForUpdate).then((result: any) => {
        toast.success('Data updated successfully...')
        setIsUpdated(true)
        setItemIdForChange(undefined)
        setItemIdForUpdate(undefined)
      },(error: any) => {
        const resMessage =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        toast.error(resMessage)
      })
      .catch(() => {
        toast.error('Please try after sometime')
      })
    } catch (ex) {
      console.error(ex)
    } finally {
      queryClient.invalidateQueries(['getallMeetingByStudent'])
      cancel(true)
    }
  }

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' noValidate>
        <div
          className='d-flex flex-column me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          <div className='row'>
              <div className='col-md-12'>
                <label className='form-label fs-6'>
                    Instructors
                </label>
                <MultiSelect
                  className='form-control dropdownheight form-control-sm'
                  options={instructorDropDown}
                  value={recipientsDataValue}
                  onChange={(e: any) => {
                      setRecipientsDataValue(e)
                  }}
                  labelledBy="Select Instructor"
                />
                {/* {formik.touched.expertise && formik.errors.expertise && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.expertise}</span>
                        </div>
                    </div>
                )} */}
              </div>
          </div>
        </div>
        <div className='text-center pt-5'>
          <button
            type='button'
            className='btn themebtnblue fw-bolder px-6 py-3'
            data-kt-users-modal-action='submit'
            onClick={formik}
          >
            <span className='indicator-label'>SAVE CHANGES</span>
          </button>
        </div>
      </form>
    </>
  )
}

export {UserEditModalForm}
