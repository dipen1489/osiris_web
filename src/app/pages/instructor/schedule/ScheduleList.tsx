/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { PageTitle } from '../../../../_metronic/layout/core'
import { useMemo } from "react";
import { CalendarItem } from "../schedule/CalendarItem";
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { UsersListLoading } from '../dashboard/components/loading/UsersListLoading';
import { addSomeMinutesToTime } from '../../../modules/helper';
import { useIntl } from 'react-intl';
import { IconUserModel } from '../../component/core/_Models';
import { ScheduleData } from './core/_models';
import { Loader } from '../../component/Loader';

const ScheduleList = () => {
    const intl = useIntl()
    
    const meetingDetail = useQueryResponseData()
    const isLoading = useQueryResponseLoading()
    const data: ScheduleData[] = useMemo(() => meetingDetail, [meetingDetail])  
    const eventData : any = []

    if(!isLoading){
        for (var i = 0; i < data.length; i++) {
            for(var j = 0; j < data[i].date_time.length; j++){
                const users: Array<IconUserModel> = []

                if(data[i].date_time[j].enrolled_users === 1){
                    users.push({name: '', avatar: '/img/user_sm1.png',})
                }
                else if(data[i].date_time[j].enrolled_users === 2){
                    users.push({name: '', avatar: '/img/user_sm1.png',})
                    users.push({name: '', avatar: '/img/user_sm2.png',})
                }
                else if(data[i].date_time[j].enrolled_users === 3){
                    users.push({name: '', avatar: '/img/user_sm1.png',})
                    users.push({name: '', avatar: '/img/user_sm2.png',})
                    users.push({name: '', avatar: '/img/user_sm3.png',})
                }
                else if(data[i].date_time[j].enrolled_users > 3){
                    const ucount = data[i].date_time[j].enrolled_users - 3
                    users.push({name: '', avatar: '/img/user_sm1.png',})
                    users.push({name: '', avatar: '/img/user_sm2.png',})
                    users.push({name: '', avatar: '/img/user_sm3.png',})
                    users.push({name: '', initials: `+${ucount}`, color: 'primary', numbers: ucount})
                }
                const eventadditionlst : any = {}
                
                eventadditionlst['id'] = data[i].id
                eventadditionlst['title'] = data[i].title
                eventadditionlst['joinlink'] = data[i].owner_joinlink
                eventadditionlst['overlap'] = false
                eventadditionlst['meetingId'] = data[i].id
                eventadditionlst['start_time'] = data[i].date_time[j].start_time
                eventadditionlst['end'] = addSomeMinutesToTime(data[i].date_time[j].start_time, data[i].duration!)
                eventadditionlst['eventUser'] = users
                eventadditionlst['eventUserCount'] = data[i].date_time[j].enrolled_users

                const eventlst: {[key: string]: any} = {
                    additional: eventadditionlst,
                    id: j+"_"+ data[i].id,
                    title: data[i].title,
                    start: data[i].date_time[j].start_time,
                    end: addSomeMinutesToTime(data[i].date_time[j].start_time, data[i].duration),
                    joinlink: data[i].owner_joinlink,
                    overlap: true,
                    meetingId: data[i].id,
                    eventUser: users,
                    eventUserCount: data[i].date_time[j].enrolled_users,
                    start_time: data[i].date_time[j].start_time,
                }
                eventData.push(eventlst);
            }
        }
    }

    return (
        <>
            <div className='row h-100 g-5 g-xl-8 mb-5 mb-xl-10'>
                {isLoading && <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> }
                <div className='col-xl-12'>
                    <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.SCHEDULE' })}</PageTitle>
                    {!isLoading && data && <CalendarItem currentEvents={eventData} weekendsVisible={true} option={true} />}
                </div>
            </div>
        </>
    )
}

export { ScheduleList }
