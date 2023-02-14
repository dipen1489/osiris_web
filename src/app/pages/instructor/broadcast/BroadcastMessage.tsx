/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, Key } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../../_metronic/layout/core'
import { useFormik } from "formik";
import { IBroadcast, initialValues } from './BroadcastModel'
import * as Yup from 'yup'
import clsx from "clsx";
import { useAuth } from "../../../modules/auth";
import 'react-day-picker/dist/style.css';
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { getBroadcastMail, getOccurrenceByMeeting } from './core/_requests';
import { toast } from 'react-hot-toast';
import { MeetingData, MeetingDataList } from '../dashboard/core/_models';
import { Occurrence } from './core/_models';
import { Loader } from '../../component/Loader';
import { format } from 'date-fns';
import { MultiSelect } from "react-multi-select-component";

const BroadcastMessage: FC = () => {
    const intl = useIntl()
    const [loading, setLoading] = useState(false)
    const [loadingRecipt, setLoadingRecipt] = useState(false)
    const dataModel: MeetingDataList | any  = useQueryResponseData()
    const isLoading = useQueryResponseLoading()

    const [data, setData] = useState<IBroadcast>(initialValues)
    const [occurrenceData, setOccurrenceData] = useState<Occurrence>()
    const [recipientsData, setRecipientsData] = useState<any>([])
    const [recipientsDataSet, setRecipientsDataSet] = useState<any>([])
    const [recipientsDataValue, setRecipientsDataValue] = useState<any>([])
    const updateData = (fieldsToUpdate: Partial<IBroadcast>) => {
        const updatedData = { ...data, ...fieldsToUpdate }
        setData(updatedData)
    }

    const recipientSelect = (data: any) => {
        const reciptdata = JSON.parse(data!);
        for(var i = 0; i < reciptdata.length; i++) {
            const recipients = { label: reciptdata[i].name, value: reciptdata[i].email }
            recipientsDataSet.push(recipients);
        }
        setLoadingRecipt(false)
    }
    
    const OccurrenceSelect = (e: any) => {
        setRecipientsDataValue([])
        setRecipientsData([]);
        formik.setFieldValue('start_date', e.target.value, e.target.value !== "" ? false : true)
        setRecipientsData(e.target.options[e.target.selectedIndex].dataset.user)
        updateData({ start_date: e.target.value })
        setLoadingRecipt(true)
        setTimeout(() => {
            recipientSelect(e.target.options[e.target.selectedIndex].dataset.user)
        }, 100);
        
    }

    const meetingSchema = Yup.object().shape({
        title: Yup.string()
            .required('Please select session'),
        start_date: Yup.string()
            .required('Please select date'),
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
                    meeting: data.title,
                    occurrenceDate: data.start_date
                }
                const sessionResponse : any = await getBroadcastMail(meetingData)
              
                if(sessionResponse.data.message !== ""){
                    formik.handleReset(values)
                    setData(initialValues)
                    recipientsDataSet.splice(0)
                    recipientsDataValue.splice(0)
                    setOccurrenceData({data: [], error: []})
                    // toast.success("Message broadcast successfully..." );
                    toast.success(sessionResponse.data.message);
                    setSubmitting(false)
                    setLoading(false)
                }
                else{
                    toast.error("Opps! there is some error please try again...");
                    setSubmitting(false)
                    setLoading(false)
                }
            } 
            catch (error) {
                console.error(error)
                setStatus('Opps! something went wrong')
                setSubmitting(false)
                setLoading(false)
            }
        },
    })

    const handleSessionClick = async (id: string) => {
        try {
            setLoading(true)
            formik.setFieldValue('start_date', '', true)
            await getOccurrenceByMeeting(id).then(
              (response) => {
                setOccurrenceData(response)
                setLoading(false)
                return
              },
              (error) => {
                const resMessage =
                (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
                (error.response.data.message || error.response.data.error.message) ||
                    error.toString();
                    setLoading(false)
                toast.error(resMessage)
              });
        } 
        catch (error) {
        }
    };

    return (
        <>
            <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.BROADCAST' })}</PageTitle>
            {
                isLoading ? 
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
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'BROADCAST.TITLE'})}</label>
                                <select
                                    {...formik.getFieldProps('title')}
                                    className={clsx(
                                        'form-control rounded-pill form-control-lg border form-select border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.title && formik.errors.title,
                                        },
                                        {
                                            'is-valid': formik.touched.title && !formik.errors.title,
                                        }
                                    )}
                                    value={data.title}
                                    onChange={(e) => {
                                        formik.setFieldValue('title', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ title: e.target.value })
                                        handleSessionClick(e.target.value)
                                    }}
                                >
                                    <option value=''>Select Session...</option>
                                    { 
                                        dataModel.length > 0 && 
                                        dataModel.map((element: MeetingData, index: Key | null | undefined) => {
                                            return <option value={element.id} key={index}>{element.title}</option>
                                        })
                                    }
                                </select>

                                {formik.touched.title && formik.errors.title && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.title}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'BROADCAST.DATE'})}</label>
                                {
                                    loading ? 
                                    <Loader classes='form-control rounded-pill form-control-lg border form-select border-1 border-gray-900' display='contents' position='inherit' message='Loading occurrence data...' addCustomStyles={true} iconWidth={36} /> :  
                                    <select
                                        {...formik.getFieldProps('start_date')}
                                        className={clsx(
                                            'form-control rounded-pill form-control-lg border form-select border-1 border-gray-900',
                                            {
                                                'is-invalid': formik.touched.start_date && formik.errors.start_date,
                                            },
                                            {
                                                'is-valid': formik.touched.start_date && !formik.errors.start_date,
                                            }
                                        )}
                                        value={data.start_date}
                                        onChange={(e) => {
                                            recipientsDataSet.splice(0)
                                            OccurrenceSelect(e);
                                        }}
                                    >
                                        <option value='' data-user={JSON.stringify([])}>Select Date...</option>
                                        { 
                                            occurrenceData && occurrenceData.data.length > 0 &&
                                            occurrenceData.data.map((element, index) => {
                                                return <option value={element.start_time} key={index} data-user={JSON.stringify(element.enrolled_users)}>{format(new Date(element.start_time), 'y-MM-dd HH:mm')}</option>
                                            })
                                        }
                                    </select>
                                }
                                
                                {formik.touched.start_date && formik.errors.start_date && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.start_date}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'BROADCAST.RECIPIENTS'})}</label>
                                <MultiSelect
                                    isLoading={loadingRecipt}
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
            }
        </>
    )
}

export { BroadcastMessage }