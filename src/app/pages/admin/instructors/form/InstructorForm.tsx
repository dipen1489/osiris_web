/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../../../_metronic/layout/core'
import { Link, useNavigate } from 'react-router-dom'
import { MeetingAddEditModel, PreferenceCategory } from '../../../instructor/meeting/core/_models'
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider'
import { IInstructor, initialValues } from './core/_models'
import { useFormik } from 'formik'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { createInstructor } from '../../request/_requests'
import { Loader } from '../../../component/Loader'

const InstructorForm: FC = () => {
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const [isEditDisable, setIsEditDisable] = useState<boolean>(false)
  
  const navigate = useNavigate();
  const dataModel: MeetingAddEditModel | any  = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const [categoryies, setCategoryies] = useState<PreferenceCategory[]>()

  const [data, setData] = useState<IInstructor>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IInstructor>) => {
      const updatedData = { ...data, ...fieldsToUpdate }
      setData(updatedData)
  }

  const instructorSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('First name is required'),
    lastName: Yup.string()
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('Last name is required'),
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('Email is required'),
    expertise: Yup.string()
        .required('Category is required'),
    password: Yup.string()
        .min(3, 'Minimum 3 charaters required')
        .max(50, 'Maximum 50 charaters required')
        .required('Password is required'),
    confirmpasword: Yup.string()
        .required('Password confirmation is required')
        .when('password', {
            is: (val: string) => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
        }),
  })

  const formik = useFormik({
      enableReinitialize:true,
      validateOnChange:true,
      validateOnBlur:true,
      initialValues,
      validationSchema: instructorSchema,
      onSubmit: async (values, { setStatus, setSubmitting }) => {
          setSubmitting(true)
          setLoading(true)
          try {
                if(dataModel.edit === null)
                {
                    await createInstructor(data).then((result: any) => {
                        if(result.data?.message){
                            toast.success(dataModel.edit === null ? result.data?.message : "Session Updated Successfully" )
                            setSubmitting(false)
                            setLoading(false)
                            setTimeout(() => {
                                return navigate('/instructors')
                            }, 1000)
                        }
                    }).catch((err) => {
                        toast.error("Opps! there is some error please try again...");
                        setSubmitting(false)
                        setLoading(false)
                    });
                }
                else{await createInstructor(data)} 
              
            //   , dataModel.edit.data.id
            //    : InstructorRS
          } catch (error) {
              console.error(error)
              setStatus('The instructor save has some error')
              setSubmitting(false)
              setLoading(false)
          }
      },
  })


  useEffect(() => {
      if(dataModel.category){
          setCategoryies(dataModel.category.data)
      }
      
    //   if(dataModel.edit !== null && dataModel.edit){
    //       setIsEditDisable(true)
    //       setLoading(true)
    //       setStartDate(format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd'));
    //       setSelectedStartDay(new Date(dataModel.edit.data.meeting_param.start_time));
    //       setSelectedEndDate(new Date(dataModel.edit.data.meeting_param.recurrence.end_date_time));
    //       setInputEndDateValue(format(new Date(dataModel.edit.data.meeting_param.recurrence.end_date_time), 'y-MM-dd'));
    //       updateData({ title: dataModel.edit.data.title })
    //       setCompressedFile(dataModel.edit.data.image)
    //       setImgUrl(dataModel.edit.data.image)
    //       setImgDeleteToken(dataModel.edit.data.delete_image_token)
    //       // const arrayBuffer = dataModel.edit.data.image.data.data as ArrayLike<number> | ArrayBuffer
    //       // const base64String = imgTobase64String(uint8array(arrayBuffer))
    //       setIsRecurrence(dataModel.edit.data.meeting_param.recurrence.type === 1 ? false : true)
    //       setRecurrenceType(dataModel.edit.data.meeting_param.recurrence.type.toString())
    //       setSelectedFile({
    //           image: true,
    //           imageName: dataModel.edit.data.image.name,
    //           imgData: `data:image/png;base64`,
    //       })
    //       const daysdt: number[] = dataModel.edit.data.meeting_param.recurrence?.weekly_days ? Array.from(dataModel.edit.data.meeting_param.recurrence?.weekly_days.split(','),Number) : []
    //       if(dataModel.edit.data.meeting_param.recurrence.type === 2){
    //           setWeeklyDaysLST(daysdt)
    //       }
      
    //       if(dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_day){
    //           setOccursOnDay(false)
    //           setOccursOWeek(true)
    //       }

    //       if(dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_week){
    //           setOccursOnDay(true)
    //           setOccursOWeek(false)
    //       }
          

    //       formik.setFieldValue('title', dataModel.edit.data.title, dataModel.edit.data.title !== "" ? false : true)
    //       formik.setFieldValue('start_date', format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd'), format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd') !== "" ? false : true)
    //       formik.setFieldValue('start_time', format(new Date(dataModel.edit.data.meeting_param.start_time), 'HH:mm'), format(new Date(dataModel.edit.data.meeting_param.start_time), 'HH:mm') !== "" ? false : true)
    //       formik.setFieldValue('equipments_required', dataModel.edit.data.equipments_required.toString(), dataModel.edit.data.equipments_required.toString() !== "" ? false : true)
    //       formik.setFieldValue('price', dataModel.edit.data.price, dataModel.edit.data.price !== "" ? false : true)
    //       formik.setFieldValue('category_id', dataModel.edit.data.category_id, dataModel.edit.data.category_id !== "" ? false : true)
    //       formik.setFieldValue('image', dataModel.edit.data.image, dataModel.edit.data.image !== "" ? false : true)
    //       formik.setFieldValue('description', dataModel.edit.data.description, dataModel.edit.data.description !== "" ? false : true)

    //       const editValues = {
    //           title: dataModel.edit.data.title,
    //           start_date: dataModel.edit.data.meeting_param.start_time,
    //           start_time: format(new Date(dataModel.edit.data.meeting_param.start_time), 'HH:mm'),
    //           duration: dataModel.edit.data.meeting_param.duration,
    //           max_student: dataModel.edit.data.schedule[0].max_users,
    //           equipments_required: dataModel.edit.data.equipments_required.toString(),
    //           timezone: dataModel.edit.data.meeting_param.timezone,
    //           price: dataModel.edit.data.price,
    //           category_id: dataModel.edit.data.category_id,
    //           visibility:  dataModel.edit.data.visibility,
    //           image: dataModel.edit.data.image,
    //           description: dataModel.edit.data.description,
    //           repeat: {
    //               recurrence: ((format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd') === format(new Date(dataModel.edit.data.meeting_param.recurrence.end_date_time), 'y-MM-dd')) && dataModel.edit.data.meeting_param.recurrence.type === 1) ? false : true,
    //               rtype: dataModel.edit.data.meeting_param.recurrence.type,
    //               end_date_time: dataModel.edit.data.meeting_param.recurrence.end_date_time,
    //               repeat_interval: 0,
    //               weekly_days: {
    //                   sun: daysdt.includes(1) === true ? true : false,
    //                   mon: daysdt.includes(2) === true ? true : false,
    //                   tue: daysdt.includes(3) === true ? true : false,
    //                   wed: daysdt.includes(4) === true ? true : false,
    //                   thu: daysdt.includes(5) === true ? true : false,
    //                   fri: daysdt.includes(6) === true ? true : false,
    //                   sat: daysdt.includes(7) === true ? true : false,
    //               },
    //               monthly:{
    //                   monthly_day: (dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_day ) ? true : false,
    //                   monthly_week: (dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_week ) ? true : false,
    //               },
    //               monthlydays:{
    //                   day: dataModel.edit.data.meeting_param.recurrence?.monthly_day ? dataModel.edit.data.meeting_param.recurrence.monthly_day : 1,
    //               },
    //               weekly:{
    //                   monthly_weekday: dataModel.edit.data.meeting_param.recurrence?.monthly_week ? dataModel.edit.data.meeting_param.recurrence.monthly_week : 1,
    //                   monthly_week_day: dataModel.edit.data.meeting_param.recurrence?.monthly_week_day ? dataModel.edit.data.meeting_param.recurrence.monthly_week_day : 1,
    //               }
    //           },
    //       }
    //       setData(editValues)
    //       setLoading(false)
    //   }
  },[!isLoading])

return (
  <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: dataModel.edit !== null ? 'MENU.EDITINSTRUCTOR' : 'MENU.INSTRUCTORREGISTER' })}</PageTitle>
      {
          (isLoading && !loading) ? 
          <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> :
          <form className='form d-flex flex-center' onSubmit={formik.handleSubmit}>
              <div className='card-body py-10'>
                  {formik.status && (
                      <div className='mb-lg-15 alert alert-danger'>
                          <div className='alert-text font-weight-bold'>{formik.status}</div>
                      </div>
                  )}
                  <div className='row mb-8'>
                      <div className='col-lg-4 mb-8'>
                          <label className='form-label fs-6'>
                              {intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.FIRSTNAME'})}
                          </label>
                          <input
                              placeholder={intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.FIRSTNAME'})}
                              type='text'
                              autoComplete='off'
                              name='firstName'
                              onChange={(e) => {
                                  formik.setFieldValue('firstName', e.target.value, e.target.value !== "" ? true : false)
                                  updateData({ firstName: e.target.value })
                              }}
                              value={data.firstName}
                              className={clsx(
                                  'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                  {
                                      'is-invalid': formik.touched.firstName && formik.errors.firstName,
                                  },
                                  {
                                      'is-valid': formik.touched.firstName && !formik.errors.firstName,
                                  }
                              )}
                          />
                          {formik.touched.firstName && formik.errors.firstName && (
                              <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                      <span role='alert'>{formik.errors.firstName}</span>
                                  </div>
                              </div>
                          )}
                      </div>
                      
                      <div className='col-lg-4 mb-8'>
                          <label className='form-label fs-6'>
                              {intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.LASTNAME'})}
                          </label>
                          <input
                              placeholder={intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.LASTNAME'})}
                              type='text'
                              autoComplete='off'
                              name='lastName'
                              onChange={(e) => {
                                  formik.setFieldValue('lastName', e.target.value, e.target.value !== "" ? true : false)
                                  updateData({ lastName: e.target.value })
                              }}
                              value={data.lastName}
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

                      <div className='col-lg-4 mb-8'>
                          <label className='form-label fs-6'>
                              {intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.EMAIL'})}
                          </label>
                          <input
                              placeholder={intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.EMAIL'})}
                              type='email'
                              autoComplete='off'
                              name='email'
                              onChange={(e) => {
                                  formik.setFieldValue('email', e.target.value, e.target.value !== "" ? true : false)
                                  updateData({ email: e.target.value })
                              }}
                              value={data.email}
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

                      <div className='col-lg-4 mb-8'>
                          <label className='form-label fs-6'>{intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.EXPERTISE'})}</label>
                          <input
                              placeholder={intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.EXPERTISE'})}
                              type='text'
                              autoComplete='off'
                              name='expertise'
                              onChange={(e) => {
                                  formik.setFieldValue('expertise', e.target.value, e.target.value !== "" ? true : false)
                                  updateData({ expertise: e.target.value })
                              }}
                              value={data.expertise}
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
                          {/* <select
                              {...formik.getFieldProps('expertise')}
                              className={clsx(
                                  'form-control rounded-pill form-control-lg form-select border border-1 border-gray-900',
                                  {
                                      'is-invalid': formik.touched.expertise && formik.errors.expertise,
                                  },
                                  {
                                      'is-valid': formik.touched.expertise && !formik.errors.expertise,
                                  }
                              )}
                              value={data.expertise}
                              onChange={(e) => {
                                  formik.setFieldValue('expertise', e.target.value, e.target.value !== "" ? true : false)
                                  updateData({ expertise: e.target.value })
                              }}
                          >
                              <option value=''>Select Area of Expertise...</option>
                              { 
                                  !isLoading && categoryies &&
                                  categoryies.length > 0 && 
                                  categoryies.map((element, index) => {
                                      return <option value={element.id} key={index}>{element.name}</option>
                                  })
                              }
                          </select> */}

                          {formik.touched.expertise && formik.errors.expertise && (
                              <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                      <span role='alert'>{formik.errors.expertise}</span>
                                  </div>
                              </div>
                          )}
                      </div>
                      
                      {
                        dataModel.edit === null &&
                        (<>
                          <div className='col-lg-4 mb-8'>
                            <label className='form-label fs-6'>{intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.PASSWORD'})}</label>
                            <input
                                placeholder={intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.PASSWORD'})}
                                type='password'
                                autoComplete='off'
                                name='password'
                                onChange={(e) => {
                                    formik.setFieldValue('password', e.target.value, e.target.value !== "" ? true : false)
                                    updateData({ password: e.target.value })
                                }}
                                value={data.password}
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
                              {formik.touched.password && formik.errors.password && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.password}</span>
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className='col-lg-4 mb-8'>
                            <label className='form-label fw-semibold text-dark fs-6'>{intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.CONFIRMPASSWORD'})}</label>
                            <input
                                placeholder={intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.CONFIRMPASSWORD'})}
                                type='password'
                                autoComplete='off'
                                name='confirmpasword'
                                onChange={(e) => {
                                    formik.setFieldValue('confirmpasword', e.target.value, e.target.value !== "" ? true : false)
                                    updateData({ confirmpasword: e.target.value })
                                }}
                                value={data.confirmpasword}
                                className={clsx(
                                  'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                  {
                                      'is-invalid': formik.touched.confirmpasword && formik.errors.confirmpasword,
                                  },
                                  {
                                      'is-valid': formik.touched.confirmpasword && !formik.errors.confirmpasword,
                                  }
                                )}
                            />
                            {formik.touched.confirmpasword && formik.errors.confirmpasword && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  <span role='alert'>{formik.errors.confirmpasword}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </>) 
                      }
                    
                  </div>
                  {/* end::Form row */}

                  <div className='separator separator-dashed my-10'></div>

                  {/* begin::Form row */}
                  <div className='row'>
                      <div className='col-lg-12 text-end'>
                          <Link to='/dashboard'>
                              <button
                                  type='button'
                                  className='btn btn-color-gray-600 btn-active-light-primary fw-bolder px-6 py-3 me-3'
                              >
                                  {intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.CANCEL'})}
                              </button>
                          </Link>
                          <button
                              type='submit'
                              className='btn themebtnblue fw-bolder px-6 py-3'
                              style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
                              disabled={formik.isSubmitting || !formik.isValid}
                          >
                              {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'ADMIN.INSTRUCTOR.FORM.SAVE'})}</span>}
                              {loading && (
                                  <span className='indicator-progress' style={{ display: 'block' }}>
                                      Please wait...{' '}
                                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                  </span>
                              )}
                          </button>
                      </div>
                  </div>
                  {/* end::Form row */}
              </div>
          </form>
      }
  </>
)
}

export {InstructorForm}