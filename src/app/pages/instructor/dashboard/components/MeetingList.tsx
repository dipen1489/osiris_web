/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { KTSVG } from '../../../../../_metronic/helpers'
import { Link } from "react-router-dom";
import { addSomeMinutesToTime, verifyJoiningTimeInstructor } from '../../../../modules/helper';
import { parseISO, format } from 'date-fns'
import { UsersList } from '../../../component/UsersList';
import { IconUserModel } from '../../../component/core/_Models';

type Props = {
    data: any
    index: number
}

const MeetingList: React.FC<Props> = ({ data, index }) => {
    const users: Array<IconUserModel> = []
    const [isbtnDisable, setIsbtnDisable] = useState<boolean>(true);
    
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

    return (
        <Link key={index} className='col-md-4 card border card-main border-2 card-shadow mb-md-2 w-31 me-md-2' to={'enrolled/' + data.id}>
            <div className='card-header border-0 pt-7'>
                <div className="d-flex align-items-stretch justify-content-between align-items-center flex-grow-1">
                    <h2 className="fs-3 fw-semibold mb-0 text-thmdark">
                        { data.title.trim().length > 40 ? data.title.substring(0,40)+'...' : data.title }
                    </h2>
                    <KTSVG
                        path='/menu/more.svg'
                        className='svg-icon svg-icon-1 svg-icon-color'
                    />
                </div>
            </div> 

            <div className='card-body py-0'>
                <div className='d-flex flex-wrap mt-1 mb-3'>
                    <div className='d-flex min-w-125px align-items-center py-2 me-5'>
                        <KTSVG
                            path='/img/calander_ic.svg'
                            className='svg-icon svg-icon-4'
                        />
                        <div className='ms-2 fs-5 card-main-designation svg-icon-color fw-semibold'>{ data.start_time !== 0 ? format(parseISO(data.start_time), 'dd, MMM, yyyy') : "Passed Datetime" }</div>
                        
                    </div>

                    <div className='d-flex min-w-125px align-items-center py-2'>
                        <KTSVG
                            path='/img/time_ic.svg'
                            className='svg-icon svg-icon-4'
                        />
                        <div className='ms-2 fs-5 card-main-designation svg-icon-color fw-semibold'>{ data.start_time !== 0 ? format(parseISO(data.start_time), 'HH:mm') + " - " + format(parseISO(addSomeMinutesToTime(data.start_time, parseInt(data.duration))), 'HH:mm') : "00:00 - 00:00" }</div>
                    </div>
                </div>
                
                <div className='d-flex justify-content-between flex-wrap mb-3 min-w-125px mb-3 pb-5'>
                    <div>
                        <UsersList users={users} />
                    </div>
                    {
                        data?.owner_joinlink && 
                        (<button
                            className={ verifyJoiningTimeInstructor(data.start_time) ? 'btn card-main-button fs-7 p-0 py-3 px-5 fw-bold enroll' : 'btn card-main-button fs-7 p-0 py-3 px-5 fw-bold themebtnblue enroll' }
                            type='button'
                            disabled={isbtnDisable}
                            //verifyJoiningTimeInstructor(data.start_time)
                            onClick={() => handleJoinbtn(verifyJoiningTimeInstructor(data.start_time), data.join_link)}
                        >
                            Start Session
                        </button>) 
                    }
                </div>
            </div>
        </Link>
    )
}

export { MeetingList }