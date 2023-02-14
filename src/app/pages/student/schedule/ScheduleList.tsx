/* eslint-disable jsx-a11y/img-redundant-alt */
import { PageTitle } from '../../../../_metronic/layout/core'
import { useMemo, useEffect, useState } from "react";
import { CalendarItem } from "../schedule/CalendarItem";
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { addSomeMinutesToTime } from '../../../modules/helper';
import { useIntl } from 'react-intl';
import { IconUserModel } from '../../component/core/_Models';
import { useQueryRequest } from './core/QueryRequestProvider';
import { format } from 'date-fns';
import { initialMeetingQueryRequest } from '../../../../_metronic/helpers/crud-helper/models';
import { Loader } from '../../component/Loader';
import moment from 'moment';

const ScheduleList = () => {
    const intl = useIntl()
    const {updateState} = useQueryRequest()
    const [isSubmit, setIsSubmit] = useState<boolean>(false)

    useEffect(() => {
        updateState({
            gte: format(moment().toDate(), 'y-MM-dd'),
            limit: '15',
            ...initialMeetingQueryRequest
        })
    })
    
    const meetingDetail = useQueryResponseData()
    const isLoading = useQueryResponseLoading()
    const data: any = useMemo(() => meetingDetail, [meetingDetail])  
    const eventData : any = []

    if (!isLoading) {
        
        for (var i = 0; i < data.length; i++) {

            const users: Array<IconUserModel> = []

            if(data[i].enrolled_users === 1){
                users.push({name: '', avatar: '/img/user_sm1.png',})
            }
            else if(data[i].enrolled_users === 2){
                users.push({name: '', avatar: '/img/user_sm1.png',})
                users.push({name: '', avatar: '/img/user_sm2.png',})
            }
            else if(data[i].enrolled_users === 3){
                users.push({name: '', avatar: '/img/user_sm1.png',})
                users.push({name: '', avatar: '/img/user_sm2.png',})
                users.push({name: '', avatar: '/img/user_sm3.png',})
            }
            else if(data[i].enrolled_users > 3){
                const ucount = data[i].enrolled_users - 3
                users.push({name: '', avatar: '/img/user_sm1.png',})
                users.push({name: '', avatar: '/img/user_sm2.png',})
                users.push({name: '', avatar: '/img/user_sm3.png',})
                users.push({name: '', initials: `+${ucount}`, color: 'primary', numbers: ucount})
            }

            const eventlst : any = []
            eventlst['id'] = data[i].id
            eventlst['title'] = data[i].title
            eventlst['start'] = data[i].start_time
            eventlst['end'] = addSomeMinutesToTime(data[i].start_time, parseInt(data?.duration || 30))
            eventlst['overlap'] = false
            eventlst['additional'] = data[i]
            eventlst['meetingId'] = data[i].id
            eventlst['eventUser'] = users
            eventlst['eventUserCount'] = data[i].enrolled_users
            eventData.push(eventlst);
        }
    }

    return (
        <>
            <div className='row h-100 g-5 g-xl-8 mb-5 mb-xl-10'>
                {(isLoading || isSubmit) && <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} />}
                <div className='col-xl-12'>
                    <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.SCHEDULE' })}</PageTitle>
                    {!isLoading && data && <CalendarItem currentEvents={eventData} weekendsVisible={true} option={true} setIsSubmit={setIsSubmit} />}
                </div>
            </div>
        </>
    )
}

export { ScheduleList }
