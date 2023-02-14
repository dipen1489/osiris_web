/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import FullCalendar, { EventContentArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './calendar.css'
import { KTSVG } from "../../../../_metronic/helpers";
import { UsersList } from './UsersList'
import { IconUserModel } from '../../component/core/_Models'
// import { enrollMeetingCancel } from '../details/core/_requests'
import { verifyDateIsToday, verifyJoiningTime, verifyJoiningTimeInstructor, verifyMeetingIsExpired } from '../../../modules/helper'
import { useNavigate } from 'react-router-dom'

type Props = {
    weekendsVisible: boolean
    currentEvents: any
    option: boolean
}

const CalendarItem: React.FC<Props> = ({ weekendsVisible, currentEvents, option }) => {
    const [popupShow, setPopupShow] = useState<boolean>(false)
    const [popupShowId, setPopupShowId] = useState<string>('')
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

    const renderEventContent = (eventInfo: EventContentArg) => {
        const users: Array<IconUserModel> = eventInfo.event.extendedProps?.eventUser
        return (
               <>
                 {popupShow === true && popupShowId === eventInfo.event._instance?.instanceId ?
                    (<div key={eventInfo.event._instance?.instanceId} 
                        className={verifyDateIsToday(eventInfo.event.extendedProps?.additional.start_time) ? 'calendar-main-full card-shadow cardactive' : 'calendar-main-full card-shadow'}
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
                            verifyMeetingIsExpired(eventInfo.event.extendedProps?.additional.start_time) ? 
                            (<button
                                className='btn card-main-button mt-2 fs-5 py-2 px-3 enroll fw-semibold'
                                type='button'
                                disabled={verifyJoiningTime(eventInfo.event.extendedProps?.additional.start_time) ? true : false}
                            >
                                EXPIRED
                            </button>) : 
                            (<button
                                className='btn card-main-button mt-2 fs-5 py-2 px-3 enroll fw-semibold'
                                type='button'
                                disabled={verifyJoiningTimeInstructor(eventInfo.event.extendedProps?.additional.start_time)}
                                onClick={() => handleJoinbtn(verifyJoiningTimeInstructor(eventInfo.event.extendedProps?.additional.start_time), eventInfo.event.extendedProps?.joinlink)}
                            >
                               {verifyDateIsToday(eventInfo.event.extendedProps?.additional.start_time) ? 'START' : 'START' } 
                            </button>)
                        }
                    </div>) : (
                        <div key={eventInfo.event._instance?.instanceId} className={verifyDateIsToday(eventInfo.event.extendedProps?.additional.start_time) ? 'calendar-main cardactive' : 'calendar-main'}
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
        currentEvents.length > 0 ?
        option ? (<FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            customButtons={{
                myCustomButton: {
                    text: 'CREATE A SESSION',
                    click: function() {
                        navigate('/dashboard/createmeeting')
                    },
                },
            }}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,myCustomButton'
            }}
            buttonText={{
                month: 'Month',
                week: 'Week',
            }}
            navLinks={false}
            allDaySlot={false}
            slotDuration={{ hours: 6 }}
            slotLabelInterval={{ hours: 6 }}
            eventOverlap={false}
            slotEventOverlap={false}
            initialView='timeGridWeek'
            editable={true}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={false}
            weekends={state.weekendsVisible}
            initialEvents={currentEvents}
            eventContent={(info) => renderEventContent(info)}
            eventsSet={handleEvents}
        />) : (<FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next',
                center: '',
                right: ''
            }}
            navLinks={true}
            allDaySlot={false}
            slotDuration={{hours:6}}
            slotLabelInterval={{ hours: 6 }}
            eventOverlap={false}
            slotEventOverlap={false}
            initialView='timeGridWeek'
            editable={true}
            selectable={false}
            selectMirror={false}
            dayMaxEvents={false}
            weekends={state.weekendsVisible}
            initialEvents={currentEvents}
            eventContent={(info) => renderEventContent(info)}
            eventsSet={handleEvents}
        />): (<FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            customButtons={{
                myCustomButton: {
                    text: 'CREATE A SESSION',
                    click: function() {
                        navigate('/dashboard/createmeeting')
                    },
                },
            }}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,myCustomButton'
            }}
            buttonText={{
                month: 'Month',
                week: 'Week',
            }}
            initialView='timeGridWeek'
            navLinks={true}
            editable={true}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={false}
            slotEventOverlap={false}
            allDaySlot={false}
            slotDuration={{ hours: 6 }}
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