/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react'
import { MeetingList } from './MeetingList'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import {useState} from 'react';
import { UsersListLoading } from './loading/UsersListLoading';
import { format } from 'date-fns';
import { getAllMeetingList, getEnrolledMeetingList, getInterestedMeetingList } from '../core/_requests';
import { toast } from 'react-hot-toast';
import moment from 'moment';

type Props = {
    meetingData: any
    search?: string
}

const DashboardTable: React.FC<Props> = ({ meetingData, search }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  

  async function fetchData() {
    var query = "gte="+format(moment().toDate(), 'y-MM-dd')+"&limit=all"
    if(search !== ""){
      query = "gte="+format(moment().toDate(), 'y-MM-dd')+"&limit=all&search="+search
    }
    
    setIsLoading(true)

    if(meetingData === 'enrolled'){
      await getEnrolledMeetingList(query).then(
        (response) => {
            setData(response.data)
            setIsLoading(false)
        },
        (error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                setIsLoading(false)
            toast.error(resMessage)
        });
    }
    else if(meetingData === 'interested'){
      await getInterestedMeetingList(query).then(
        (response) => {
            setData(response.data)
            setIsLoading(false)
        },
        (error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                
            setIsLoading(false)
            toast.error(resMessage)
        });
    }
    else if(meetingData === 'all'){
      await getAllMeetingList(query).then(
        (response: any) => {
          setData(response.data?.all)
          setIsLoading(false)
        },
        (error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setIsLoading(false)
            toast.error(resMessage)
        });
    }
  }
  

  useEffect(() => {    
    fetchData();
  }, [])

  

  return (
    <>
      {isLoading ? <UsersListLoading /> : data && data.length > 0 ? (
          data.map((row: any, i: number) => {
            return <MeetingList data={row} index={i} isFromViewAll={true} />
          })
        ) : (
          <div className="card-body d-flex flex-column justify-content-between mt-0 bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0">
              <img className="mx-auto h-100px h-lg-150px theme-light-show" src={toAbsoluteUrl('/img/21.png')} alt=""/>
              <img className="mx-auto h-100px h-lg-150px theme-dark-show" src={toAbsoluteUrl('/img/21-dark.png')} alt=""/>
              <div className="mt-1">
                  <div className="fs-1hx fw-bold text-gray-800 text-center mb-13">
                      <span className="me-2">No session(s) found...</span>
                  </div>
              </div>
          </div>
        )}
      {/* <UsersListPagination /> */}
    </>
  )
}

export {DashboardTable}
