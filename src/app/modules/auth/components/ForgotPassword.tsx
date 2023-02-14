import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword} from '../core/_requests'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [isSuccess, setIsSuccess] = useState<String>('')
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        requestPassword(values.email)
        .then((result) => {
          const {data: ForgotPasswordModel} = result
          setIsSuccess(ForgotPasswordModel.data.message)
          setHasErrors(false)
          setLoading(false)
          formik.handleReset(values)
        },(error) => {
          const resMessage =
              (error.response &&
                  error.response.data &&
                  error.response.data.message) || error.response.data.error ||
              error.message ||
              error.toString();
          setHasErrors(true)
          setLoading(false)
          setSubmitting(false)
          setStatus(resMessage)
        })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
            setStatus('Provided detail is incorrect')
          })
      }, 1000)
    },
  })

  return (
    <>
      <form
        className='form w-50 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='mb-10'>
          <h1 className='text-dark textColor fw-bolder mb-3'>Forgot Password ?</h1>
          <div className='fs-4'>Enter your email to reset your password.</div>
        </div>

        {hasErrors === true && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
            {formik.status}
            </div>
          </div>
        )}

        {hasErrors === false && (
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>{isSuccess}</div>
          </div>
        )}

        <div className='fv-row mb-10'>
          <label className='form-label fw-semibold text-gray-900 fs-6'>Email</label>
          <input
            type='email'
            placeholder='Email'
            autoComplete='off'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control rounded-pill form-control-lg border border-1 border-gray-900',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {
                'is-valid': formik.touched.email && !formik.errors.email,
              }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        <div className='text-center'>
          <button
              type='submit'
              id='kt_password_reset_submit'
              className='btn btn-lg rounded-pill w-100 mb-5'
              style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
              disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>Rest Password</span>}
            {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link to='/auth/login'
          >
            <button
                type='button'
                id='kt_login_password_reset_form_cancel_button'
                className='btn w-100 mb-5'
                disabled={formik.isSubmitting || !formik.isValid}
            >
              Back to Sign In!
            </button>
          </Link>
        </div>
      </form>
    </>
  )
}
