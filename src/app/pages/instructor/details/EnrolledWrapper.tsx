/* eslint-disable jsx-a11y/img-redundant-alt */
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../../_metronic/layout/core'
import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { KTSVG } from "../../../../_metronic/helpers";
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { addSomeMinutesToTime, imgTobase64String, uint8array, verifyJoiningTime, verifyJoiningTimeInstructor } from '../../../modules/helper';
import { CalendarItem } from '../schedule/CalendarItem';
import { format, parseISO } from 'date-fns';
import { IconUserModel } from '../../component/core/_Models';
import { Menu } from './Menu';
import {MenuComponent} from '../../../../_metronic/assets/ts/components'
import { Loader } from '../../component/Loader';

const EnrolledWrapper = () => {
    
    const meetingDetail = useQueryResponseData()
    const isLoading = useQueryResponseLoading()
    const data: any = useMemo(() => meetingDetail, [meetingDetail])
    // const arrayBuffer = data?.image && data.image !== "" ? data.image.data.data : [] as ArrayLike<number> | ArrayBuffer
    // const base64String = imgTobase64String(uint8array(arrayBuffer))
    
    const eventData : any = []

    if (!isLoading) {
        for (var i = 0; i < data.schedule.length; i++) {

            const users: Array<IconUserModel> = []

            if(data.schedule[i].enrolled_users.length === 1){
                users.push({name: '', avatar: '/img/user_sm1.png',})
            }
            else if(data.schedule[i].enrolled_users.length === 2){
                users.push({name: '', avatar: '/img/user_sm1.png',})
                users.push({name: '', avatar: '/img/user_sm2.png',})
            }
            else if(data.schedule[i].enrolled_users.length === 3){
                users.push({name: '', avatar: '/img/user_sm1.png',})
                users.push({name: '', avatar: '/img/user_sm2.png',})
                users.push({name: '', avatar: '/img/user_sm3.png',})
            }
            else if(data.schedule[i].enrolled_users.length > 3){
                const ucount = data.schedule[i].enrolled_users.length - 3
                users.push({name: '', avatar: '/img/user_sm1.png',})
                users.push({name: '', avatar: '/img/user_sm2.png',})
                users.push({name: '', avatar: '/img/user_sm3.png',})
                users.push({name: '', initials: `+${ucount}`, color: 'primary', numbers: ucount})
            }

            const eventlst : any = []
            eventlst['id'] = data.schedule[i].id
            eventlst['title'] = data.title
            eventlst['start'] = data.schedule[i].start_time
            eventlst['joinlink'] = data.owner_joinlink
            eventlst['end'] = addSomeMinutesToTime(data.schedule[i].start_time, parseInt(data.schedule[i].duration))
            eventlst['overlap'] = false
            eventlst['additional'] = data.schedule[i]
            eventlst['meetingId'] = data.id
            eventlst['eventUser'] = users
            eventlst['eventUserCount'] = data.schedule[i].enrolled_users.length
            eventData.push(eventlst);
        }
    }

    const handleJoinbtn = (isJoiningActive: boolean, meetingLink: string) => {
        isJoiningActive && window.open(meetingLink, '_blank', 'noreferrer')
        // window.open(meetingLink, '_blank', 'noreferrer')
    }

    const intl = useIntl()

    useEffect(() => {
        MenuComponent.reinitialization()
    })

    return (
        <>
            {!isLoading && data && <PageTitle breadcrumbs={[]}>{data.title}</PageTitle>}
            {isLoading ? <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> :
                data && (<div className='d-flex flex-column flex-lg-row'>
                <div className='flex-column flex-lg-row-auto w-lg-300px w-xl-400px mb-10'>
                    <div className="flex-column flex-lg-row-auto w-lg-300px w-xl-400px mb-10">
                        <div className="card details-background mb-5 mb-xl-8">
                            <div className="card-body">
                                <div className="d-flex flex-column">
                                    <div className="mb-5">
                                        <img 
                                            className='leftside' 
                                            src={data?.image}
                                            alt={data.title} />
                                    </div>
                                    <div className='ms-2'>
                                        <div className='d-flex flex-stack'>
                                            <h2 className="fs-2 fw-bold textColor mb-5">{data.title}</h2>
                                            <div className='card-toolbar mb-8'>
                                                <button
                                                    type='button'
                                                    className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                                    data-kt-menu-trigger='click'
                                                    data-kt-menu-placement='bottom-end'
                                                    data-kt-menu-flip='top-end'
                                                >
                                                    <KTSVG path='/menu/more.svg' className='svg-icon themeblue svg-icon-2' />
                                                </button>
                                                <Menu id={data.id} />
                                            </div>
                                        </div>
                                        <div className='d-flex flex-wrap mb-3'>
                                            <div className='d-flex min-w-125px me-7'>
                                                <KTSVG
                                                    path='/menu/calander_ic.svg'
                                                    className='svg-icon svg-icon-2'
                                                />
                                                <div className='ms-3 fs-5 card-main-designation fw-semibold'>{format(parseISO(data?.meeting_param.start_time), 'dd, MMM, yyyy')}</div>
                                            </div>

                                            <div className='d-flex min-w-125px px-4'>
                                                <KTSVG
                                                    path='/menu/meeting_end.svg'
                                                    className='svg-icon svg-icon-2'
                                                />
                                                <div className='ms-3 fs-5 card-main-designation fw-semibold'>{format(parseISO(data?.meeting_param.recurrence.end_date_time), 'dd, MMM, yyyy')}</div>
                                            </div>
                                        </div>
                                        <div className='d-flex min-w-125px me-7 mb-3'>
                                            <div className='d-flex min-w-125px'>
                                                <KTSVG
                                                    path='/menu/time_ic.svg'
                                                    className='svg-icon svg-icon-2'
                                                />
                                                <div className='ms-3 fs-5 card-main-designation fw-semibold'>{format(parseISO(data?.meeting_param.start_time), 'HH:mm')} - {format(parseISO(addSomeMinutesToTime(data?.meeting_param.start_time, parseInt(data?.meeting_param.duration))), 'HH:mm')}</div>
                                            </div>
                                        </div>
                                        <div className='d-flex min-w-125px me-7 mb-3'>
                                            <KTSVG
                                                path='/menu/price_ic.svg'
                                                className='svg-icon svg-icon-2'
                                            />
                                            <div className='ms-3 fs-5 card-main-designation fw-semibold'>$ {data.price}</div>
                                        </div>
                                        <div className='d-flex min-w-125px me-7 mb-3'>
                                            <KTSVG
                                                path='/menu/equipment_ic.svg'
                                                className='svg-icon svg-icon-2'
                                            />
                                            <div className='ms-3 fs-5 card-main-designation fw-semibold'>{data.equipments_required.join(', ')}</div>
                                        </div>
                                        <div className="separator"></div>

                                        <div className='mb-4 mt-5'>
                                            <h4 className="fs-4 fw-bold textColor mb-4">Description</h4>
                                            <p>
                                            {data.description}
                                            </p>
                                        </div>

                                        <div className="d-flex mt-5 flex-wrap">
                                            {data?.owner_joinlink && <button
                                                    className='btn card-main-button fs-5 py-2 enroll fw-semibold'
                                                    type='button'
                                                    onClick={() => handleJoinbtn(verifyJoiningTimeInstructor(data.meeting_param.start_time), data.owner_joinlink)}
                                                >
                                                    START SESSION
                                                </button>
                                            }
                                            <div className="ms-5">
                                                <Link
                                                    className='btn card-main-button connect fs-5 fw-semibold'
                                                    to={'/dashboard'}
                                                >
                                                    CLOSE
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-lg-row-fluid ms-lg-7 overflow-scroll hover-scroll-x'>
                    <CalendarItem weekendsVisible={true} currentEvents={eventData} option={false} />
                </div>
            </div>)}
        </>
    )
}

export { EnrolledWrapper }
