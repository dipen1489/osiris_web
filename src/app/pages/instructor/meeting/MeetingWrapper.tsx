/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEventHandler, FC, useRef, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../../_metronic/layout/core'
import { useFormik } from "formik";
import { IMeeting, initialValues } from './MeetingModel'
import * as Yup from 'yup'
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import moment from "moment";
import { useAuth } from "../../../modules/auth";
import { format, isValid, parse } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { usePopper } from 'react-popper';
import FocusTrap from 'focus-trap-react';
import Compressor from 'compressorjs';
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { MeetingAddEditModel, PreferenceCategory } from './core/_models';
import { createSession, updateSession } from './core/_requests';
import { toast } from 'react-hot-toast';
import { Timezone } from '../../component/core/_Models';
import { UsersListLoading } from './components/loading/UsersListLoading';
import { imgTobase64String, uint8array } from '../../../modules/helper';
import Axios from 'axios';
import { Loader } from '../../component/Loader';

const MeetingWrapper: FC = () => {
    const intl = useIntl()
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [isEditDisable, setIsEditDisable] = useState<boolean>(false)
    
    const navigate = useNavigate();
    const dataModel: MeetingAddEditModel | any  = useQueryResponseData()

    const [categoryies, setCategoryies] = useState<PreferenceCategory[]>()

    const isLoading = useQueryResponseLoading()
    const [compressedFile, setCompressedFile] = useState({});
    
    const [data, setData] = useState<IMeeting>(initialValues)
    const [file, setSelectedFile] = useState({
        image: false,
        imageName: '',
        imgData: {}
    });
    
    const [imgUrl, setImgUrl] = useState<any>(toAbsoluteUrl('/img/blank.svg'));
    const [imgDeleteToken, setImgDeleteToken] = useState<string>("");

    const updateData = (fieldsToUpdate: Partial<IMeeting>) => {
        const updatedData = { ...data, ...fieldsToUpdate }
        setData(updatedData)
    }

    // const today = new Date();
    const today = moment().toDate()
    const [selectedStartDay, setSelectedStartDay] = useState<Date>(today);

    const [startDate, setStartDate] = useState<string>('');
    const [isStartDatePopperOpen, setIsStartDatePopperOpen] = useState<boolean>(false);

    const popperRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [popperStartDateElement, setPopperStartDateElement] = useState<HTMLDivElement | null>(
        null
    );
    
    const popper = usePopper(popperRef.current, popperStartDateElement, {
        placement: 'bottom-start'
    });
    
    const [isRecurrence, setIsRecurrence] = useState<boolean>(false);
    const [weeklyDaysLST, setWeeklyDaysLST] = useState<number[]>([]);

    const addSomeMinutesToTime = (startTime: string | Date, minutestoAdd: number) => {
        const dateObj = new Date(startTime);
        dateObj.setMinutes(dateObj.getMinutes() + minutestoAdd - 1);
        const newDateInNumber = dateObj.setSeconds(59);
        const processedTime = new Date(newDateInNumber).toISOString();
        return processedTime;
    }

    //END DATE 
    const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(today);
    const [inputEndDateValue, setInputEndDateValue] = useState<string>('');
    const [isPopperEndOpen, setIsPopperEndOpen] = useState(false);
    
    const handleInputEndDateChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setInputEndDateValue(e.currentTarget.value);
        const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
        if (isValid(date)) {
            setSelectedEndDate(date);
        } else {
            setSelectedEndDate(undefined);
        }
    };

    const handleEndDateSelect = (date?: Date) => {
        setSelectedEndDate(date);
        if (date) {
            formik.setFieldValue('end_date_time', format(date, 'y-MM-dd'), false)
            setInputEndDateValue(format(date, 'y-MM-dd'));
            setEndDateTimeError(false)
            closePopper();
        } else {
            setInputEndDateValue('');
        }
    };

    const handleButtonEndClick = () => {
        setIsPopperEndOpen(true);
    };

    const [recurrenceType, setRecurrenceType] = useState<String>("1")

    const [occursOnDay, setOccursOnDay] = useState<Boolean>(false)
    const [occursOnWeek, setOccursOWeek] = useState<Boolean>(true)

    const closePopper = () => {
        setIsStartDatePopperOpen(false);
        setIsPopperEndOpen(false);
        buttonRef?.current?.focus();
    };
    
    useEffect(() => {
        formik.setFieldValue('repeat_interval', 0, false)
    })

    const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

    const meetingSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, 'Minimum 3 Characters')
            .max(50, 'Maximum 50 Characters')
            .required('Meeting title is required'),
        start_date: Yup.date()
            .required('Date is required'),
        start_time: Yup
            .string()
            .required("Start time cannot be empty"),
        duration: Yup
            .string()
            .required("Duration cannot be empty"),
        max_student: Yup.number()
            .required('Maximum number of students is required'),
        equipments_required: Yup.string()
            .required('Equipment needed is required'),
        timezone: Yup.string()
            .required('Timezone is required'),
        price: Yup.number()
            .min(0, 'Minimum 0 price')
            .max(1000, 'Maximum 1000 price')
            .required('Price is required'),
        category_id: Yup.string()
            .required('Category is required'),
        visibility: Yup.string()
            .required('Visibility is required'),
        description: Yup.string()
            .min(0, 'Minimum 0 charaters')
            .max(1000, 'Maximum 1000 charaters')
            .required('Description is required'),
        image: Yup
            .mixed()
            .required('A visual description image is required')
           // .test('fileType', "Only the following formats are accepted: .jpeg, .jpg, .png", (value) => value === null || (value && SUPPORTED_FORMATS.includes(value.type))),
    })

    const [endDateTimeError, setEndDateTimeError] = useState<Boolean>(false)
    const [occurredDayError, setOccurredDayError] = useState<Boolean>(false)

    const formik = useFormik({
        enableReinitialize:true,
        validateOnChange:true,
        validateOnBlur:true,
        initialValues,
        validationSchema: meetingSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            if(isRecurrence && inputEndDateValue === ""){
                setEndDateTimeError(true)
                return
            }

            if(isRecurrence && recurrenceType === "2" && weeklyDaysLST.length === 0){
                setOccurredDayError(true)
                return
            }

            setSubmitting(true)
            setLoading(true)
            const dtms: string = moment(`${data.start_date} ${data.start_time}`, 'YYYY-MM-DD HH:mm:ss').format();
            //const endtime: string = isRecurrence ? moment(`${inputEndDateValue} ${data.start_time}`, 'YYYY-MM-DD HH:mm:ss').format() : dtms
            const endtime: string = isRecurrence ? moment(moment(`${inputEndDateValue} 23:59:59`).subtract(moment(`${inputEndDateValue} 23:59:59`).utcOffset(),'minutes').utc(), 'YYYY-MM-DD HH:mm:ss').format() : dtms
            const dtsmm = moment(endtime).utcOffset(0, true).format();
            // end_date_time: moment.utc(moment(addSomeMinutesToTime(dtsmm, parseInt(data.duration)))).format(),
            try {
                var recurrence: any;
                if(!isRecurrence || recurrenceType === "1"){
                    recurrence = {
                        end_date_time: dtsmm,
                        type : 1,
                        repeat_interval: values.repeat.repeat_interval
                    }
                }

                else if(isRecurrence && recurrenceType === "2"){
                    recurrence = {
                        end_date_time: dtsmm,
                        type : 2,
                        repeat_interval: values.repeat.repeat_interval,
                        weekly_days: weeklyDaysLST.filter((x, i, a) => a.indexOf(x) === i).toString(),
                    }
                }

                else if(isRecurrence && recurrenceType === "3" && occursOnDay === false){
                    recurrence = {
                        end_date_time: dtsmm,
                        type : 3,
                        repeat_interval: values.repeat.repeat_interval,
                        monthly_day: data.repeat.monthlydays.day,
                    }
                }

                else if(isRecurrence && recurrenceType === "3" && occursOnDay === true){
                    recurrence = {
                        end_date_time: dtsmm,
                        type : 3,
                        repeat_interval: values.repeat.repeat_interval,
                        monthly_week: data.repeat.weekly.monthly_weekday,
                        monthly_week_day: data.repeat.weekly.monthly_week_day,
                    }
                }
                // image: {name: file.imageName, data: Object.values(compressedFile)},
                // timezone: data.timezone,
                const meetingData = {
                    owner: currentUser?.id,
                    email: currentUser?.email,
                    equipments_required: values.equipments_required.trim().split(','),
                    host_name: currentUser?.firstname + " " + currentUser?.lastName,
                    price: parseInt(data.price),
                    max_student: data.max_student,
                    category_id: data.category_id,
                    image: {name: imgUrl, delete_token: imgDeleteToken},
                    visibility: data.visibility,
                    meeting: {
                        topic: data.title,
                        type: 8,
                        start_time: moment.utc(moment(dtms)).format(),
                        duration: data.duration,
                        agenda: data.description,
                        recurrence
                    },
                }
                const sessionResponse : any = dataModel.edit === null ? await createSession(meetingData) : await updateSession(meetingData, dataModel.edit.data.id)
                if(sessionResponse.owner_joinlink !== ""){
                    toast.success(dataModel.edit === null ? "Session Created Successfully" : "Session Updated Successfully" );
                    setTimeout(() => {
                        return navigate('/dashboard')
                    }, 1000)
                }
                else{
                    toast.error("Opps! there is some error please try again...");
                    setSubmitting(false)
                    setLoading(false)
                }
            } catch (error) {
                console.error(error)
                setStatus('The meeting save has some error')
                setSubmitting(false)
                setLoading(false)
            }
        },
    })

    //  START DATE UPDATE FUNCTION START
    const handleStartDateChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setStartDate(e.currentTarget.value);
        const date = parse(e.currentTarget.value, 'y-MM-dd', new Date());
        if (isValid(date)) {
            setSelectedStartDay(date);
        } else {
            setSelectedStartDay(today);
        }
    };

    const handleStartDateClick = () => {
        setIsStartDatePopperOpen(true);
    };

    const handleStartDaySelect = (date?: Date) => {
        if (date) {
            setSelectedStartDay(date);
            formik.setFieldValue('start_date', format(date, 'y-MM-dd'), false)
            updateData({ start_date: format(date, 'y-MM-dd') })
            setStartDate(format(date, 'y-MM-dd'));
            closePopper();
        } else {
            setStartDate('');
        }
    };

    useEffect(() => {
        if(dataModel.category){
            setCategoryies(dataModel.category.data)
        }
        
        if(dataModel.edit !== null && dataModel.edit){
            setIsEditDisable(true)
            setLoading(true)
            setStartDate(format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd'));
            setSelectedStartDay(new Date(dataModel.edit.data.meeting_param.start_time));
            setSelectedEndDate(new Date(dataModel.edit.data.meeting_param.recurrence.end_date_time));
            setInputEndDateValue(format(new Date(dataModel.edit.data.meeting_param.recurrence.end_date_time), 'y-MM-dd'));
            updateData({ title: dataModel.edit.data.title })
            setCompressedFile(dataModel.edit.data.image)
            setImgUrl(dataModel.edit.data.image)
            setImgDeleteToken(dataModel.edit.data.delete_image_token)
            // const arrayBuffer = dataModel.edit.data.image.data.data as ArrayLike<number> | ArrayBuffer
            // const base64String = imgTobase64String(uint8array(arrayBuffer))
            setIsRecurrence(dataModel.edit.data.meeting_param.recurrence.type === 1 ? false : true)
            setRecurrenceType(dataModel.edit.data.meeting_param.recurrence.type.toString())
            setSelectedFile({
                image: true,
                imageName: dataModel.edit.data.image.name,
                imgData: `data:image/png;base64`,
            })
            const daysdt: number[] = dataModel.edit.data.meeting_param.recurrence?.weekly_days ? Array.from(dataModel.edit.data.meeting_param.recurrence?.weekly_days.split(','),Number) : []
            if(dataModel.edit.data.meeting_param.recurrence.type === 2){
                setWeeklyDaysLST(daysdt)
            }
        
            if(dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_day){
                setOccursOnDay(false)
                setOccursOWeek(true)
            }

            if(dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_week){
                setOccursOnDay(true)
                setOccursOWeek(false)
            }
            

            formik.setFieldValue('title', dataModel.edit.data.title, dataModel.edit.data.title !== "" ? false : true)
            formik.setFieldValue('start_date', format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd'), format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd') !== "" ? false : true)
            formik.setFieldValue('start_time', format(new Date(dataModel.edit.data.meeting_param.start_time), 'HH:mm'), format(new Date(dataModel.edit.data.meeting_param.start_time), 'HH:mm') !== "" ? false : true)
            formik.setFieldValue('equipments_required', dataModel.edit.data.equipments_required.toString(), dataModel.edit.data.equipments_required.toString() !== "" ? false : true)
            formik.setFieldValue('price', dataModel.edit.data.price, dataModel.edit.data.price !== "" ? false : true)
            formik.setFieldValue('category_id', dataModel.edit.data.category_id, dataModel.edit.data.category_id !== "" ? false : true)
            formik.setFieldValue('image', dataModel.edit.data.image, dataModel.edit.data.image !== "" ? false : true)
            formik.setFieldValue('description', dataModel.edit.data.description, dataModel.edit.data.description !== "" ? false : true)

            const editValues = {
                title: dataModel.edit.data.title,
                start_date: dataModel.edit.data.meeting_param.start_time,
                start_time: format(new Date(dataModel.edit.data.meeting_param.start_time), 'HH:mm'),
                duration: dataModel.edit.data.meeting_param.duration,
                max_student: dataModel.edit.data.schedule[0].max_users,
                equipments_required: dataModel.edit.data.equipments_required.toString(),
                timezone: dataModel.edit.data.meeting_param.timezone,
                price: dataModel.edit.data.price,
                category_id: dataModel.edit.data.category_id,
                visibility:  dataModel.edit.data.visibility,
                image: dataModel.edit.data.image,
                description: dataModel.edit.data.description,
                repeat: {
                    recurrence: ((format(new Date(dataModel.edit.data.meeting_param.start_time), 'y-MM-dd') === format(new Date(dataModel.edit.data.meeting_param.recurrence.end_date_time), 'y-MM-dd')) && dataModel.edit.data.meeting_param.recurrence.type === 1) ? false : true,
                    rtype: dataModel.edit.data.meeting_param.recurrence.type,
                    end_date_time: dataModel.edit.data.meeting_param.recurrence.end_date_time,
                    repeat_interval: 0,
                    weekly_days: {
                        sun: daysdt.includes(1) === true ? true : false,
                        mon: daysdt.includes(2) === true ? true : false,
                        tue: daysdt.includes(3) === true ? true : false,
                        wed: daysdt.includes(4) === true ? true : false,
                        thu: daysdt.includes(5) === true ? true : false,
                        fri: daysdt.includes(6) === true ? true : false,
                        sat: daysdt.includes(7) === true ? true : false,
                    },
                    monthly:{
                        monthly_day: (dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_day ) ? true : false,
                        monthly_week: (dataModel.edit.data.meeting_param.recurrence.type === 3 && dataModel.edit.data.meeting_param.recurrence?.monthly_week ) ? true : false,
                    },
                    monthlydays:{
                        day: dataModel.edit.data.meeting_param.recurrence?.monthly_day ? dataModel.edit.data.meeting_param.recurrence.monthly_day : 1,
                    },
                    weekly:{
                        monthly_weekday: dataModel.edit.data.meeting_param.recurrence?.monthly_week ? dataModel.edit.data.meeting_param.recurrence.monthly_week : 1,
                        monthly_week_day: dataModel.edit.data.meeting_param.recurrence?.monthly_week_day ? dataModel.edit.data.meeting_param.recurrence.monthly_week_day : 1,
                    }
                },
            }
            setData(editValues)
            setLoading(false)
        }
    },[!isLoading])

    const [isImgUploading, setIsImgUploading] = useState<boolean>(false);

    const uploadImage = (formData: any) => {
        const uninterceptedAxiosInstance = Axios.create();
        uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/image/upload", formData)
        .then((response) => {
            setIsImgUploading(false)
          setImgUrl(response.data.url)
          setImgDeleteToken(response.data.delete_token)
        },
        (error) => {
          const resMessage =
          (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)) ||
          (error.response.data.message || error.response.data.error.message) ||
              error.toString();
          toast.error(resMessage)
        });
    };
  
    const deleteImage = () =>{
      if(imgDeleteToken !== ""){
        const formData = new FormData()
        formData.append("token", imgDeleteToken);
  
        const uninterceptedAxiosInstance = Axios.create();
        uninterceptedAxiosInstance.post("https://api.cloudinary.com/v1_1/dxva2eqvo/delete_by_token", formData)
        .then(result =>{
        //   console.log('result : ',result);
        })
        .catch(error =>{
        //   console.log('error : ',error);
        })
      }
    }

    return (
        <>
            <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: dataModel.edit !== null ? 'MENU.EDITMEETING' : 'MENU.CREATEMEETING' })}</PageTitle>
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
                                    {intl.formatMessage({id: 'SESSION.TITLE'})}
                                </label>
                                <input
                                    placeholder={intl.formatMessage({id: 'SESSION.TITLE'})}
                                    type='text'
                                    autoComplete='off'
                                    name='title'
                                    onChange={(e) => {
                                        formik.setFieldValue('title', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ title: e.target.value })
                                    }}
                                    value={data.title}
                                    className={clsx(
                                        'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.title && formik.errors.title,
                                        },
                                        {
                                            'is-valid': formik.touched.title && !formik.errors.title,
                                        }
                                    )}
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.title}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.DATE'})}</label>
                                <input
                                    placeholder={format(new Date(), 'y-MM-dd')}
                                    value={startDate}
                                    name='start_date'
                                    onChange={handleStartDateChange}
                                    type='text'
                                    readOnly={true}
                                    autoComplete='off'
                                    disabled = {isEditDisable}
                                    onClick={handleStartDateClick}
                                    className={clsx(
                                        'form-control rounded-pill pointer form-control-lg border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.start_date && formik.errors.start_date,
                                        },
                                        {
                                            'is-valid': formik.touched.start_date && !formik.errors.start_date,
                                        }
                                    )}
                                />
                                {!isEditDisable && isStartDatePopperOpen && (
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
                                            ref={setPopperStartDateElement}
                                            role="dialog"
                                        >
                                            <DayPicker
                                                initialFocus={isStartDatePopperOpen}
                                                mode="single"
                                                fromDate={new Date()}
                                                // fromMonth={new Date()}
                                                // fromYear={new Date().getFullYear()} toYear={new Date().getFullYear() + 18}
                                                required
                                                defaultMonth={selectedStartDay}
                                                selected={selectedStartDay}
                                                showOutsideDays
                                                captionLayout="dropdown"
                                                onSelect={handleStartDaySelect}
                                            />
                                        </div>
                                    </FocusTrap>
                                )}

                                {formik.touched.start_date && formik.errors.start_date && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.start_date}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.TIME'})}</label>
                                <input
                                    placeholder={intl.formatMessage({id: 'SESSION.TIME'})}
                                    type='time'
                                    autoComplete='off'
                                    name='start_time'
                                    onChange={(e) => {
                                        formik.setFieldValue('start_time', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ start_time: e.target.value })
                                    }}
                                    disabled={isEditDisable}
                                    defaultValue={ data.start_time }
                                    value={data.start_time}
                                    className={clsx(
                                        'form-control pointer rounded-pill form-control-lg border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.start_time && formik.errors.start_time,
                                        },
                                        {
                                            'is-valid': formik.touched.start_time && !formik.errors.start_time,
                                        }
                                    )}
                                />
                                {formik.touched.start_time && formik.errors.start_time && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.start_time}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.MAXNOSTUDENT'})}</label>
                                <input
                                    placeholder={intl.formatMessage({id: 'SESSION.MAXNOSTUDENT'})}
                                    type='number'
                                    autoComplete='off'
                                    name='max_student'
                                    onChange={(e) => {
                                        formik.setFieldValue('max_student', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ max_student: parseInt(e.target.value) })
                                    }}
                                    defaultValue={ data.max_student }
                                    value={data.max_student}
                                    className={clsx(
                                        'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.max_student && formik.errors.max_student,
                                        },
                                        {
                                            'is-valid': formik.touched.max_student && !formik.errors.max_student,
                                        }
                                    )}
                                />
                                {formik.touched.max_student && formik.errors.max_student && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.max_student}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.EQUIPMENT'})}</label>
                                <input
                                    placeholder={intl.formatMessage({id: 'SESSION.EQUIPMENT'})}
                                    type='text'
                                    autoComplete='off'
                                    name='equipments_required'
                                    onChange={(e) => {
                                        formik.setFieldValue('equipments_required', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ equipments_required: e.target.value })
                                    }}
                                    defaultValue={ data.equipments_required }
                                    value={data.equipments_required}
                                    className={clsx(
                                        'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.equipments_required && formik.errors.equipments_required,
                                        },
                                        {
                                            'is-valid': formik.touched.equipments_required && !formik.errors.equipments_required,
                                        }
                                    )}
                                />
                                {formik.touched.equipments_required && formik.errors.equipments_required && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.equipments_required}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.DURATION'})}</label>
                                <select
                                    {...formik.getFieldProps('duration')}
                                    className={clsx(
                                        'form-control rounded-pill pointer form-control-lg form-select border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.duration && formik.errors.duration,
                                        },
                                        {
                                            'is-valid': formik.touched.duration && !formik.errors.duration,
                                        }
                                    )}
                                    disabled={isEditDisable}
                                    value={data.duration}
                                    onChange={(e) => {
                                        formik.setFieldValue('duration', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ duration: e.target.value })
                                    }}
                                >
                                    <option value=''>Select Duration...</option>
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">60 min</option>
                                    <option value="75">75 mins</option>
                                    <option value="90">90 mins</option>
                                    <option value="105">105 mins</option>
                                    <option value="120">120 mins</option>
                                    <option value="135">135 mins</option>
                                    <option value="150">150 mins</option>
                                    <option value="165">165 mins</option>
                                    <option value="180">180 mins</option>
                                    <option value="195">195 mins</option>
                                    <option value="210">210 mins</option>
                                    <option value="225">225 mins</option>
                                    <option value="240">240 mins</option>
                                    <option value="255">255 mins</option>
                                    <option value="270">270 mins</option>
                                    <option value="285">285 mins</option>
                                    <option value="300">300 mins</option>
                                    <option value="315">315 mins</option>
                                    <option value="330">330 mins</option>
                                    <option value="345">345 mins</option>
                                    <option value="360">360 mins</option>
                                    <option value="375">375 mins</option>
                                    <option value="390">390 mins</option>
                                    <option value="405">405 mins</option>
                                    <option value="420">420 mins</option>
                                    <option value="435">435 mins</option>
                                    <option value="450">450 mins</option>
                                    <option value="465">465 mins</option>
                                    <option value="480">480 mins</option>
                                </select>
                                {formik.touched.duration && formik.errors.duration && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.duration}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='col-lg-4 mb-8 d-none'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.TIMEZONE'})}</label>
                                <select
                                    {...formik.getFieldProps('timezone')}
                                    className={clsx(
                                        'form-control rounded-pill pointer form-control-lg border form-select border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.timezone && formik.errors.timezone,
                                        },
                                        {
                                            'is-valid': formik.touched.timezone && !formik.errors.timezone,
                                        }
                                    )}
                                    value={data.timezone}
                                    onChange={(e) => {
                                        formik.setFieldValue('timezone', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ timezone: e.target.value })
                                    }}
                                    // defaultValue={data.timezone}
                                >
                                    <option value=''>Select Timezone...</option>
                                    { 
                                        Timezone.length > 0 && 
                                        Timezone.map((element, index) => {
                                            return <option value={element.ID} key={index}>{element.Name}</option>
                                        })
                                    }
                                </select>

                                {formik.touched.timezone && formik.errors.timezone && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.timezone}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.PRICE'})}</label>
                                <input
                                    placeholder={intl.formatMessage({id: 'SESSION.PRICE'})}
                                    type='text'
                                    autoComplete='off'
                                    name='price'
                                    onChange={(e) => {
                                        formik.setFieldValue('price', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ price: e.target.value })
                                    }}
                                    defaultValue={ data.price }
                                    value={data.price}
                                    className={clsx(
                                        'form-control rounded-pill form-control-lg border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.price && formik.errors.price,
                                        },
                                        {
                                            'is-valid': formik.touched.price && !formik.errors.price,
                                        }
                                    )}
                                />
                                {formik.touched.price && formik.errors.price && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.price}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.CATEGORY'})}</label>
                                <select
                                    {...formik.getFieldProps('category_id')}
                                    className={clsx(
                                        'form-control rounded-pill pointer form-control-lg form-select border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.category_id && formik.errors.category_id,
                                        },
                                        {
                                            'is-valid': formik.touched.category_id && !formik.errors.category_id,
                                        }
                                    )}
                                    value={data.category_id}
                                    onChange={(e) => {
                                        formik.setFieldValue('category_id', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ category_id: e.target.value })
                                    }}
                                    // defaultValue={data.category}
                                >
                                    <option value=''>Select Category...</option>
                                    { 
                                        !isLoading && categoryies &&
                                        categoryies.length > 0 && 
                                        categoryies.map((element, index) => {
                                            return <option value={element.id} key={index}>{element.name}</option>
                                        })
                                    }
                                </select>

                                {formik.touched.category_id && formik.errors.category_id && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.category_id}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.VISIBILITY'})}</label>
                                <select
                                    {...formik.getFieldProps('visibility')}
                                    className={clsx(
                                        'form-control rounded-pill pointer form-control-lg form-select border border-1 border-gray-900',
                                        {
                                            'is-invalid': formik.touched.visibility && formik.errors.visibility,
                                        },
                                        {
                                            'is-valid': formik.touched.visibility && !formik.errors.visibility,
                                        }
                                    )}
                                    value={data.visibility}
                                    onChange={(e) => {
                                        formik.setFieldValue('visibility', e.target.value, e.target.value !== "" ? false : true)
                                        updateData({ visibility: e.target.value })
                                    }}
                                    // defaultValue={data.visibility}
                                >
                                    <option value="">Select Visibility...</option>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>

                                {formik.touched.visibility && formik.errors.visibility && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.visibility}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-4 mb-8 d-flex flex-column'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.IMAGE'})}</label>
                                <div className="image-input image-input-outline" style={{ backgroundImage: '/img/blank.svg' }} data-kt-image-input="true">
                                    {/* {   
                                        file && 
                                        file.image ? 
                                        (<img src={`${file.imgData}`} className="image-input-wrapper w-100 h-150px" style={{ objectFit: 'contain'}} alt='LOGO' />) : 
                                        (<img src={toAbsoluteUrl('/img/blank.svg')} className="image-input-wrapper w-100 h-150px" style={{ objectFit: 'contain'}} alt='LOGO' />)
                                    } */}

                                    { 
                                        isImgUploading ? 
                                        <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px p-4 start-0 left-0 top-0' position='inherit' message='Uploading...' addCustomStyles={false} iconWidth={36} /> :  
                                        (<>
                                            <img src={imgUrl} className="image-input-wrapper w-100 h-150px" style={{ objectFit: 'contain'}} alt='LOGO' />
                                            <label
                                                className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                                                data-kt-image-input-action="change"
                                                data-bs-toggle="tooltip"
                                                data-bs-dismiss="click"
                                                title="Change Photo">
                                                <i className="bi bi-pencil-fill fs-7"></i>
                                                <input
                                                    type="file"
                                                    onChange={({ currentTarget }) => {
                                                        const file = currentTarget.files![0];
                                                        const reader = new FileReader();
                                                        setIsImgUploading(true)
                                                        new Compressor(file, {
                                                        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                                                        success: async (compressedResult) => {
                                                            const ab = await compressedResult.arrayBuffer()
                                                            const ui8a = new Uint8Array(ab);
                                                            setCompressedFile(ui8a)
                                                            try {
                                                                const formData = new FormData();
                                                                formData.append("file",compressedResult);
                                                                formData.append("upload_preset","vl0x6a9w");
                                                                formData.append("folder","meetings/"); 
                                                                if(imgDeleteToken !== "") {
                                                                    deleteImage()
                                                                }
                                                                uploadImage(formData)
                                                            } catch (error) {
                                                                setIsImgUploading(false)
                                                                toast.error('Please try after some time')
                                                            }
                                                        },
                                                        });
                        
                                                        if (file) {
                                                            reader.onloadend = () => {
                                                                setSelectedFile({ image: true, imageName: file.name, imgData: reader.result! });
                                                            };
                                                            reader.readAsDataURL(file);
                                                            formik.setFieldValue("image", file);
                                                        }
                                                    }}
                                                    accept=".png, .jpg, .jpeg" />
                                                <input type="hidden" name="avatar_remove" />
                                            </label>
                                            <span
                                                className="btn btn-icon btn-circle btn-color-muted btn-active-color-primary w-25px h-25px bg-body shadow"
                                                data-kt-image-input-action="cancel"
                                                data-bs-toggle="tooltip"
                                                data-bs-dismiss="click"
                                                title="Cancel photo">
                                                <i className="bi bi-x fs-2"></i>
                                            </span>
                                        </>)
                                    }
                                
                                </div>
                                {formik.touched.image && formik.errors.image && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.image}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='col-lg-8 mb-8'>
                                <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.DESCRIPTION'})}</label>
                                <textarea
                                    placeholder={intl.formatMessage({id: 'SESSION.DESCRIPTION'})}
                                    name='description'
                                    onChange={(e) => {
                                        formik.setFieldValue('description', e.target.value, e.target.value !== "" ? false : true)
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

                            <div className='col-lg-12 mt-4 mb-8'>
                                <div className='form-check form-check-custom form-check-solid me-5'>
                                    <input
                                        className='form-check-input pointer'
                                        {...formik.getFieldProps('recurrence')}
                                        type='checkbox'
                                        id='inlineCheckbox1'
                                        disabled={isEditDisable}
                                        checked={data.repeat.recurrence}
                                        onChange={() => { 
                                                updateData({
                                                    repeat: {
                                                        ...data.repeat,
                                                        recurrence: !data.repeat.recurrence,
                                                    },
                                                })
                                                setIsRecurrence(!data.repeat.recurrence)
                                            }
                                        }
                                    />
                                    <label className='form-check-label pointer fw-bold' htmlFor='inlineCheckbox1'>
                                        {intl.formatMessage({id: 'SESSION.REPEATMEETING'})}
                                    </label>
                                </div>
                            </div>

                            {data.repeat.recurrence && (
                                <>
                                    <div className='col-lg-3 mb-8'>
                                        <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.RECURRENCE'})}</label>
                                        <select
                                            {...formik.getFieldProps('rtype')}
                                            className={clsx(
                                                'form-control rounded-pill pointer form-control-lg form-select border border-1 border-gray-900',
                                                {
                                                    'is-invalid': formik.touched.repeat?.rtype && formik.errors.repeat?.rtype,
                                                },
                                                {
                                                    'is-valid': formik.touched.repeat?.rtype && !formik.errors.repeat?.rtype,
                                                }
                                            )}
                                            onChange={(e) => {
                                                    updateData({
                                                        repeat: {
                                                            ...data.repeat,
                                                            rtype: parseInt(e.target.value),
                                                        },
                                                    })
                                                    formik.setFieldValue('rtype', e.target.value, false)
                                                    setRecurrenceType(e.target.value)
                                                }
                                            }
                                            disabled={isEditDisable}
                                            value={data.repeat.rtype}
                                            // defaultValue={data.repeat.type}
                                        >
                                            <option value="1">Daily</option>
                                            <option value="2">Weekly</option>
                                            <option value="3">Monthly</option>
                                        </select>

                                        {formik.touched.repeat?.rtype && formik.errors.repeat?.rtype && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert'>{formik.errors.repeat.rtype}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                
                                    {data.repeat.recurrence && recurrenceType === '3' && (
                                        <div className='col-lg-6 mb-8'>
                                            <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.OCCURSON'})}</label>
                                                <div className='fv-row'>
                                                    <div className="col-lg-12 d-flex align-items-center mt-3">
                                                        <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                            <input
                                                                className='form-check-input'
                                                                name='occurs_ons'
                                                                type='radio'
                                                                defaultChecked={data.repeat?.monthly?.monthly_day}
                                                                disabled={isEditDisable}
                                                                onChange={() => {
                                                                    setOccursOnDay(false)
                                                                    setOccursOWeek(true)
                                                                    updateData({
                                                                        repeat: {
                                                                            ...data.repeat,
                                                                            monthly: {
                                                                                monthly_day: !data.repeat?.monthly?.monthly_day,
                                                                                monthly_week: data.repeat?.monthly?.monthly_week
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                            <span className='ps-2 fs-6'>{intl.formatMessage({id: 'SESSION.DAY'})}</span>
                                                        </label>
                                                        <label className={'form-check form-check-custom form-check-solid'}>
                                                            <select
                                                                {...formik.getFieldProps('day')}
                                                                className={clsx(
                                                                    'form-control pointer rounded-pill form-control-lg form-select border border-1 border-gray-900',
                                                                    {
                                                                        'is-invalid': formik.touched.repeat?.monthlydays?.day && formik.errors.repeat?.monthlydays?.day,
                                                                    },
                                                                    {
                                                                        'is-valid': formik.touched.repeat?.monthlydays?.day && !formik.errors.repeat?.monthlydays?.day,
                                                                    }
                                                                )}
                                                                disabled = {isEditDisable ? isEditDisable : occursOnDay ? true : false}
                                                                value={data.repeat.monthlydays.day}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue('day', e.target.value, false)
                                                                    updateData({
                                                                        repeat: {
                                                                            ...data.repeat,
                                                                            monthlydays: {
                                                                                day: parseInt(e.target.value)
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                            >
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                                <option value="6">6</option>
                                                                <option value="7">7</option>
                                                                <option value="8">8</option>
                                                                <option value="9">9</option>
                                                                <option value="10">10</option>
                                                                <option value="11">11</option>
                                                                <option value="12">12</option>
                                                                <option value="13">13</option>
                                                                <option value="14">14</option>
                                                                <option value="15">15</option>
                                                                <option value="16">16</option>
                                                                <option value="17">17</option>
                                                                <option value="18">18</option>
                                                                <option value="19">19</option>
                                                                <option value="20">20</option>
                                                                <option value="21">21</option>
                                                                <option value="22">22</option>
                                                                <option value="23">23</option>
                                                                <option value="24">24</option>
                                                                <option value="25">25</option>
                                                                <option value="26">26</option>
                                                                <option value="27">27</option>
                                                                <option value="28">28</option>
                                                                <option value="29">29</option>
                                                                <option value="30">30</option>
                                                                <option value="31">31</option>
                                                            </select>
                                                            <span className='ps-2 fs-6 nowrap'>{intl.formatMessage({id: 'SESSION.OFTHEMONTH'})}</span>
                                                        </label>
                                                    </div>
                                                    <div className="col-lg-12 mt-5">
                                                        <label className='form-check form-check-custom form-check-solid me-5'>
                                                            <input
                                                                className='form-check-input pointer'
                                                                name='occurs_ons'
                                                                type='radio'
                                                                defaultChecked={data.repeat?.monthly?.monthly_week}
                                                                onChange={() => {
                                                                    setOccursOnDay(true)
                                                                    setOccursOWeek(false)
                                                                    updateData({
                                                                        repeat: {
                                                                            ...data.repeat,
                                                                            monthly: {
                                                                                monthly_day: data.repeat?.monthly?.monthly_day,
                                                                                monthly_week: !data.repeat?.monthly?.monthly_week
                                                                            }
                                                                        }
                                                                    })
                                                                }}
                                                                disabled={isEditDisable}
                                                            />
                                                            <span className='ps-2 fs-6'>
                                                                <label className={'form-check form-check-custom form-check-solid'}>
                                                                    <select
                                                                        {...formik.getFieldProps('monthly_weekday')}
                                                                        className={clsx(
                                                                            'form-control pointer rounded-pill w-150px mw-150px form-control-lg form-select border border-1 border-gray-900',
                                                                            {
                                                                                'is-invalid': formik.touched.repeat?.weekly?.monthly_weekday && formik.errors.repeat?.weekly?.monthly_weekday,
                                                                            },
                                                                            {
                                                                                'is-valid': formik.touched.repeat?.weekly?.monthly_weekday && !formik.errors.repeat?.weekly?.monthly_weekday,
                                                                            }
                                                                        )}
                                                                        disabled = {isEditDisable ? isEditDisable : occursOnWeek ? true : false}
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue('monthly_weekday', e.target.value, false)
                                                                            updateData({
                                                                                repeat: {
                                                                                    ...data.repeat,
                                                                                    weekly: {
                                                                                        monthly_weekday: parseInt(e.target.value),
                                                                                        monthly_week_day: data.repeat.weekly.monthly_week_day
                                                                                    }
                                                                                }
                                                                            })
                                                                        }}
                                                                        value={data.repeat.weekly.monthly_weekday}
                                                                    >
                                                                        <option value="1">First</option>
                                                                        <option value="2">Second</option>
                                                                        <option value="3">Third</option>
                                                                        <option value="4">Fourth</option>
                                                                        <option value="-1">Last</option>
                                                                    </select>
                                                                    <span className='ps-2 fs-6 nowrap'>
                                                                        <label className={'form-check form-check-custom form-check-solid'}>
                                                                            <select
                                                                                {...formik.getFieldProps('monthly_week_day')}
                                                                                className={clsx(
                                                                                    'form-control pointer rounded-pill w-150px mw-175px form-control-lg form-select border border-1 border-gray-900',
                                                                                    {
                                                                                        'is-invalid': formik.touched.repeat?.weekly?.monthly_week_day && formik.errors.repeat?.weekly?.monthly_week_day,
                                                                                    },
                                                                                    {
                                                                                        'is-valid': formik.touched.repeat?.weekly?.monthly_week_day && !formik.errors.repeat?.weekly?.monthly_week_day,
                                                                                    }
                                                                                )}
                                                                                disabled = {isEditDisable ? isEditDisable : occursOnWeek ? true : false}
                                                                                onChange={(e) => {
                                                                                    formik.setFieldValue('monthly_week_day', e.target.value, false)
                                                                                    updateData({
                                                                                        repeat: {
                                                                                            ...data.repeat,
                                                                                            weekly: {
                                                                                                monthly_weekday: data.repeat.weekly.monthly_weekday,
                                                                                                monthly_week_day: parseInt(e.target.value)
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                }}
                                                                                value={data.repeat.weekly.monthly_week_day}
                                                                            >
                                                                                <option value="1">Sunday</option>
                                                                                <option value="2">Monday</option>
                                                                                <option value="3">Tuesday</option>
                                                                                <option value="4">Wednesday</option>
                                                                                <option value="5">Thursday</option>
                                                                                <option value="6">Friday</option>
                                                                                <option value="7">Saturday</option>
                                                                            </select>
                                                                            <span className='ps-2 fs-6 nowrap'>of the month</span>
                                                                        </label>
                                                                    </span>
                                                                </label>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            
                                            {formik.touched.repeat?.weekly?.monthly_week_day && formik.errors.repeat?.weekly?.monthly_week_day && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert'>{formik.errors.repeat?.weekly?.monthly_week_day}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {data.repeat.recurrence && recurrenceType === '2' && (
                                        <div className='col-lg-6 mb-8'>
                                            <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.OCCURSON'})}</label>
                                            <div className='fv-row'>
                                                <div className='d-flex align-items-center mt-3'>
                                                    <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                        <input
                                                            className='form-check-input'
                                                            name='occurs_on[]'
                                                            type='checkbox'
                                                            defaultChecked={data.repeat.weekly_days?.sun}
                                                            onChange={() => {
                                                                if (!data.repeat?.weekly_days?.sun) {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST, 1]);
                                                                    setOccurredDayError(false)
                                                                }
                                                                else {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST.filter((item) => { return item !== 1 })]);
                                                                }
                                                                updateData({
                                                                    repeat: {
                                                                        ...data.repeat,
                                                                        weekly_days: {
                                                                            sun: !data.repeat?.weekly_days?.sun,
                                                                            mon: data.repeat?.weekly_days?.mon,
                                                                            tue: data.repeat?.weekly_days?.tue,
                                                                            wed: data.repeat?.weekly_days?.wed,
                                                                            thu: data.repeat?.weekly_days?.thu,
                                                                            fri: data.repeat?.weekly_days?.fri,
                                                                            sat: data.repeat?.weekly_days?.sat,
                                                                        },
                                                                    },
                                                                })
                                                            }}
                                                            disabled = {isEditDisable}
                                                        />
                                                        <span className='ps-2 fs-6'>Sun</span>
                                                    </label>
                                                    <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                        <input
                                                            className='form-check-input'
                                                            name='occurs_on[]'
                                                            type='checkbox'
                                                            defaultChecked={data.repeat.weekly_days?.mon}
                                                            onChange={() => {
                                                                if (!data.repeat?.weekly_days?.mon) {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST, 2]);
                                                                    setOccurredDayError(false)
                                                                }
                                                                else {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST.filter((item) => { return item !== 2 })]);
                                                                }
                                                                updateData({
                                                                    repeat: {
                                                                        ...data.repeat,
                                                                        weekly_days: {
                                                                            sun: data.repeat?.weekly_days?.sun,
                                                                            mon: !data.repeat?.weekly_days?.mon,
                                                                            tue: data.repeat?.weekly_days?.tue,
                                                                            wed: data.repeat?.weekly_days?.wed,
                                                                            thu: data.repeat?.weekly_days?.thu,
                                                                            fri: data.repeat?.weekly_days?.fri,
                                                                            sat: data.repeat?.weekly_days?.sat,
                                                                        },
                                                                    },
                                                                })
                                                            }}
                                                            disabled = {isEditDisable}
                                                        />
                                                        <span className='ps-2 fs-6'>Mon</span>
                                                    </label>
                                                    <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                        <input
                                                            className='form-check-input'
                                                            name='occurs_on[]'
                                                            type='checkbox'
                                                            defaultChecked={data.repeat.weekly_days?.tue}
                                                            onChange={() => {
                                                                if (!data.repeat?.weekly_days?.tue) {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST, 3]);
                                                                    setOccurredDayError(false)
                                                                }
                                                                else {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST.filter((item) => { return item !== 3 })]);
                                                                }
                                                                updateData({
                                                                    repeat: {
                                                                        ...data.repeat,
                                                                        weekly_days: {
                                                                            sun: data.repeat?.weekly_days?.sun,
                                                                            mon: data.repeat?.weekly_days?.mon,
                                                                            tue: !data.repeat?.weekly_days?.tue,
                                                                            wed: data.repeat?.weekly_days?.wed,
                                                                            thu: data.repeat?.weekly_days?.thu,
                                                                            fri: data.repeat?.weekly_days?.fri,
                                                                            sat: data.repeat?.weekly_days?.sat,
                                                                        },
                                                                    },
                                                                })
                                                            }}
                                                            disabled = {isEditDisable}
                                                        />
                                                        <span className='ps-2 fs-6'>Tue</span>
                                                    </label>
                                                    <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                        <input
                                                            className='form-check-input'
                                                            name='occurs_on[]'
                                                            type='checkbox'
                                                            defaultChecked={data.repeat.weekly_days?.wed}
                                                            onChange={() => {
                                                                if (!data.repeat?.weekly_days?.wed) {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST, 4]);
                                                                    setOccurredDayError(false)
                                                                }
                                                                else {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST.filter((item) => { return item !== 4 })]);
                                                                }
                                                                updateData({
                                                                    repeat: {
                                                                        ...data.repeat,
                                                                        weekly_days: {
                                                                            sun: data.repeat?.weekly_days?.sun,
                                                                            mon: data.repeat?.weekly_days?.mon,
                                                                            tue: data.repeat?.weekly_days?.tue,
                                                                            wed: !data.repeat?.weekly_days?.wed,
                                                                            thu: data.repeat?.weekly_days?.thu,
                                                                            fri: data.repeat?.weekly_days?.fri,
                                                                            sat: data.repeat?.weekly_days?.sat,
                                                                        },
                                                                    },
                                                                })
                                                            }}
                                                            disabled = {isEditDisable}
                                                        />
                                                        <span className='ps-2 fs-6'>Wed</span>
                                                    </label>
                                                    <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                        <input
                                                            className='form-check-input'
                                                            name='occurs_on[]'
                                                            type='checkbox'
                                                            defaultChecked={data.repeat.weekly_days?.thu}
                                                            onChange={() => {
                                                                if (!data.repeat?.weekly_days?.thu) {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST, 5]);
                                                                    setOccurredDayError(false)
                                                                }
                                                                else {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST.filter((item) => { return item !== 5 })]);
                                                                }
                                                                updateData({
                                                                    repeat: {
                                                                        ...data.repeat,
                                                                        weekly_days: {
                                                                            sun: data.repeat?.weekly_days?.sun,
                                                                            mon: data.repeat?.weekly_days?.mon,
                                                                            tue: data.repeat?.weekly_days?.tue,
                                                                            wed: data.repeat?.weekly_days?.wed,
                                                                            thu: !data.repeat?.weekly_days?.thu,
                                                                            fri: data.repeat?.weekly_days?.fri,
                                                                            sat: data.repeat?.weekly_days?.sat,
                                                                        },
                                                                    },
                                                                })
                                                            }}
                                                            disabled = {isEditDisable}
                                                        />
                                                        <span className='ps-2 fs-6'>Thu</span>
                                                    </label>
                                                    <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                        <input
                                                            className='form-check-input'
                                                            name='occurs_on[]'
                                                            type='checkbox'
                                                            defaultChecked={data.repeat.weekly_days?.fri}
                                                            onChange={() => {
                                                                if (!data.repeat?.weekly_days?.fri) {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST, 6]);
                                                                    setOccurredDayError(false)
                                                                }
                                                                else {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST.filter((item) => { return item !== 6 })]);
                                                                }
                                                                updateData({
                                                                    repeat: {
                                                                        ...data.repeat,
                                                                        weekly_days: {
                                                                            sun: data.repeat?.weekly_days?.sun,
                                                                            mon: data.repeat?.weekly_days?.mon,
                                                                            tue: data.repeat?.weekly_days?.tue,
                                                                            wed: data.repeat?.weekly_days?.wed,
                                                                            thu: data.repeat?.weekly_days?.thu,
                                                                            fri: !data.repeat?.weekly_days?.fri,
                                                                            sat: data.repeat?.weekly_days?.sat,
                                                                        },
                                                                    },
                                                                })
                                                            }}
                                                            disabled = {isEditDisable}
                                                        />
                                                        <span className='ps-2 fs-6'>Fri</span>
                                                    </label>
                                                    <label className='form-check pointer form-check-custom form-check-solid me-5'>
                                                        <input
                                                            className='form-check-input'
                                                            name='occurs_on[]'
                                                            type='checkbox'
                                                            defaultChecked={data.repeat.weekly_days?.sat}
                                                            onChange={() => {
                                                                if (!data.repeat?.weekly_days?.sat) {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST, 7]);
                                                                    
                                                                }
                                                                else {
                                                                    setWeeklyDaysLST(weeklyDaysLST => [...weeklyDaysLST.filter((item) => { return item !== 7 })]);
                                                                }
                                                                updateData({
                                                                    repeat: {
                                                                        ...data.repeat,
                                                                        weekly_days: {
                                                                            sun: data.repeat?.weekly_days?.sun,
                                                                            mon: data.repeat?.weekly_days?.mon,
                                                                            tue: data.repeat?.weekly_days?.tue,
                                                                            wed: data.repeat?.weekly_days?.wed,
                                                                            thu: data.repeat?.weekly_days?.thu,
                                                                            fri: data.repeat?.weekly_days?.fri,
                                                                            sat: !data.repeat?.weekly_days?.sat,
                                                                        }, 
                                                                    },
                                                                })
                                                            }}
                                                            disabled = {isEditDisable}
                                                        />
                                                        <span className='ps-2 fs-6'>Sat</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {occurredDayError && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert'>Please select atleast 1 day</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {data.repeat.recurrence && (recurrenceType === '1' || recurrenceType === '2' || recurrenceType === '3') && (
                                        <div className='col-lg-3 mb-8'>
                                            <label className='form-label fs-6'>{intl.formatMessage({id: 'SESSION.ENDDATE'})}</label>
                                            <input
                                                placeholder={format(new Date(), 'y-MM-dd')}
                                                value={inputEndDateValue}
                                                onChange={handleInputEndDateChange}
                                                type='text'
                                                readOnly={true}
                                                autoComplete='off'
                                                disabled = {isEditDisable}
                                                onClick={handleButtonEndClick}
                                                className={clsx(
                                                    'form-control pointer rounded-pill form-control-lg border border-1 border-gray-900',
                                                    {
                                                        'is-invalid': endDateTimeError === true,
                                                    },
                                                    {
                                                        'is-valid': inputEndDateValue !== "" && endDateTimeError === false,
                                                    }
                                                )}
                                            />
                                           
                                            {!isEditDisable && isPopperEndOpen && (
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
                                                        ref={setPopperStartDateElement}
                                                        role="dialog"
                                                    >
                                                        <DayPicker
                                                            initialFocus={isPopperEndOpen}
                                                            mode="single"
                                                            defaultMonth={selectedEndDate}
                                                            fromDate={new Date(selectedStartDay)}
                                                            required
                                                            selected={selectedEndDate}
                                                            showOutsideDays
                                                            captionLayout="dropdown"
                                                            onSelect={handleEndDateSelect}
                                                        />
                                                    </div>
                                                </FocusTrap>
                                            )}

                                            {endDateTimeError && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert'>End date is required</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </>
                            )}

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
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type='submit'
                                    className='btn themebtnblue fw-bolder px-6 py-3'
                                    style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
                                    disabled={formik.isSubmitting || !formik.isValid || loading}
                                    // disabled={formik.isSubmitting || loading}
                                >
                                    {!loading && <span className='indicator-label'>Save</span>}
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

export { MeetingWrapper }
