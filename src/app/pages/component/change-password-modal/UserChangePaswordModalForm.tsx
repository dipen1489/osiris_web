import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
// import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
// import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import { useIntl } from 'react-intl'
import { ForgotPasswordModel, UserChangePasswordModel, UserChangePasswordinitialValues } from '../../../modules/auth'
import { UsersListLoading } from '../profile/components/loading/UsersListLoading'
import { changePassword } from '../profile/core/_requests'
import { useListView } from '../profile/core/ListViewProvider'
import toast from 'react-hot-toast';

type Props = {
  isUserLoading?: boolean
  user?: UserChangePasswordModel
}

const editUserSchema = Yup.object().shape({
  newPassword: Yup.string()
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('Password is required'),
  confirmPassword: Yup.string()
        .required('Password confirmation is required')
        .when('newPassword', {
            is: (val: string) => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf([Yup.ref('newPassword')], "Password and Confirm Password didn't match"),
        }),
})

const UserChangePaswordModalForm: FC<Props> = ({user, isUserLoading}) => {
  const intl = useIntl()
  const {itemIdForChange, setItemIdForChange} = useListView()
  const formik = useFormik({
    initialValues: UserChangePasswordinitialValues,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        const changepassword: UserChangePasswordModel = {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword
        }
        await changePassword(itemIdForChange ,changepassword)
        .then((result) => {
          const data: ForgotPasswordModel = result
          formik.handleReset(values)
          toast.success(data.data.message)
          setItemIdForChange(undefined)
        },(error) => {
          const resMessage =
              (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
              error.message ||
              error.toString();
          setSubmitting(false)
          toast.error(resMessage)
        })
        .catch(() => {
          setSubmitting(false)
          toast.error('The reset password detail is incorrect')
        })
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          <div className='row mb-5'>
            <div className='col-lg-6'>
              <label className='form-label fs-6'>
                  {intl.formatMessage({id: 'CHANGEPASSWORD.NEWPASSWORD'})}
              </label>
              <input
                  placeholder={intl.formatMessage({id: 'CHANGEPASSWORD.NEWPASSWORD'})}
                  {...formik.getFieldProps('newPassword')}
                  type='password'
                  autoComplete='off'
                  name='newPassword'
                  onChange={(e) => {
                      formik.setFieldValue('newPassword', e.target.value, e.target.value !== "" ? true : false)
                  }}
                  className={clsx(
                      'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                      {
                          'is-invalid': formik.touched.newPassword && formik.errors.newPassword,
                      },
                      {
                          'is-valid': formik.touched.newPassword && !formik.errors.newPassword,
                      }
                  )}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                  <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.newPassword}</span>
                      </div>
                  </div>
              )}
            </div>
            <div className='col-lg-6'>
              <label className='form-label fs-6'>
                  {intl.formatMessage({id: 'CHANGEPASSWORD.CONFIRMPASSWORD'})}
              </label>
              <input
                  placeholder={intl.formatMessage({id: 'CHANGEPASSWORD.CONFIRMPASSWORD'})}
                  {...formik.getFieldProps('confirmPassword')}
                  type='password'
                  autoComplete='off'
                  name='confirmPassword'
                  onChange={(e) => {
                      formik.setFieldValue('confirmPassword', e.target.value, e.target.value !== "" ? true : false)
                  }}
                  className={clsx(
                      'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                      {
                          'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword,
                      },
                      {
                          'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                      }
                  )}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.confirmPassword}</span>
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>
        <div className='text-center pt-5'>
          <button
            type='submit'
            className='btn themebtnblue fw-bolder px-6 py-3'
            data-kt-users-modal-action='submit'
            style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            {(formik.isSubmitting || isUserLoading) ? (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            ) : <span className='indicator-label'>SAVE PASSWORD</span>}
          </button>
        </div>
      </form>
    </>
  )
}

export {UserChangePaswordModalForm}
