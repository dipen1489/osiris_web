/* eslint-disable jsx-a11y/anchor-is-valid */
import {ChangeEventHandler, useEffect, useRef, useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {register} from '../core/_requests'
import {Link} from 'react-router-dom'
import {useAuth} from '../core/Auth'
import { ModelPopup } from '../../../pages/component/popup/user-edit-modal/ModelPopup'
import { KTSVG } from '../../../../_metronic/helpers'
// import { format, isValid, parse } from 'date-fns';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import { usePopper } from 'react-popper';
// import FocusTrap from 'focus-trap-react';

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  // dob: '',
  mobileNumber: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
    firstname: Yup.string()
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('First name is required'),
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('Email is required'),
    lastname: Yup.string()
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('Last name is required'),
    mobileNumber: Yup.string()
        .min(10, 'Minimum 10 digit required')
        .max(10, 'Maximum 10 digit required')
        .required('Phone number is required'),
    // dob: Yup.string()
    //     .required('Date of birth is required'),
    password: Yup.string()
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('Password is required'),
    changepassword: Yup.string()
        .required('Password confirmation is required')
        .when('password', {
            is: (val: string) => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
        }),
    acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const {saveAuth} = useAuth()
  const [registratioStatus, setRegistratioStatus] = useState<boolean>(false)
  const [countryCode, setCountryCode] = useState<string>("")
  // const today = new Date();
  // const [selectedDay, setSelectedDay] = useState<Date | undefined>(today);

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        // , values.dob
        await register(values.firstname, values.lastname, values.email, values.password, 'student', countryCode+values.mobileNumber).then(
          (response) => {
              saveAuth(undefined)
              formik.handleReset(values)
              setRegistratioStatus(true)
              setStatus(response.data.data.message)
              setLoading(false)
              window.scrollTo(0, 0);
          },
          (error) => {
              const resMessage =
                  (error.response &&
                      error.response.data &&
                      error.response.data.message) || error.response.data.error ||
                  error.message ||
                  error.toString();
              saveAuth(undefined)
              setStatus(resMessage)
              setSubmitting(false)
              setLoading(false)
              window.scrollTo(0, 0)
          });
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The registration details is incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    fetch('https://ipapi.co/json/')
    .then( res => res.json())
    .then(response => {
      setCountryCode(response.country_calling_code);
   })
   .catch((data) => {
    //  console.log('Request failed:', data);
   });
 },[])

  // const [inputValue, setInputValue] = useState<string>('');
  // const [isPopperOpen, setIsPopperOpen] = useState(false);

  // const popperRef = useRef<HTMLDivElement>(null);
  // const buttonRef = useRef<HTMLButtonElement>(null);
  // const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
  //   null
  // );

  // const popper = usePopper(popperRef.current, popperElement, {
  //   placement: 'bottom-start'
  // });

  // const closePopper = () => {
  //   setIsPopperOpen(false);
  //   buttonRef?.current?.focus();
  // };

  // const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   setInputValue(e.currentTarget.value);
  //   const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
  //   if (isValid(date)) {
  //     setSelectedDay(date);
  //   } else {
  //     setSelectedDay(undefined);
  //   }
  // };

  // const handleButtonClick = () => {
  //   setIsPopperOpen(true);
  // };

  // const handleDaySelect = (date?: Date) => {
  //   if (date) {
  //     setSelectedDay(date);
  //     formik.setFieldValue('dob', format(date, 'y-MM-dd'), false)
  //     setInputValue(format(date, 'y-MM-dd'));
  //     closePopper();
  //   } else {
  //     setInputValue('');
  //   }
  // };

  // @ts-ignore
  return (
    <form
        className='form w-50'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='mb-10'>
        <h1 className='text-dark textColor fw-bolder  mb-3'>Register</h1>
        {/* <div className='fs-4'>
          Let's get you all set up so you can verify your personal
          account and begin setting up your Profile.
        </div> */}
      </div>

      { registratioStatus &&  <ModelPopup title='Register Successfully' message={formik.status} redirect='/auth/login' type='success'/> }
      
      {formik.status && registratioStatus === false && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      <div className='fv-row mb-5'>
        <label className='class="form-label fw-semibold text-dark fs-6'>First name</label>
        <input
          placeholder='First name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('firstname')}
          className={clsx(
            'form-control rounded-pill form-control-lg border border-1 border-gray-900',
            {
              'is-invalid': formik.touched.firstname && formik.errors.firstname,
            },
            {
              'is-valid': formik.touched.firstname && !formik.errors.firstname,
            }
          )}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.firstname}</span>
            </div>
          </div>
        )}
      </div>
      <div className='fv-row mb-5'>
        <label className='form-label fw-semibold text-dark fs-6'>Last name</label>
        <input
          placeholder='Last name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('lastname')}
          className={clsx(
            'form-control rounded-pill form-control-lg border border-1 border-gray-900',
            {
              'is-invalid': formik.touched.lastname && formik.errors.lastname,
            },
            {
              'is-valid': formik.touched.lastname && !formik.errors.lastname,
            }
          )}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.lastname}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className='fv-row mb-5'>
        <label className='form-label fw-semibold text-dark fs-6'>Phone Number</label>
        <div className='input-group'>
          <span className="input-group-text mobileno_countrycode" id="basic-addon3">
            {countryCode}
          </span>
          <input
            placeholder='Phone Number'
            type='number'
            autoComplete='off'
            {...formik.getFieldProps('mobileNumber')}
            className={clsx(
              'form-control rounded-pill mobileno ps-4 form-control-lg border border-1 border-gray-900',
              {
                'is-invalid': formik.touched.mobileNumber && formik.errors.mobileNumber,
              },
              {
                'is-valid': formik.touched.mobileNumber && !formik.errors.mobileNumber,
              }
            )}
          />
        </div>
        {formik.touched.mobileNumber && formik.errors.mobileNumber && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.mobileNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* <div className='fv-row mb-5' ref={popperRef}>
        <label className='form-label fw-bolder text-dark fs-6'>Date of Birth</label>
        <input
            placeholder={format(new Date(), 'y-MM-dd')}
            value={inputValue}
            onChange={handleInputChange}
            type='text'
            autoComplete='off'
            // {...formik.getFieldProps('dob')}
            onClick={handleButtonClick}
            className={clsx(
                'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                {
                    'is-invalid': formik.touched.dob && formik.errors.dob,
                },
                {
                    'is-valid': formik.touched.dob && !formik.errors.dob,
                }
            )}
        />
        {isPopperOpen && (
          <FocusTrap
            active
            focusTrapOptions={{
              initialFocus: false,
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              onDeactivate: closePopper
            }}
          >
            <div
            tabIndex={-1}
            style={popper.styles.popper}
            className="dialog-sheet datepicker"
            {...popper.attributes.popper}
            ref={setPopperElement}
            role="dialog"
          >
            <DayPicker
              initialFocus={isPopperOpen}
              mode="single"
              // fromDate={new Date()}
              // fromMonth={new Date()}
              fromYear={new Date().getFullYear() - 180} toYear={new Date().getFullYear() - 18}
              required
              selected={selectedDay}
              showOutsideDays
              captionLayout="dropdown"
              onSelect={handleDaySelect}
            />
          </div>
        </FocusTrap>
      )}

        {formik.touched.dob && formik.errors.dob && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.dob}</span>
              </div>
            </div>
        )}
      </div> */}

      <div className='fv-row mb-5'>
        <label className='form-label fw-semibold text-dark fs-6'>Email</label>
        <input
          placeholder='Email'
          type='email'
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
      <div className='fv-row mb-5'>
        <label className='form-label fw-semibold text-dark fs-6'>Password</label>
        <div className='position-relative mb-3'>
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
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='fv-row mb-5'>
        <label className='form-label fw-semibold text-dark fs-6'>Confirm Password</label>
        <div className='position-relative mb-3'>
          <input
            type={confirmPasswordShown ? "text" : "password"}
            placeholder='Password confirmation'
            autoComplete='off'
            {...formik.getFieldProps('changepassword')}
            className={clsx(
              'form-control rounded-pill form-control-lg border border-1 border-gray-900',
              {
                'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
              },
              {
                'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
              }
            )}
          />
          <div className="position-absolute translate-middle-y pointer top-50 end-0 me-3">
            <span className="svg-icon svg-icon-1hx pe-2" onClick={toggleConfirmPasswordVisiblity}>
              {confirmPasswordShown ? <KTSVG path='/img/eye.svg' className='svg-icon-1' /> : <KTSVG path='/img/eye_close.svg' className='svg-icon-1' />}
            </span>
          </div>
          {formik.touched.changepassword && formik.errors.changepassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.changepassword}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='fv-row mb-7'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          /> 
          <label
            className='form-check-label fw-semibold text-gray-700 fs-6'
            htmlFor='kt_login_toc_agree'
          >
            I agree to all the{' '}
            <Link to='/auth/terms' className='ms-1 fw-bold textColor'>
              Term and Privacy Policy
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg rounded-pill w-100 mb-5'
          style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Create Account</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg rounded-pill border border-1 border-gray-900 w-100 mb-5'
          >
            Log In
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}
