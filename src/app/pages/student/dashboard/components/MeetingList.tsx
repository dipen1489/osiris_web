/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { Link } from "react-router-dom";
import { addSomeMinutesToTime, checkExpired, imgTobase64String, uint8array, userImgSM, verifyDateIsToday, verifyJoiningTime, verifyJoiningTimeInstructor, verifyMeetingIsExpired } from '../../../../modules/helper';
import { parseISO, format } from 'date-fns'
import { UsersList } from '../../../component/UsersList';
import { IconUserModel } from '../../../component/core/_Models';
import { getAuthUserId } from '../../../../modules/auth/core/AuthHelpers';
import toast from 'react-hot-toast';
import { enrollMeeting } from '../../details/core/_requests';
import { Image } from '../../../../modules/auth/core/_models';

type Props = {
    data: any
    index: number
    isFromViewAll?: boolean
}

const getRandomElement = (arr: any[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined

const MeetingList: React.FC<Props> = ({ data, index, isFromViewAll=false }) => {

    const [cardClass, setCardClass] = useState<string>();
    const [isbtnDisable, setIsbtnDisable] = useState<boolean>(true);

    useEffect(() => {
        if(isFromViewAll){
            setCardClass('col-md-3 card border card-main border-2 card-shadow mb-md-2 w-31 me-md-1')
        }
        else{
            setCardClass('card border card-main border-2 w-lg-325px w-xl-325px w-xxl-350px card-shadow mb-md-2 me-md-1 mb-5')
        }
    }, [isFromViewAll])
    

    // const arrayBuffer = data.image && data.image !== "" ? data.image.data.data : [] as ArrayLike<number> | ArrayBuffer
    // const base64String = imgTobase64String(uint8array(arrayBuffer))

    const users: Array<IconUserModel> = []

    if(data.enrolled_users == 1){
        users.push({name: '', avatar: '/img/user_sm1.png',})
    }
    else if(data.enrolled_users == 2){
        users.push({name: '', avatar: '/img/user_sm1.png',})
        users.push({name: '', avatar: '/img/user_sm2.png',})
    }
    else if(data.enrolled_users == 3){
        users.push({name: '', avatar: '/img/user_sm1.png',})
        users.push({name: '', avatar: '/img/user_sm2.png',})
        users.push({name: '', avatar: '/img/user_sm3.png',})
    }
    else if(data.enrolled_users > 3){
        const ucount = data.enrolled_users - 3
        users.push({name: '', avatar: '/img/user_sm1.png',})
        users.push({name: '', avatar: '/img/user_sm2.png',})
        users.push({name: '', avatar: '/img/user_sm3.png',})
        users.push({name: '', initials: `+${ucount}`, color: 'primary', numbers: ucount})
    }
    
    const handleEnrollbtn = async (meetingId: string, occurranceId: string) => {
        await enrollMeeting({
            meetingId: meetingId,
            userId: getAuthUserId(),
            occurrenceId: occurranceId
        }).then((result: any) => {
            toast.success(result.data.data.message)
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

    const handleCheckTime = () => {
         
        const intervalId = setInterval(() => {
            setIsbtnDisable(verifyJoiningTimeInstructor(data.start_time))
        }, 5000)
        
        return () => clearInterval(intervalId);
    }
    handleCheckTime()
    // window.setInterval(() => {verifyJoiningTimeInstructor(data.start_time)}, 5000)
    return (
        <>
        {checkExpired(data.start_time) && 
        (<Link key={index} className={cardClass} to={'enrolled/' + data.id}>
            <div className='card-header border-0 p-5 pt-5 pb-3'>
                <div className="d-flex align-items-center flex-grow-1">
                    <div className="symbol symbol-50px me-3">
                    <img src={data.image ? data.image : toAbsoluteUrl('img/blank.svg')}
                            alt={`${data.instructor}`} />

                        {/* {base64String ? (<img src={`data:image/png;base64,${base64String}`}
                            alt={`${data.instructor}`} />) : (<img src={toAbsoluteUrl(getRandomElement(userImgSM))}
                                alt={`${data.instructor}`} />)} */}
                    </div>
                    <div className="d-flex flex-column">
                        <span className="fs-2 fw-bold" style={{ color: '#144067' }}>
                            { data.instructor.trim().length > 22 ? data.instructor.substring(0,22)+'...' : data.instructor }
                        </span>
                        <span className="card-main-designation text-gray-400 fw-semibold">Organiser</span>
                    </div>
                </div>
            </div>

            <div className='card-body p-5 pt-0'>
                <div className='fs-3 mt-1 mb-1' style={{ color: '#144067' }}>
                { data.title.trim().length > 30 ? data.title.substring(0,31)+'...' : data.title }
                </div>
                <div className='d-flex flex-wrap mt-1 mb-1'>
                    <div className='d-flex min-w-125px align-items-center py-2 me-5'>
                        <KTSVG
                            path='/img/calander_ic.svg'
                            className='svg-icon svg-icon-4'
                        />
                        <div className='ms-2 fs-5 card-main-designation fw-semibold'>{format(parseISO(data.start_time), 'dd, MMM, yyyy')}</div>
                    </div>

                    <div className='d-flex min-w-125px align-items-center py-2'>
                        <KTSVG
                            path='/img/time_ic.svg'
                            className='svg-icon svg-icon-4'
                        />
                        <div className='ms-2 fs-5 card-main-designation fw-semibold'>{format(parseISO(data.start_time), 'HH:mm')} - {format(parseISO(addSomeMinutesToTime(data.start_time, parseInt(data.duration))), 'HH:mm')}</div>
                    </div>
                </div>
                <div className='d-flex justify-content-between flex-wrap min-w-125px mt-2'>
                    <div className='d-flex'>
                        <UsersList users={users} />
                    </div>
                    {
                        data?.joinlink ?
                        (<button
                            className='btn card-main-button fs-7 p-0 py-3 px-5 fw-bold enroll'
                            type='button'
                            disabled={isbtnDisable}
                            onClick={() => handleJoinbtn(verifyJoiningTimeInstructor(data.start_time), data.join_link)}
                        >
                            {verifyDateIsToday(data.start_time) ? 'JOIN NOW' : 'JOIN' } 
                        </button>) : 
                        (<button
                            className='btn card-main-button fs-7 p-0 py-3 px-5 fw-bold connect'
                            type='button'
                        >
                            ENROLL
                        </button>)
                    }
                </div>
            </div>
        </Link>)
        }
        </>
    )
}

export { MeetingList }