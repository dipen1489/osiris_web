/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../../_metronic/layout/core'
import { useFormik } from "formik";
import { IBroadcast, initialValues } from './BroadcastModel'
import * as Yup from 'yup'
import clsx from "clsx";
import { useQueryResponse, useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { toast } from 'react-hot-toast';
import { BroadcastUserType } from '../request/_models';
import { MultiSelect } from "react-multi-select-component";
import { postBroadcastMail } from '../request/_requests';
import { useQueryRequest } from './core/QueryRequestProvider';

const BroadcastMessage: FC = () => {
    const intl = useIntl()
    const [data, setData] = useState<IBroadcast>(initialValues)
    
    const {updateState} = useQueryRequest()
    const {refetch} = useQueryResponse()

    const dataModel: BroadcastUserType[] = useQueryResponseData()
    const isLoading = useQueryResponseLoading()

    const [recipientsDataSet, setRecipientsDataSet] = useState<any>([])
    const [recipientsDataValue, setRecipientsDataValue] = useState<any>([])
    const updateData = (fieldsToUpdate: Partial<IBroadcast>) => {
        const updatedData = { ...data, ...fieldsToUpdate }
        setData(updatedData)
    }

    useEffect(() => {
        for(var i = 0; i < dataModel.length; i++) {
            if(data.usertype.instructor && dataModel[i].role === 'instructor'){
                const recipients = { label: dataModel[i].firstName + " " + dataModel[i].lastName, value: dataModel[i].email }
                recipientsDataSet.push(recipients);
            }
            if(data.usertype.student && dataModel[i].role === 'student'){
                const recipients = { label: dataModel[i].firstName + " " + dataModel[i].lastName, value: dataModel[i].email }
                recipientsDataSet.push(recipients);
            }
        }
    }, [!isLoading])
    
    const usertypeUpdate = (usertype: string) => {
        updateState({role: usertype})
        setTimeout(() => {
            refetch()
        }, 1000)
    }

    const meetingSchema = Yup.object().shape({
        recipients: Yup
        .array().min(1,"Please select atleast 1 recipient")
        .max(499,"You have selected more than 499 recipients. Please deselect")
        .required("Please select recipients"),
        subject: Yup.string()
            .min(3, 'Minimum 3 Characters')
            .max(150, 'Maximum 150 Characters')
            .required('Subject is required'),
        description: Yup.string()
            .min(0, 'Minimum 0 charaters')
            .max(5000, 'Maximum 5000 charaters')
            .required('Description is required'),
    })

    const formik = useFormik({
        enableReinitialize:true,
        validateOnChange:true,
        validateOnBlur:true,
        initialValues,
        validationSchema: meetingSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            try {
                const email: any = []
                for (let i = 0; i < recipientsDataValue.length; i++) {
                    email.push(recipientsDataValue[i].value);
                }
                
                if(email.length > 499){
                    formik.setFieldError('recipients', 'Recipients should not be more than 499 users')
                    return
                }

                const meetingData = {
                    recipients: email.join(','),
                    subject: data.subject,
                    description: data.description,
                }
                const sessionResponse : any = await postBroadcastMail(meetingData)
              
                if(sessionResponse.data.message !== ""){
                    formik.handleReset(values)
                    setData(initialValues)
                    recipientsDataValue.splice(0)
                    toast.success(sessionResponse.data.message);
                    setSubmitting(false)
                }
                else{
                    toast.error("Opps! there is some error please try again...");
                    setSubmitting(false)
                }
            } 
            catch (error) {
                console.error(error)
                setStatus('Opps! something went wrong')
                setSubmitting(false)
            }
        },
    })

    return (
        <>
            <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.BROADCAST' })}</PageTitle>
            <form className='form d-flex flex-center' onSubmit={formik.handleSubmit}>
                <div className='card-body py-10'>
                    {formik.status && (
                        <div className='mb-lg-15 alert alert-danger'>
                            <div className='alert-text font-weight-bold'>{formik.status}</div>
                        </div>
                    )}
                    <div className='row mb-8'>
                        <div className='col-lg-12 mb-8  d-flex'>
                            <label className='form-check form-check-custom form-check-solid me-10'>
                                <input
                                    className='form-check-input'
                                    name='usertype'
                                    type='radio'
                                    defaultChecked={data.usertype.instructor}
                                    onChange={() => {
                                        recipientsDataSet.splice(0)
                                        usertypeUpdate('instructor')
                                        updateData({
                                            usertype: {
                                                instructor: true,
                                                student: false,
                                            },
                                        })
                                    }}
                                />
                                <span className='ps-2 fs-6'>{intl.formatMessage({id: 'ADMIN.BROADCAST.USERTYPE.INSTRUCTOR'})}</span>
                            </label>
                            <label className='form-check form-check-custom form-check-solid me-5'>
                                <input
                                    className='form-check-input'
                                    name='usertype'
                                    type='radio'
                                    defaultChecked={data.usertype.student}
                                    onChange={() => {
                                        recipientsDataSet.splice(0)
                                        usertypeUpdate('student')
                                        updateData({
                                            usertype: {
                                                instructor: false,
                                                student: true,
                                            },
                                        })
                                    }}
                                />
                                <span className='ps-2 fs-6'>{intl.formatMessage({id: 'ADMIN.BROADCAST.USERTYPE.STUDENT'})}</span>
                            </label>
                        </div>

                        <div className='col-lg-8 mb-8'>
                            <label className='form-label fs-6'>
                                {intl.formatMessage({id: 'BROADCAST.SUBJECT'})}
                            </label>
                            <input
                                placeholder={intl.formatMessage({id: 'BROADCAST.SUBJECT'})}
                                type='text'
                                autoComplete='off'
                                name='subject'
                                onChange={(e) => {
                                    formik.setFieldValue('subject', e.target.value, e.target.value.trim() != "" ? true : false)
                                    updateData({ subject: e.target.value })
                                }}
                                value={data.subject}
                                className={clsx(
                                    'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                    {
                                        'is-invalid': formik.touched.subject && formik.errors.subject,
                                    },
                                    {
                                        'is-valid': formik.touched.subject && !formik.errors.subject,
                                    }
                                )}
                            />
                            {formik.touched.subject && formik.errors.subject && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.subject}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='col-lg-4 mb-8'>
                            <label className='form-label fs-6'>{intl.formatMessage({id: 'BROADCAST.RECIPIENTS'})}</label>
                            <MultiSelect
                                isLoading={isLoading}
                                className={clsx(
                                    'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                    {
                                        'is-invalid': formik.touched.recipients && formik.errors.recipients,
                                    },
                                    {
                                        'is-valid': formik.touched.recipients && !formik.errors.recipients,
                                    }
                                )}
                                options={recipientsDataSet}
                                value={recipientsDataValue}
                                onChange={(e: any) => {
                                    setRecipientsDataValue(e)
                                    formik.setFieldValue('recipients', e, e.length > 0 ? true : false)
                                }}
                                labelledBy="Select Recipients"
                            />
                            {formik.touched.recipients && formik.errors.recipients && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.recipients}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='col-lg-12 mb-8'>
                            <label className='form-label fs-6'>{intl.formatMessage({id: 'BROADCAST.DESCRIPTION'})}</label>
                            <textarea
                                placeholder={intl.formatMessage({id: 'BROADCAST.DESCRIPTION'})}
                                name='description'
                                onChange={(e) => {
                                    formik.setFieldValue('description', e.target.value, e.target.value.trim() != "" ? true : false)
                                    updateData({ description: e.target.value })
                                }}
                                value={data.description}
                                rows={6}
                                className={clsx(
                                    'form-control form-control-lg border border-1 border-gray-900',
                                    {
                                        'is-invalid': formik.touched.description && formik.errors.description,
                                    },
                                    {
                                        'is-valid': formik.touched.description && !formik.errors.description,
                                    }
                                )}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.description}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='separator separator-dashed my-10'></div>

                    <div className='row'>
                        <div className='col-lg-12 text-end'>
                            <button
                                type='submit'
                                className='btn themebtnblue fw-bolder px-6 py-3'
                                style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
                                disabled={formik.isSubmitting || !formik.isValid}
                            >
                                {!formik.isSubmitting && <span className='indicator-label'>Send</span>}
                                {formik.isSubmitting && (
                                    <span className='indicator-progress' style={{ display: 'block' }}>
                                        Please wait...{' '}
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export { BroadcastMessage }