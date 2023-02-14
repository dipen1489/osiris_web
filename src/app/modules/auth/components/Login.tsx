/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { login } from '../core/_requests'
import { FISRST_TIME_LOCAL_STORAGE_KEY } from "../core/AuthHelpers";
import { useAuth } from '../core/Auth'
import { decryptData, encryptData } from '../../helper'
import { ILogin } from '../core/_models'
import { KTSVG } from '../../../../_metronic/helpers'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

export function Login() {
  const authlogin = decryptData('ath')
  const initialValues = {
    email: authlogin !== null ? authlogin.email.toString() : '',
    password: authlogin !== null ? authlogin.password.toString() : '',
    toc: authlogin !== null ? authlogin.toc : false,
  }
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  const [data, setData] = useState<ILogin>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ILogin>) => {
    const updatedData = { ...data, ...fieldsToUpdate }
    setData(updatedData)
  }

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      if (values.toc) {
        const loginData = encryptData({ email: values.email, password: values.password, toc: values.toc })
        localStorage.setItem("ath", loginData)
      }
      try {
        await login(values.email, values.password).then(
          (response) => {
            const { data: auth } = response
            localStorage.setItem(FISRST_TIME_LOCAL_STORAGE_KEY, auth.data.isFirstTimeLogin.toString())
            saveAuth(auth)
            setCurrentUser(auth.data)
            setLoading(false)
          },
          (error) => {
            const resMessage =
              (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
              error.response.data.error || (error.response.data.message || error.response.data.error.message) ||
              error.toString();

            saveAuth(undefined)
            setStatus("Invalid credentials")
            setSubmitting(false)
            setLoading(false)
            window.scrollTo(0, 0)
          });
      } catch (error) {
        saveAuth(undefined)
        setStatus('The login detail is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='form w-50'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='mb-10'>
        <h1 className='text-dark textColor fw-bolder mb-3'>Login</h1>
        {/* <div className='fs-4'>
          How do I get started lorem ipsum dolor at?
        </div> */}
      </div>

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : null}

      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-semibold text-dark'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg rounded-pill border border-1 border-gray-900',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email.toString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            <label className='form-label fw-semibold text-dark fs-6 mb-0'>Password</label>
          </div>
        </div>
        <div className='position-relative'>
          <input
            type={passwordShown ? "text" : "password"}
            placeholder='Password'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control rounded-pill form-control-lg border border-1 border-gray-900',
              {
                'is-invalid': formik.touched.password && formik.errors.password,
              },
              {
                'is-valid': formik.touched.password && !formik.errors.password,
              }
            )}
          />
          <div className="position-absolute translate-middle-y pointer top-50 end-0 me-3">
            <span className="svg-icon svg-icon-1hx pe-2" onClick={togglePasswordVisiblity}>
              {passwordShown ? <KTSVG path='/img/eye.svg' className='svg-icon-1' /> : <KTSVG path='/img/eye_close.svg' className='svg-icon-1' />}
            </span>
          </div>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password.toString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-start'>
            <div className='form-check form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='checkbox'
                id='kt_login_toc_agree'
                {...formik.getFieldProps('toc')}
                onChange={(e) => {
                  formik.setFieldValue('toc', e.target.checked, false)
                }}
                defaultChecked={data.toc}
              />
              <label
                className='form-check-label fw-semibold text-gray-700 fs-6'
                htmlFor='kt_login_toc_agree'
              >
                Remember me
              </label>
            </div>
          </div>
          <div className='d-flex flex-end'>
            <Link
              to='/auth/forgot-password'
              className='form-check-label fw-semibold textColor fs-6'
              style={{ marginLeft: '5px', borderColor: '#000000' }}
            >
              Forget Password?
            </Link>
          </div>
        </div>
      </div>

      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
          className='btn btn-lg rounded-pill w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Log In</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/registration' style={{ backgroundColor: '#FFFFFF' }} className='btn btn-lg rounded-pill border border-1 border-gray-900 w-100 mb-5'>
          Register
        </Link>
      </div>
      {/* end::Action */}
    </form>
  )
}
