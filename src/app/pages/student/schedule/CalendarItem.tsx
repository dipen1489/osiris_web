/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Dispatch, SetStateAction, useState } from 'react'
import FullCalendar, { EventContentArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './calendar.css'
import { KTSVG } from "../../../../_metronic/helpers";
import { UsersList } from './UsersList'
import { IconUserModel } from '../../component/core/_Models'
import { getAuthUserId } from '../../../modules/auth/core/AuthHelpers'
import { enrollMeeting, enrollMeetingCancel } from '../details/core/_requests'
import { verifyDateIsToday, verifyJoiningTime, verifyJoiningTimeInstructor, verifyMeetingIsExpired } from '../../../modules/helper'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'


type Props = {
    weekendsVisible: boolean
    currentEvents: any
    option: boolean
    setIsSubmit: Dispatch<SetStateAction<boolean>>;
}

const CalendarItem: React.FC<Props> = ({ weekendsVisible, currentEvents, option, setIsSubmit}) => {
    const [popupShow, setPopupShow] = useState<boolean>(false)
    const [popupShowId, setPopupShowId] = useState<string>('')
    // const [isbtnDisable, setIsbtnDisable] = useState<boolean>(true);

    const navigate = useNavigate();
    const togglePopupShow = (recipeId: any) => {
        setPopupShow((popupShow) => {
            setPopupShowId(recipeId)
            if (popupShow == true) {
                
            }
            if (popupShow == false) {
            }
            return !popupShow;
        });
    }

    const handleEnrollbtn = async (meetingId: string, occurranceId: string) => {
        setIsSubmit(true)
        await enrollMeeting({
            meetingId: meetingId,
            userId: getAuthUserId(),
            occurrenceId: occurranceId
        }).then((result: any) => {
            toast.success(result.data.data.message,{
                duration: 15000,
                position: "top-center",
              })
            setPopupShowId('')
            setPopupShow(false)
            setIsSubmit(false)
            setTimeout(() => {
                return navigate('/dashboard')
            }, 1000)
        },(error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                toast.error(resMessage)
        })
        .catch(() => {
            toast.error('Please try after some time...')
        })
    }

    const handleCancelbtn = async (meetingId: string, occurranceId: string) => {
        setIsSubmit(true)
        await enrollMeetingCancel({
            userId: getAuthUserId(),
            occurrenceId: occurranceId
        }).then((result: any) => {
            toast.success(result.data.data.message,{
                duration: 15000,
                position: "top-center",
              })
            setPopupShowId('')
            setPopupShow(false)
            setIsSubmit(false)
            setTimeout(() => {
                return navigate('/dashboard')
            }, 1000)
        },(error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                toast.error(resMessage)
        })
        .catch(() => {
            toast.error('Please try after some time...')
        })
    }

    const handleJoinbtn = (isJoiningActive: boolean, meetingLink: string) => {
        isJoiningActive && window.open(meetingLink, '_blank', 'noreferrer')
    }

    const [state, setState] = useState({
        weekendsVisible: true,
        currentEvents: currentEvents
    });

    const handleEvents = (currentEvents: any) => {
        // @ts-ignore
        setState({
            weekendsVisible: true,
            currentEvents: currentEvents,
        })
    }
    //className={verifyDateIsToday(eventInfo.event.extendedProps?.additional.start_time) ? 'calendar-main-full card-shadow cardactive' : 'calendar-main-full card-shadow'}
    const renderEventContent = (eventInfo: EventContentArg) => {
        const users: Array<IconUserModel> = eventInfo.event.extendedProps?.eventUser
        return (
               <>
                 {popupShow === true && popupShowId === eventInfo.event._instance?.instanceId ?
                    (<div key={eventInfo.event._instance?.instanceId} 
                        className={
                            ((!option && eventInfo.event.extendedProps?.additional.enrolled_users.some((x: string) => x === getAuthUserId())) || option) ? 'calendar-main-full card-shadow cardactive' : 'calendar-main-full card-shadow '}
                        onClick={() => togglePopupShow(eventInfo.event._instance?.instanceId)}>
                        <div className='d-flex flex-stack'>
                            <div className='d-flex flex-stack'>
                                <UsersList users={users} />
                            </div>
                        </div>
                        <div className='mt-1 time lh-sm fw-bold fs-5'>
                            {eventInfo.timeText.replace('-','to')}
                        </div>
                        <div className='mt-1 mb-1 time lh-sm fw-medium fs-7'>
                            {eventInfo.event.extendedProps?.eventUserCount} Student(s)
                        </div>
                        <div className='mt-1 title lh-sm fw-bold calender_title fs-7'>
                            { eventInfo.event.title.trim().length > 28 ? eventInfo.event.title.substring(0,28)+'...' : eventInfo.event.title }
                        </div>
                        {
                            option ? 
                            verifyMeetingIsExpired(eventInfo.event.extendedProps?.additional.start_time) ? 
                            (<button
                                className='btn card-main-button mt-2 fs-5 py-2 px-3 enroll fw-semibold'
                                type='button'
                                disabled={verifyJoiningTime(eventInfo.event.extendedProps?.additional.start_time) ? true : false}
                                onClick={() => handleJoinbtn(verifyJoiningTime(eventInfo.event.extendedProps?.additional.start_time), eventInfo.event.extendedProps?.additional.join_link)}
                            >
                                EXPIRED
                            </button>) : 
                            (<><button
                                className='btn card-main-button mt-2 fs-5 py-2 px-3 enroll fw-semibold'
                                type='button'
                                disabled={verifyJoiningTimeInstructor(eventInfo.event.extendedProps?.additional.start_time)}
                                onClick={() => handleJoinbtn(verifyJoiningTimeInstructor(eventInfo.event.extendedProps?.additional.start_time), eventInfo.event.extendedProps?.additional.join_link)}
                            >
                               {verifyDateIsToday(eventInfo.event.extendedProps?.additional.start_time) ? 'JOIN NOW' : 'JOIN' } 
                            </button><br></br>
                            <button
                                className='btn card-main-button mt-2 fs-7 py-1 px-2 cancelbtn fw-semibold'
                                type='button'
                                onClick={() => handleCancelbtn(eventInfo.event.extendedProps?.meetingId, eventInfo.event.extendedProps?.additional.id)}
                            >
                                Disenroll
                            </button></>) :
                            eventInfo.event.extendedProps?.additional.enrolled_users.some((x: string) => x === getAuthUserId()) ? 
                            verifyMeetingIsExpired(eventInfo.event.extendedProps?.additional.start_time) ?
                            (<button
                                className='btn card-main-button mt-2 fs-5 py-2 px-3 enroll fw-semibold'
                                type='button'
                                disabled={verifyJoiningTime(eventInfo.event.extendedProps?.additional.start_time) ? true : false}
                                onClick={() => handleJoinbtn(verifyJoiningTime(eventInfo.event.extendedProps?.additional.start_time), eventInfo.event.extendedProps?.additional.join_link)}
                            >
                                EXPIRED
                            </button>) :
                            (<><button
                                className='btn card-main-button mt-2 fs-5 py-2 px-3 enroll fw-semibold'
                                type='button'
                                disabled={verifyJoiningTimeInstructor(eventInfo.event.extendedProps?.additional.start_time)}
                                onClick={() => handleJoinbtn(verifyJoiningTimeInstructor(eventInfo.event.extendedProps?.additional.start_time), eventInfo.event.extendedProps?.additional.join_link)}
                            >
                                {verifyDateIsToday(eventInfo.event.extendedProps?.additional.start_time) ? 'JOIN NOW' : 'JOIN' } 
                            </button><br></br>
                            <button
                                className='btn card-main-button mt-2 fs-7 py-1 px-2 cancelbtn fw-semibold'
                                type='button'
                                onClick={() => handleCancelbtn(eventInfo.event.extendedProps?.meetingId, eventInfo.event.extendedProps?.additional.id)}
                            >
                                Disenroll
                            </button></>) : verifyMeetingIsExpired(eventInfo.event.extendedProps?.additional.start_time) ?
                            (<button
                                className='btn card-main-button mt-2 fs-5 py-2 px-3 enroll fw-semibold'
                                type='button'
                                disabled={verifyJoiningTime(eventInfo.event.extendedProps?.additional.start_time) ? true : false}
                                onClick={() => handleJoinbtn(verifyJoiningTime(eventInfo.event.extendedProps?.additional.start_time), eventInfo.event.extendedProps?.additional.join_link)}
                            >
                                EXPIRED
                            </button>) : 
                            (<button
                                className='btn card-main-button mt-2 connect fs-5 py-2 px-3 fw-semibold'
                                type='button'
                                onClick={() => handleEnrollbtn(eventInfo.event.extendedProps?.meetingId, eventInfo.event.extendedProps?.additional.id)}
                            >
                                ENROLL
                            </button>)
                        }
                    </div>) : (
                       // className={verifyDateIsToday(eventInfo.event.extendedProps?.additional.start_time) ? 'calendar-main cardactive' : 'calendar-main'}
                        <div 
                            key={eventInfo.event._instance?.instanceId} 
                            className={
                                ((!option && eventInfo.event.extendedProps?.additional.enrolled_users.some((x: string) => x === getAuthUserId())) || option) ? 'calendar-main cardactive' : 'calendar-main'}
                          onClick={() => togglePopupShow(eventInfo.event._instance?.instanceId)}>
                            <div className='d-flex flex-stack'>
                                <div className='d-flex flex-stack'>
                                    <UsersList users={users} />
                                </div>
                                <div className=''>
                                    <KTSVG
                                        path='/img/more_ic.svg'
                                        className='svg-icon svg-icon-5'
                                    />
                                </div>
                            </div>
                            <div className='mt-1 time lh-sm fw-bold fs-5'>
                                {eventInfo.timeText.replace('-','to')}
                            </div>
                            <div className='mt-1 mb-1 time lh-sm fw-medium fs-7'>
                                {eventInfo.event.extendedProps?.eventUserCount} Student(s)
                            </div>
                            <div className='mt-1 title lh-sm fw-bold calender_title fs-7'>
                            { eventInfo.event.title.trim().length > 28 ? eventInfo.event.title.substring(0,28)+'...' : eventInfo.event.title }
                            </div>
                        </div>)
                }
               </>
        )
    };

    return (
        option ? (<FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            }}
            buttonText={{
                month: 'Month',
                week: 'Week',
            }}
            initialView='timeGridWeek'
            editable={true}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={false}
            slotEventOverlap={false}
            allDaySlot={false}
            navLinks={false}
            slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                meridiem: 'short'
            }}
            eventMinHeight={40}
            eventShortHeight={140}
            slotDuration={{hours:6}}
            slotLabelInterval={{ hours: 6 }}
            eventOverlap={false}
            weekends={state.weekendsVisible}
            initialEvents={currentEvents}
            eventContent={(info) => renderEventContent(info)}
            eventsSet={handleEvents}
        />) : (<FullCalendar
            allDayMaintainDuration
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next',
                center: '',
                right: ''
            }}
            initialView='timeGridWeek'
            editable={true}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={false}
            slotEventOverlap={false}
            allDaySlot={false}
            navLinks={false}
            slotDuration={{hours:6}}
            slotLabelInterval={{ hours: 6 }}
            eventOverlap={false}
            weekends={state.weekendsVisible}
            initialEvents={currentEvents}
            eventContent={(info) => renderEventContent(info)}
            eventsSet={handleEvents}
        />)
    )
}

export { CalendarItem }