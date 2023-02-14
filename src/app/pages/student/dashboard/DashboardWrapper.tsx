/* eslint-disable react-hooks/exhaustive-deps */
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../../_metronic/layout/core'
import {FISRST_TIME_LOCAL_STORAGE_KEY} from "../../../modules/auth";
import React, {ContextType, useMemo, useState, useEffect} from "react";
import {DashboardTable} from "./components/LoadPaginateData";
import {ScrollMenu, VisibilityContext} from 'react-horizontal-scrolling-menu';
import useDrag from "../preference/useDrag";
import { UserPreference } from '../preference/PreferenceList';
import { useQueryResponse, useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider';
import { MeetingList } from './components/MeetingList';
import { initialMeetingQueryState, toAbsoluteUrl } from '../../../../_metronic/helpers';
import { useQueryRequest } from './core/QueryRequestProvider';
import { All, Enrolled, GetAllMeeting, Interest } from './core/_models';
import { Loader } from '../../component/Loader';

type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;
const DashboardWrapper = () => {
    const intl = useIntl()
    const {updateState} = useQueryRequest()

    const {dragStart, dragStop, dragMove} = useDrag();
    const handleDrag = ({scrollContainer}: scrollVisibilityApiType) => ( ev: React.MouseEvent) =>
                        dragMove(ev, (posDiff) => {
                            if (scrollContainer.current) {
                                scrollContainer.current.scrollLeft += posDiff;
                            }
                        });

    const isfirstTime: string | null = localStorage.getItem(FISRST_TIME_LOCAL_STORAGE_KEY)
    let isfirstTimes: String, setIsFirstTime: (value: (((prevState: String) => String) | String)) => void;
    // @ts-ignore
    [isfirstTimes, setIsFirstTime] = useState<String>(isfirstTime);
    const {refetch} = useQueryResponse()
    const meetingData = useQueryResponseData()
    const isLoading = useQueryResponseLoading()
    const element = document.body.querySelector('input[name="search"]') as HTMLInputElement
    
    const meeting_Data = useMemo(() => meetingData, [meetingData])
    const msData: any | GetAllMeeting = meeting_Data

    const [viewAllEnrolled, setViewAllEnrolled] = useState<boolean>(false)
    const [viewAllInterested, setViewAllInterested] = useState<boolean>(false)
    const [viewAll, setViewAll] = useState<boolean>(false)
    const [isEnterKey, setIsEnterKey] = useState<boolean>(false)

    const [enrolledMeetingList, setEnrolledMeetingList] = useState<Enrolled[]>(msData.enrolled)
    const [interestedMeetingList, setInterestedMeetingList] = useState<Interest[]>(msData.interest)
    const [allMeetingList, setAllMeetingList] = useState<All[]>(msData.all)
    const [search, setSearch] = useState<string>('')
    
    useEffect(() => {
        refetch()
    },[isfirstTimes])

    useEffect(() => {
        setEnrolledMeetingList(msData.enrolled)
        setInterestedMeetingList(msData.interest)
        setAllMeetingList(msData.all)
    },[!isLoading])
    
    const toggleEnrolled = () => {
        setViewAllEnrolled((viewAllEnrolled) => {
            return !viewAllEnrolled;
        });
    }

    const toggleInterested = () => {
        setViewAllInterested((viewAllInterested) => {
            return !viewAllInterested;
        });
    }

    const toggleViewAll = () => {
        setViewAll((viewAll) => {
            return !viewAll;
        });
    }

    useEffect(() => {
        if(element){
            // element.addEventListener("keyup", ({key}) => {
            //     if(key !== 'Backspace' && key !== 'Delete')
            //     {
            //         setSearch(element.value.trim())
            //         if (key === "Enter") {
            //             setIsEnterKey(true)
            //             updateState({
            //                 search: element.value, limit: 'all',
            //             })
            //         }

            //         if(key === "Enter" && element.value.trim().length > 0){
            //             setTimeout(() => {
            //                 refetch()
            //             }, 1000);
            //         }

            //         if(typeof msData.enrolled !== 'undefined'){
            //             const enrolledfilteredData = msData.enrolled.filter((item: { tag: string; }) => item.tag.toLowerCase().includes(element.value.trim().toLowerCase()))
            //             setEnrolledMeetingList(enrolledfilteredData)
            //         }
            //         if(typeof msData.interest !== 'undefined'){
            //             const interestedfilteredData = msData.interest.filter((item: { tag: string; }) => item.tag.toLowerCase().includes(element.value.trim().toLowerCase()))
            //             setInterestedMeetingList(interestedfilteredData)
            //         }
            //         if(typeof msData.all !== 'undefined'){
            //             const allfilteredData = msData.all.filter((item: { tag: string; }) => item.tag.toLowerCase().includes(element.value.trim().toLowerCase()))
            //             setAllMeetingList(allfilteredData)
            //         }
            //     }
            //     else if((key === 'Backspace' && element.value.trim().length >= 0) || (key === 'Delete' && element.value.trim().length >= 0))
            //     {
            //         setEnrolledMeetingList(msData.enrolled)
            //         setInterestedMeetingList(msData.interest)
            //         setAllMeetingList(msData.all)
            //         setIsEnterKey(false)
            //         setSearch("")
            //         if(isEnterKey === true && element.value.trim().length <= 0){
            //             setIsEnterKey(false)
            //             updateState({
            //                 ...initialMeetingQueryState,
            //             })
            //             setTimeout(() => {
            //                 refetch()
            //             }, 1000);
            //         }
                   
            //     }
            // })

            element.addEventListener("keydown", (event) => {
                console.log(event.key);
                console.log(element.value.trim().length);
                
                if((event.key !== 'Backspace' || event.keyCode !== 8) && (event.key !== 'Delete' || event.keyCode !== 46) && element.value.trim().length > 0)
                {
                    setSearch(element.value.trim())
                    if (event.key === "Enter" || event.keyCode === 13) {
                        setIsEnterKey(true)
                        updateState({
                            search: element.value, limit: 'all',
                        })
                    }

                    if((event.key === "Enter" || event.keyCode === 13) && element.value.trim().length > 0){
                        setTimeout(() => {
                            refetch()
                        }, 1000);
                    }

                    if(typeof msData.enrolled !== 'undefined'){
                        let enrolledfilteredData = msData.enrolled.filter((value: { tag: string; }) => {
                            return (value.tag!.toLowerCase().includes(element.value.trim()!.toLowerCase()));
                        });
                        // const enrolledfilteredData = msData.enrolled.filter((item: { tag: string; }) => item.tag.toLowerCase().includes(element.value.trim().toLowerCase()))
                        setEnrolledMeetingList(enrolledfilteredData)
                    }
                    if(typeof msData.interest !== 'undefined'){
                        let interestedfilteredData = msData.interest.filter((value: { tag: string; }) => {
                            return (value.tag!.toLowerCase().includes(element.value.trim()!.toLowerCase()));
                        });
                        // const interestedfilteredData = msData.interest.filter((item: { tag: string; }) => item.tag.toLowerCase().includes(element.value.trim().toLowerCase()))
                        setInterestedMeetingList(interestedfilteredData)
                    }
                    if(typeof msData.all !== 'undefined'){
                        let allfilteredData = msData.all.filter((value: { tag: string; }) => {
                            return (value.tag!.toLowerCase().includes(element.value.trim()!.toLowerCase()));
                        });
                        // const allfilteredData = msData.all.filter((item: { tag: string; }) => item.tag.toLowerCase().includes(element.value.trim().toLowerCase()))
                        setAllMeetingList(allfilteredData)
                    }
                }
                else if((event.key === 'Backspace' && element.value.trim().length >= 0) || (event.key === 'Delete' && element.value.trim().length >= 0))
                {
                    setEnrolledMeetingList(msData.enrolled)
                    setInterestedMeetingList(msData.interest)
                    setAllMeetingList(msData.all)
                    setIsEnterKey(false)
                    setSearch("")
                    if(isEnterKey === true && element.value.trim().length >= 0){
                        setIsEnterKey(false)
                        updateState({
                            ...initialMeetingQueryState,
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
                isLoading ? (<Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> ) : 
                (isfirstTimes === '0' || isfirstTimes === 'false') ? 
                (<>
                    {enrolledMeetingList && 
                        (viewAllEnrolled ? 
                            (<div className='row g-5 g-xl-5 mb-5 mb-xl-10'>
                                <div className='col-xl-12'>
                                    <div className='d-flex flex-wrap flex-stack mb-5 mb-lg-5'>
                                        <h2 className='d-flex flex-column flex-grow-1 pe-8 fw-bolder fs-4 fs-lg-1' style={{color: '#144067'}}>My Training Sessions</h2>
                                        <button 
                                            onClick={() => toggleEnrolled()}
                                            className='btn btn-sm fw-bold btn-outline btn-outline-dark d-flex align-items-center flex-column'
                                            style={{
                                                paddingLeft: 14,
                                                paddingRight: 14,
                                                paddingTop: 6,
                                                paddingBottom: 6,
                                                color: '#144067',
                                                borderRadius: 5,
                                                borderColor: '#144067'
                                        }}>
                                            VIEW LESS
                                        </button>
                                    </div>
                                    <div className='d-flex flex-wrap'>
                                        <DashboardTable meetingData='enrolled' search={search} />
                                    </div>
                                </div>
                            </div>) : 

                            (<div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
                                <div className='col-xl-12'>
                                    <div className='d-flex flex-wrap flex-stack mb-5 mb-lg-5'>
                                        <h2 className='d-flex flex-column flex-grow-1 pe-8 fw-bolder fs-4 fs-lg-1' style={{color: '#144067'}}>My Training Sessions</h2>
                                        {enrolledMeetingList.length > 0 && 
                                            (<button onClick={() => toggleEnrolled()}
                                                className='btn btn-sm fw-bold btn-outline btn-outline-dark d-flex align-items-center flex-column'
                                                style={{
                                                    paddingLeft: 14,
                                                    paddingRight: 14,
                                                    paddingTop: 6,
                                                    paddingBottom: 6,
                                                    color: '#144067',
                                                    borderRadius: 5,
                                                    borderColor: '#144067'
                                            }}>
                                                VIEW ALL
                                            </button>)
                                        }
                                    </div>
                                    {enrolledMeetingList.length > 0 ? 
                                        (<div onMouseLeave={dragStop}>
                                            <ScrollMenu
                                                onWheel={onWheel}
                                                onMouseDown={() => dragStart}
                                                onMouseUp={() => dragStop}
                                                onMouseMove={handleDrag}
                                            >
                                                {enrolledMeetingList.map((element: any, index: number) => {
                                                    return <MeetingList data={element} index={index} />
                                                })}
                                            </ScrollMenu>
                                        </div>) : 
                                        (<div className="card-body d-flex flex-column justify-content-between mt-0 bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0">
                                            <img className="mx-auto h-100px h-lg-150px theme-light-show" src={toAbsoluteUrl('/img/21.png')} alt=""/>
                                            <img className="mx-auto h-100px h-lg-150px theme-dark-show" src={toAbsoluteUrl('/img/21-dark.png')} alt=""/>
                                            <div className="mt-1">
                                                <div className="fs-1hx fw-bold text-gray-800 text-center mb-13">
                                                    <span className="me-2">No session(s) found...</span>
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                </div>
                            </div>)
                        )
                    }
                    
                    {interestedMeetingList && 
                        (viewAllInterested ? 
                            (<div className='row g-5 g-xl-5 mb-5 mb-xl-10'>
                                <div className='col-xl-12'>
                                    <div className='d-flex flex-wrap flex-stack mb-5 mb-lg-5'>
                                        <h2 className='d-flex flex-column flex-grow-1 pe-8 fw-bolder fs-4 fs-lg-1' style={{color: '#144067'}}>Training Sessions - by Favorite Instructors</h2>
                                        <button 
                                            onClick={() => toggleInterested()}
                                            className='btn btn-sm fw-bold btn-outline btn-outline-dark d-flex align-items-center flex-column'
                                            style={{
                                                paddingLeft: 14,
                                                paddingRight: 14,
                                                paddingTop: 6,
                                                paddingBottom: 6,
                                                color: '#144067',
                                                borderRadius: 5,
                                                borderColor: '#144067'
                                        }}>
                                            VIEW LESS
                                        </button>
                                    </div>
                                    <div className='d-flex flex-wrap'>
                                        <DashboardTable meetingData='interested' search={search} />
                                    </div>
                                </div>
                            </div>) : 

                            (<div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
                                <div className='col-xl-12'>
                                    <div className='d-flex flex-wrap flex-stack mb-5 mb-lg-5'>
                                        <h2 className='d-flex flex-column flex-grow-1 pe-8 fw-bolder fs-4 fs-lg-1' style={{color: '#144067'}}>Training Sessions - by Favorite Instructors</h2>
                                        {interestedMeetingList.length > 0&& 
                                            (<button onClick={() => toggleInterested()}
                                                className='btn btn-sm fw-bold btn-outline btn-outline-dark d-flex align-items-center flex-column'
                                                style={{
                                                    paddingLeft: 14,
                                                    paddingRight: 14,
                                                    paddingTop: 6,
                                                    paddingBottom: 6,
                                                    color: '#144067',
                                                    borderRadius: 5,
                                                    borderColor: '#144067'
                                            }}>
                                                VIEW ALL
                                            </button>)
                                        }
                                    </div>
                                    {interestedMeetingList.length > 0 ? 
                                        (<div onMouseLeave={dragStop}>
                                            <ScrollMenu
                                                onWheel={onWheel}
                                                onMouseDown={() => dragStart}
                                                onMouseUp={() => dragStop}
                                                onMouseMove={handleDrag}
                                            >
                                                {interestedMeetingList.map((element: any, index: number) => {
                                                    return <MeetingList data={element} index={index} />
                                                })}
                                            </ScrollMenu>
                                        </div>) : 
                                        (<div className="card-body d-flex flex-column justify-content-between mt-0 bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0">
                                            <img className="mx-auto h-100px h-lg-150px theme-light-show" src={toAbsoluteUrl('/img/21.png')} alt=""/>
                                            <img className="mx-auto h-100px h-lg-150px theme-dark-show" src={toAbsoluteUrl('/img/21-dark.png')} alt=""/>
                                            <div className="mt-1">
                                                <div className="fs-1hx fw-bold text-gray-800 text-center mb-13">
                                                    <span className="me-2">No session(s) found...</span>
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                </div>
                            </div>)
                        )
                    }
                    
                    {allMeetingList && 
                        (allMeetingList && viewAll ? 
                            (<div className='row g-5 g-xl-5 mb-5 mb-xl-10'>
                                <div className='col-xl-12'>
                                    <div className='d-flex flex-wrap flex-stack mb-5 mb-lg-5'>
                                        <h2 className='d-flex flex-column flex-grow-1 pe-8 fw-bolder fs-4 fs-lg-1' style={{color: '#144067'}}>All Training Sessions</h2>
                                        <button 
                                            onClick={() => toggleViewAll()}
                                            className='btn btn-sm fw-bold btn-outline btn-outline-dark d-flex align-items-center flex-column'
                                            style={{
                                                paddingLeft: 14,
                                                paddingRight: 14,
                                                paddingTop: 6,
                                                paddingBottom: 6,
                                                color: '#144067',
                                                borderRadius: 5,
                                                borderColor: '#144067'
                                        }}>
                                            VIEW LESS
                                        </button>
                                    </div>
                                    <div className='d-flex flex-wrap'>
                                        <DashboardTable meetingData='all' search={search} />
                                    </div>
                                </div>
                            </div>) : 

                            (<div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
                                <div className='col-xl-12'>
                                    <div className='d-flex flex-wrap flex-stack mb-5 mb-lg-5'>
                                        <h2 className='d-flex flex-column flex-grow-1 pe-8 fw-bolder fs-4 fs-lg-1' style={{color: '#144067'}}>All Training Sessions</h2>
                                        {allMeetingList.length > 0 && 
                                            (<button onClick={() => toggleViewAll()}
                                                className='btn btn-sm fw-bold btn-outline btn-outline-dark d-flex align-items-center flex-column'
                                                style={{
                                                    paddingLeft: 14,
                                                    paddingRight: 14,
                                                    paddingTop: 6,
                                                    paddingBottom: 6,
                                                    color: '#144067',
                                                    borderRadius: 5,
                                                    borderColor: '#144067'
                                            }}>
                                                VIEW ALL
                                            </button>)
                                        }
                                    </div>
                                    {allMeetingList.length > 0 ? 
                                        (<div onMouseLeave={dragStop}>
                                            <ScrollMenu
                                                onWheel={onWheel}
                                                onMouseDown={() => dragStart}
                                                onMouseUp={() => dragStop}
                                                onMouseMove={handleDrag}
                                            >
                                                {allMeetingList.map((element: any, index: number) => {
                                                    return <MeetingList data={element} index={index} />
                                                })}
                                            </ScrollMenu>
                                        </div>) : 
                                        (<div className="card-body d-flex flex-column justify-content-between mt-0 bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0">
                                            <img className="mx-auto h-100px h-lg-150px theme-light-show" src={toAbsoluteUrl('/img/21.png')} alt=""/>
                                            <img className="mx-auto h-100px h-lg-150px theme-dark-show" src={toAbsoluteUrl('/img/21-dark.png')} alt=""/>
                                            <div className="mt-1">
                                                <div className="fs-1hx fw-bold text-gray-800 text-center mb-13">
                                                    <span className="me-2">No session(s) found...</span>
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                </div>
                            </div>)
                        )
                    }
                </>) : 
                (<UserPreference setIsFirstTime={setIsFirstTime}/>)
            }
        </>
    )
}

export {DashboardWrapper}

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
        ev.stopPropagation();
        return;
    }

    if (ev.deltaY < 0) {
        apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
        apiObj.scrollPrev();
    }
}