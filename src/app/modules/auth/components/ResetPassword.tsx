import {useEffect, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import {useFormik} from 'formik'
import {resetPassword} from '../core/_requests'

const initialValues = {
  password: '',
  changepassword: ''
}

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Password is required'),
  changepassword: Yup.string()
      .required('Password confirmation is required')
      .when('password', {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
      }),
})

export function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [isSuccess, setIsSuccess] = useState<String>('')

  const [resetPasswordParams, setResetPasswordParams] = useSearchParams();
  const uid = resetPasswordParams.get("uid") || "";
  let navigate = useNavigate();

  useEffect(() => {
      if(isSuccess){
          setTimeout(() => {
              return navigate('/auth/login')
          }, 5000)
      }
  }, [isSuccess]);

  const formik = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        resetPassword(uid, values.password, values.changepassword)
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
            setStatus('The reset password detail is incorrect')
          })
      }, 1000)
    },
  })

  return (
    <form
      className='form w-50 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='mb-10'>
        <h1 className='text-dark textColor fw-bolder mb-3'>New Password</h1>
        <div className='fs-4'> Enter your new password & confirm password to reset your password.</div>
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

      <div className='fv-row mb-5'>
        <div className='mb-1'>
          <label className='form-label fw-semibold text-dark fs-6'>Password</label>
          <div className='position-relative mb-3'>
            <input
                type='password'
                placeholder='Password'
                autoComplete='off'
                {...formik.getFieldProps('password')}
                className={clsx(
                    'form-control form-control-lg rounded-pill border border-1 border-gray-900',
                    {
                      'is-invalid': formik.touched.password && formik.errors.password,
                    },
                    {
                      'is-valid': formik.touched.password && !formik.errors.password,
                    }
                )}
            />
            {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
      <div className='fv-row mb-5'>
        <label className='form-label fw-semibold text-dark fs-6'>Confirm Password</label>
        <input
            type='password'
            placeholder='Password confirmation'
            autoComplete='off'
            {...formik.getFieldProps('changepassword')}
            className={clsx(
                'form-control form-control-lg rounded-pill border border-1 border-gray-900',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
                }
            )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.changepassword}</span>
              </div>
            </div>
        )}
      </div>
      <div className='text-center'>
        <button type='submit' id='kt_password_reset_submit' className='btn btn-lg rounded-pill btn-primary fw-bolder w-100 mb-5' style={{ backgroundColor: '#144067', color: '#FFFFFF' }} disabled={formik.isSubmitting || !formik.isValid}>
          {!loading && <span className='indicator-label'>Save Password</span>}
          {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...{' '}
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
  )
}
