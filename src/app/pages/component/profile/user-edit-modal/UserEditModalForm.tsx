/* eslint-disable react-hooks/exhaustive-deps */
import {ChangeEventHandler, FC, useEffect, useRef, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { AuthModel, ProfileUserModel, UserModel } from '../../../../modules/auth/core/_models';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { useIntl } from 'react-intl'
import { format, isValid, parse } from 'date-fns'
import { usePopper } from 'react-popper';
import FocusTrap from 'focus-trap-react'
import { DayPicker } from 'react-day-picker'
import Axios from 'axios'
import toast from 'react-hot-toast'
import Compressor from 'compressorjs';
import { ProfilePicUpload } from '../../../student/dashboard/core/_requests'
import { useAuth } from '../../../../modules/auth'
import * as authHelper from '../../../../modules/auth/core/AuthHelpers'
import { Loader } from '../../Loader'
import moment from 'moment'

type Props = {
  isUserLoading: boolean
  user: UserModel
}

const editUserSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Min 3 characters required')
    .max(50, 'Maximum 50 characters required')
    .required('Firstname is required'),
  lastName: Yup.string()
    .min(3, 'Min 3 characters required')
    .max(50, 'Maximum 50 characters required')
    .required('Lastname is required'),
  phone: Yup.string()
    .min(10, 'Minimum 10 digit required')
    .max(10, 'Maximum 10 digit required')
    .required('Mobile number is required'),
  dob: Yup.date()
    .required('Date of birth is required'),
})

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const intl = useIntl()
  const [countryCode, setCountryCode] = useState<string>("")
  const [imgUrl, setImgUrl] = useState<any>(localStorage.getItem('profile')!);
  const [imgDeleteToken, setImgDeleteToken] = useState<string>(user.profilePic_delete_token!);
  const [inputValue, setInputValue] = useState<string>('');
  const { setCurrentUser } = useAuth()

  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const [classOfInput, setClassOfInput] = useState<string>("col-lg-6 mb-4")

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

  const mobile = user.mobileNumber!;
  const [userForEdit] = useState<UserModel>({
    ...user,
    email: user.email,
    dob: user.dob,
    role: user.role,
    expertise: user.expertise,
    firstname: user.firstname,
    lastName: user.lastName,
    phone: mobile.substr(mobile.length - 10),
    profilePic: user.profilePic || localStorage.getItem('profile')!,
    profilePic_delete_token: user.profilePic_delete_token || localStorage.getItem('profile_dt')!,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setSubmitting(true)
      try {
        if(user.role === 'instructor'){
          const instructor: ProfileUserModel = {
            firstName: values.firstname,
            lastName: values.lastName,
            dob: values.dob,
            expertise: values.expertise,
            mobileNumber: countryCode + values.phone,
          }
          await updateUser(itemIdForUpdate, instructor).then((result) => {

            const userdata = JSON.parse(localStorage.getItem('kt-auth-react-v')!);

            userdata.data.firstname = values.firstname
            userdata.data.lastName = values.lastName
            userdata.data.profilePic = imgUrl
            userdata.data.profilePic_delete_token = imgDeleteToken != "" ? imgDeleteToken : localStorage.getItem('profile_dt')
            userdata.data.dob = values.dob
            userdata.data.mobileNumber =  countryCode + values.phone
            userdata.data.phone = values.phone
            saveAuth(userdata)
            setCurrentUser(userdata.data)
            window.dispatchEvent(new Event("storage"));
            formik.handleReset(values)
            toast.success('Profile updated successfully...')
            setItemIdForUpdate(undefined)
          },(error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setSubmitting(false)
            setStatus("There is one of invalid input fields data. Please try again with proper data")
            // toast.error(resMessage)
          })
          .catch(() => {
            setSubmitting(false)
            toast.error('Please try after sometime')
          })
        }
        else if(user.role === 'student'){
          const student: ProfileUserModel = {
            firstName: values.firstname,
            lastName: values.lastName,
            dob: values.dob,
            mobileNumber: countryCode + values.phone,
          }
          await updateUser(itemIdForUpdate, student).then((result) => {

            const userdata = JSON.parse(localStorage.getItem('kt-auth-react-v')!);

            userdata.data.firstname = values.firstname
            userdata.data.lastName = values.lastName
            userdata.data.profilePic = imgUrl
            userdata.data.profilePic_delete_token = imgDeleteToken != "" ? imgDeleteToken : localStorage.getItem('profile_dt')
            userdata.data.dob = values.dob
            userdata.data.mobileNumber =  countryCode + values.phone
            userdata.data.phone = values.phone
            saveAuth(userdata)
            setCurrentUser(userdata.data)
            // localStorage.setItem('kt-auth-react-v1', JSON.stringify(userdata))
            window.dispatchEvent(new Event("storage"));
            formik.handleReset(values)
            toast.success('Profile updated successfully...')
            setItemIdForUpdate(undefined)

          },(error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setSubmitting(false)
            setStatus("There is one of invalid input fields data. Please try again with proper data")
            // toast.error(resMessage)
          })
          .catch(() => {
            setSubmitting(false)
            toast.error('Please try after sometime')
          })
        }
        else if(user.role === 'admin'){
          await updateUser(itemIdForUpdate, values).then((result) => {
            const data: any = result
            formik.handleReset(values)
            toast.success(data.data.message)
            setItemIdForUpdate(undefined)
          },(error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setSubmitting(false)
            setStatus("There is one of invalid input fields data. Please try again with proper data")
            // toast.error(resMessage)
          })
          .catch(() => {
            setSubmitting(false)
            toast.error('Please try after sometime')
          })
        }  
        
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        // cancel(true)
      }
    },
  })

  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(today);
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start'
  });

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
    if (isValid(date)) {
      setSelectedDay(date);
    } else {
      setSelectedDay(undefined);
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleDaySelect = (date?: Date) => {
    if (date) {
      setSelectedDay(date);
      formik.setFieldValue('dob', format(date, 'y-MM-dd'), true)
      setInputValue(format(date, 'y-MM-dd'));
      closePopper();
    } else {
      setInputValue('');
    }
  };

  const [file, setSelectedFile] = useState({
      image: false,
      imageName: '',
      imgData: {}
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isImgUploading, setIsImgUploading] = useState<boolean>(false);
  const [compressedFile, setCompressedFile] = useState<Uint8Array>();

  const uploadImage = (formData: any) => {
    const uninterceptedAxiosInstance = Axios.create();
    uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/image/upload", formData)
    .then((response) => {
      setImgUrl(response.data.url)
      setImgDeleteToken(response.data.delete_token)
      setIsSuccess(true)
      setIsImgUploading(false)
      localStorage.setItem('updata', JSON.stringify(response))
      localStorage.setItem('profile', response.data.url)
      localStorage.setItem('profile_dt', response.data.delete_token)
      const userdata = JSON.parse(localStorage.getItem('kt-auth-react-v')!);
      userdata.data.profilePic = response.data.url
      userdata.data.profilePic_delete_token = response.data.delete_token
      saveAuth(userdata)
      setCurrentUser(userdata.data)
      window.dispatchEvent(new Event("storage"));
      toast.success('Profile Image Upload Successfully...')
    },
    (error) => {
      const resMessage =
      (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
      (error.response.data.message || error.response.data.error.message) ||
          error.toString();
      toast.error(resMessage)
      setIsSuccess(false)
    });
  };

const deleteImage = () =>{
  const token = localStorage.getItem('profile_dt')
  if(token !== null){
    const formData = new FormData()
    formData.append("token", token);

    const uninterceptedAxiosInstance = Axios.create();
    uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/delete_by_token", formData)
    .then(result =>{
      // console.log('result : ',result);
    })
    .catch(error =>{
      // console.log('error : ',error);
    })
  }
}

async function fetchData() {
  // You can await here
  if(compressedFile !== undefined && isSuccess) {
    try {
        await ProfilePicUpload({image: {name: imgUrl, delete_token: imgDeleteToken}}).then(
        () => {
          setIsSuccess(false)
        },
        (error) => {
          const resMessage =
          (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
          (error.response.data.message || error.response.data.error.message) ||
              error.toString();
          toast.error(resMessage)
        });
    } catch (error) {
      toast.error('Please try after some time')
    }
  }
}


useEffect(() => {
  setCountryCode(mobile.substring(0, mobile.length - 10));
  setClassOfInput(user.role === 'student' ? 'col-lg-4 mb-4' : 'col-lg-6 mb-4')
  if(user.dob?.toString() !== ""){
    setSelectedDay(moment(user.dob!).toDate())
    return setInputValue(format(new Date(user.dob!), 'y-MM-dd'))
  }
},[user.dob])


useEffect(() => {
  if(isSuccess) {
    fetchData()
  }
}, [isSuccess]);

const blankImg = imgUrl ? imgUrl : userForEdit.profilePic ? userForEdit.profilePic : toAbsoluteUrl('/img/blank.svg')

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
          {formik.status && (
            <div className='mb-lg-15 alert alert-danger'>
              <div className='alert-text font-weight-bold'>{formik.status}</div>
            </div>
          )}
          <div className='row mb-4'>
            <div className='col-lg-2'>
              <div
                className='image-input border border-2 border-gray-900 border-blue-theme rounded-9 image-input-outline'
                data-kt-image-input='true'
                style={{backgroundImage: `url('${blankImg}')`}}
              >
                { 
                  isImgUploading ? 
                  <Loader classes='start-0 p-4' position='inherit' message='Uploading...' addCustomStyles={false} iconWidth={36} /> :  
                  (<>
                  <div
                  className='image-input-wrapper w-100px h-100px'
                  style={{backgroundImage: `url('${blankImg}')`}}
                ></div>
                <label
                  className='btn btn-icon btn-circle top-100 btn-active-color-primary border border-1 border-gray-900 w-20px h-20px bg-body shadow'
                  data-kt-image-input-action='change'
                  data-bs-toggle='tooltip'
                  title='Change avatar'
                >
                  <i className='bi bi-pencil-fill fs-9'></i>

                  <input type='file'
                    onChange={({ currentTarget }) => {
                      const file = currentTarget.files![0];
                      const reader = new FileReader();
                      setIsImgUploading(true)
                      new Compressor(file, {
                      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                      success: async (compressedResult) => {
                          try {
                                const formData = new FormData();
                                formData.append("file",compressedResult);
                                formData.append("upload_preset","vl0x6a9w");
                                formData.append("folder","profile_pic/"); 
                                if(localStorage.getItem('profile') !== null) {
                                    deleteImage()
                                }
                                uploadImage(formData)
                          } catch (error) {
                            setIsImgUploading(false)
                            toast.error('Please try after some time')
                          }
                          const ab = await compressedResult.arrayBuffer()
                          const ui8a = new Uint8Array(ab);
                          setCompressedFile(ui8a)
                      },
                      });

                      if (file) {
                          reader.onloadend = () => {
                              setSelectedFile({ image: true, imageName: file.name, imgData: reader.result! });
                          };
                          reader.readAsDataURL(file);
                      }
                  }}
                    name='avatar' 
                    accept='.png, .jpg, .jpeg' />
                  <input type='hidden' name='avatar_remove' />
                </label>
                  </>)
                }
                {/* <span
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='cancel'
                  data-bs-toggle='tooltip'
                  title='Cancel avatar'
                >
                  <i className='bi bi-x fs-2'></i>
                </span>
              
                <span
                  className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                  data-kt-image-input-action='remove'
                  data-bs-toggle='tooltip'
                  title='Remove avatar'
                >
                  <i className='bi bi-x fs-2'></i>
                </span> */}

              </div>
              {/* end::Image input */}

              {/* begin::Hint */}
              {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
              {/* end::Hint */}
            </div>
            <div className='col-lg-5'>
              <label className='form-label fs-6'>
                  {intl.formatMessage({id: 'PROFILE.FIRSTNAME'})}
              </label>
              <input
                  placeholder={intl.formatMessage({id: 'PROFILE.FIRSTNAME'})}
                  {...formik.getFieldProps('firstname')}
                  type='text'
                  autoComplete='off'
                  name='firstname'
                  onChange={(e) => {
                      formik.setFieldValue('firstname', e.target.value, e.target.value !== "" ? true : false)
                  }}
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
            <div className='col-lg-5'>
              <label className='form-label fs-6'>
                  {intl.formatMessage({id: 'PROFILE.LASTNAME'})}
              </label>
              <input
                  placeholder={intl.formatMessage({id: 'PROFILE.LASTNAME'})}
                  {...formik.getFieldProps('lastName')}
                  type='text'
                  autoComplete='off'
                  name='lastName'
                  onChange={(e) => {
                      formik.setFieldValue('lastName', e.target.value, e.target.value !== "" ? true : false)
                  }}
                  className={clsx(
                      'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                      {
                          'is-invalid': formik.touched.lastName && formik.errors.lastName,
                      },
                      {
                          'is-valid': formik.touched.lastName && !formik.errors.lastName,
                      }
                  )}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                  <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.lastName}</span>
                      </div>
                  </div>
              )}
            </div>
          </div>
          <div className='row'>
            <div className={`${classOfInput}`}>
              <label className='d-flex align-items-center form-label fs-6'>
                  {intl.formatMessage({id: 'PROFILE.EMAIL'})}
                  <i className="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="should not edit it"></i>
              </label>
              <input
                  placeholder={intl.formatMessage({id: 'PROFILE.EMAIL'})}
                  {...formik.getFieldProps('email')}
                  type='email'
                  autoComplete='off'
                  name='email'
                  disabled={true}
                  onChange={(e) => {
                      formik.setFieldValue('email', e.target.value, e.target.value !== "" ? true : false)
                  }}
                  className={clsx(
                      'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                      {
                          'is-invalid': formik.touched.email && formik.errors.email,
                      },
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
            <div className={`${classOfInput}`}>
              <label className='form-label fs-6'>
                  {intl.formatMessage({id: 'PROFILE.MOBILE'})}
              </label>
              <div className='input-group'>
                <span className="input-group-text mobileno_countrycode" id="basic-addon3">
                  {countryCode}
                </span>
                <input
                  placeholder={intl.formatMessage({id: 'PROFILE.MOBILE'})}
                  type='number'
                  min={9}
                  max={15}
                  autoComplete='off'
                  {...formik.getFieldProps('phone')}
                  className={clsx(
                    'form-control rounded-pill mobileno ps-4 form-control-lg border border-1 border-gray-900',
                    {
                      'is-invalid': formik.touched.phone && formik.errors.phone,
                    },
                    {
                      'is-valid': formik.touched.phone && !formik.errors.phone,
                    }
                  )}
                />
              </div>
              
              {formik.touched.phone && formik.errors.phone && (
                  <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.phone}</span>
                      </div>
                  </div>
              )}
            </div>
            {user.role === 'instructor' && 
              <div className={`${classOfInput}`}>
                <label className='form-label fs-6'>
                    {intl.formatMessage({id: 'PROFILE.EXPERTISE'})}
                </label>
                <input
                    placeholder={intl.formatMessage({id: 'PROFILE.EXPERTISE'})}
                    {...formik.getFieldProps('expertise')}
                    type='text'
                    autoComplete='off'
                    name='expertise'
                    onChange={(e) => {
                        formik.setFieldValue('expertise', e.target.value, e.target.value !== "" ? true : false)
                    }}
                    className={clsx(
                        'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                        {
                            'is-invalid': formik.touched.expertise && formik.errors.expertise,
                        },
                        {
                            'is-valid': formik.touched.expertise && !formik.errors.expertise,
                        }
                    )}
                />
                {formik.touched.expertise && formik.errors.expertise && (
                    <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.expertise}</span>
                        </div>
                    </div>
                )}
              </div>
            }
            <div className={`${classOfInput}`} ref={popperRef}>
              <label className='form-label fs-6'> {intl.formatMessage({id: 'PROFILE.DOB'})}</label>
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
                  className="dialog-sheet datepicker datepicker-position-fixed"
                  {...popper.attributes.popper}
                  ref={setPopperElement}
                  role="dialog"
                >
                  <DayPicker
                    initialFocus={isPopperOpen}
                    selected={selectedDay}
                    mode="single"
                    // fromDate={new Date()}
                    // fromMonth={new Date()}
                    fromYear={new Date().getFullYear() - 180} 
                    toYear={new Date().getFullYear() - 18}
                    required
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
              <span className='indicator-progress'  style={{display: 'block'}}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            ):<span className='indicator-label'>SAVE CHANGES</span>}
          </button>
        </div>
      </form>
    </>
  )
}

export {UserEditModalForm}
