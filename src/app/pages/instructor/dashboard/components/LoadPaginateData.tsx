/* eslint-disable react-hooks/exhaustive-deps */
import { MeetingList } from './MeetingList'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'

type Props = {
    meetingData: any
    search?: string
}

const DashboardTable: React.FC<Props> = ({ meetingData }) => {

  return (
    <>
      {
        (meetingData && 
        meetingData.length > 0) ? 
        (meetingData.map((row: any, i: number) => {
            return <MeetingList data={row} index={i} />
          })
        ) : 
        (
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
    </>
  )
}

export {DashboardTable}
