/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useRef, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../../_metronic/layout/core'
import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { usePopper } from 'react-popper';
import FocusTrap from 'focus-trap-react';
import { KTSVG } from '../../../../_metronic/helpers/components/KTSVG';
import { Link } from 'react-router-dom';
import { useQueryRequest } from './core/QueryRequestProvider';
import { useQueryResponse, useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { DashboardTable } from './components/LoadPaginateData';
import { getMonthEndDate, getWeekEndDate, getYearEndDate } from '../../../modules/helper';
import { MeetingData, MeetingDataList } from './core/_models';
import { Loader } from '../../component/Loader';
import moment from 'moment';

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  // const today = new Date();
  const today = moment().toDate();
  
  const meetingData = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const {updateState} = useQueryRequest()
  const {refetch} = useQueryResponse()

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(today);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const popperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null 
  );
  const [loading, setLoading] = useState<boolean>(true)

  const [isWeekData, setIsWeekData] = useState<boolean>(false)
  const [isMonthData, setIsMonthData] = useState<boolean>(true)
  const [isYearData, setIsYearData] = useState<boolean>(false)
  const [isSetTitle, setIsSetTitle] = useState<string>(intl.formatMessage({id: 'DASHBOARD.MONTH'}))

  const element = document.body.querySelector('input[name="search"]') as HTMLInputElement
  const [isEnterKey, setIsEnterKey] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const msData: MeetingDataList | any = meetingData
  const [MeetingList, setMeetingList] = useState<MeetingData[]>(msData)

  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start'
  });

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const defaultSelected: DateRange = {
    from: today,
    to: addDays(today, 0)
  };
  
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

  useEffect(() => {
      updateData(format(range?.from ?? today, 'y-MM-dd'),format(range?.to ?? today, 'y-MM-dd'));
      if(format(range?.from ?? today, 'y-MM-dd') !== format(range?.to ?? today, 'y-MM-dd')){
        setIsSetTitle("Result for : " + format(range?.from ?? today, 'y-MM-dd') + ' to ' + format(range?.to ?? today, 'y-MM-dd'))
      }
      //closePopper();
  },[range])

  // const handleDaySelect = (date?: Date) => {
  //   setSelectedDay(date);
  //   if (date) {
  //     updateData(format(date, 'y-MM-dd'));
  //     closePopper();
  //   }
  // };

  const updateData = (gtedate: any, ltedate: any) => {
    updateState({gte:gtedate, lte: ltedate})
    setTimeout(() => {
        refetch()
    }, 100)
  }

  useEffect(() => {
    if(!isLoading && msData.length > 0){
      setMeetingList(msData)
      setLoading(false)
      setIsWeekData(false)
      setIsMonthData(false)
      setIsYearData(true)
    }
    else{
      setLoading(true)
      // if(!isLoading && isWeekData){
      //   setIsWeekData(false)
      //   setIsMonthData(true)
      //   updateData(format(today, 'y-MM-dd'), getWeekEndDate())
      //   setIsSetTitle(intl.formatMessage({id: 'DASHBOARD.WEEK'}))
      // }
      // else 
      if(!isLoading && isWeekData === false && isMonthData){
        updateData(format(today, 'y-MM-dd'), getMonthEndDate())
        setIsSetTitle(intl.formatMessage({id: 'DASHBOARD.MONTH'}))
        setIsMonthData(false)
        setIsYearData(true)
      }
      else if(!isLoading && isWeekData === false && isMonthData  === false && isYearData){
        updateData(format(today, 'y-MM-dd'), getYearEndDate())
        setIsSetTitle(intl.formatMessage({id: 'DASHBOARD.YEAR'}))
        setIsYearData(false)
      } 
      else if(!isLoading && isWeekData === false && isMonthData  === false && isYearData === false){
        setLoading(false)
      }
    }
  },[!isLoading])

  // useEffect(() => {
  //   if(!isLoading && loading === false) {
  //     if(meetingData.length === 0){
  //       if(isWeekData){
  //         setLoading(true)
  //         setIsWeekData(false)
  //         updateData(format(today, 'y-MM-dd'), getWeekEndDate())
  //         setIsSetTitle(intl.formatMessage({id: 'DASHBOARD.WEEK'}))
  //       }
  //       else if(isWeekData === false && isMonthData){
  //         setLoading(true)
  //         updateData(format(today, 'y-MM-dd'), getMonthEndDate())
  //         setIsSetTitle(intl.formatMessage({id: 'DASHBOARD.MONTH'}))
  //         setIsMonthData(false)
  //       }
  //       else if(isWeekData === false && isMonthData  === false && isYearData){
  //         setLoading(true)
  //         updateData(format(today, 'y-MM-dd'), getYearEndDate())
  //         setIsSetTitle(intl.formatMessage({id: 'DASHBOARD.YEAR'}))
  //         setIsYearData(false)
  //       } 
  //     }
  //     else{
  //       setLoading(false)
  //     }
  //   }
  // },[!isLoading, !loading])

  useEffect(() => {
    if(element){
        element.addEventListener("keyup", ({key}) => {
            if(key !== 'Backspace' && key !== 'Delete' && element.value.trim().length > 1)
            {
                if (key === "Enter") {
                    setIsEnterKey(true)
                    setLoading(true)
                    updateState({
                        search: element.value, limit: 'all', lte: '',
                    })
                    setIsSetTitle("Search For : "+element.value)
                }

                if(key === "Enter" && element.value.trim().length > 0){
                    setTimeout(() => {
                        refetch()
                    }, 1000);
                }
                setSearch(element.value.trim())
                if(typeof msData !== 'undefined'){
                    const enrolledfilteredData = msData.filter((item: { tag: string; }) => item.tag.toLowerCase().includes(element.value.toLowerCase()))
                    setMeetingList(enrolledfilteredData)
                }
            }
            else if((key === 'Backspace' && element.value.trim().length >= 0) || (key === 'Delete' && element.value.trim().length >= 0))
            {
                setMeetingList(msData)
                setIsEnterKey(false)
                setSearch("")
               
                if(isEnterKey === true && element.value.trim().length <= 0){
                    setIsEnterKey(false)
                    setIsWeekData(false)
                    setIsMonthData(true)
                    setIsYearData(false)
                    setIsSetTitle(intl.formatMessage({id: 'DASHBOARD.TODAYS'}))
                    updateState({
                      gte: format(today, 'y-MM-dd'),
                      lte: format(today, 'y-MM-dd'),
                      search: "",
                    })
                    setTimeout(() => {
                        refetch()
                    }, 1000);
                }
               
            }
        })
    }
},[!isLoading])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      {
        loading ? 
        <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> : 
              
        <div className='row g-5 g-xl-5 mb-5 mb-xl-10'>
          <div className='col-xl-12'>
            <div
              className='d-flex flex-wrap flex-stack mb-5 mb-lg-5'>
                <h2 className='d-flex flex-column flex-grow-1 pe-8 fw-bolder fs-4 fs-lg-1' style={{ color: '#144067' }}>
                  {
                    isSetTitle
                  }
                </h2>
              <div className='d-flex flex-wrap flex-stack'>
                <div ref={popperRef}>
                  <button
                      type='button'
                      className='btn btn-sm btn-icon btn-light btn-active-light-primary me-3'
                      data-kt-menu-trigger='click'
                      data-kt-menu-placement='bottom-end'
                      data-kt-menu-flip='top-end'
                      onClick={handleButtonClick}
                  >
                      <KTSVG
                          path='/img/calander_ic.svg'
                          className='svg-icon themeblue svg-icon-2'
                      />
                  </button>
                  {isPopperOpen && (
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
                        ref={setPopperElement}
                        role="dialog"
                      >
                        <DayPicker
                          initialFocus={isPopperOpen}
                          mode="range"
                          defaultMonth={selectedDay}
                          //fromYear={new Date().getFullYear()} toYear={new Date().getFullYear() + 10}
                          selected={range}
                          showOutsideDays
                          captionLayout="dropdown"
                          onSelect={setRange}
                        />
                      </div>
                    </FocusTrap>
                  )}
                </div>
                <Link 
                  className='btn btn-sm fw-bold btn-outline d-flex align-items-center connect flex-column' 
                  to={'/dashboard/createmeeting'}>
                  CREATE A SESSION
                </Link>
              </div>
            </div>
            <div className='d-flex flex-wrap'>
              <DashboardTable meetingData={MeetingList}/>
              
            </div>
          </div>
        </div>
      }
    </>
  )
}

export {DashboardWrapper}