import React, { ContextType, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useQueryResponseData, useQueryResponseLoading } from './core/QueryResponseProvider'

import { UsersListLoading } from './components/loading/UsersListLoading'
import { CategoriesItem } from "./components/CategoriesItem";
import { InstructorItem } from "./components/InstructorItem"
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import useDrag from "./useDrag";
import { FISRST_TIME_LOCAL_STORAGE_KEY } from '../../../modules/auth';
import { savePreference } from './core/_requests';
import { toast } from 'react-hot-toast';
import { Loader } from '../../component/Loader';

type scrollVisibilityApiType = ContextType<typeof VisibilityContext>;

type Props = {
    setIsFirstTime: Dispatch<SetStateAction<any>>;
}

const Preference: React.FC<Props> = ({setIsFirstTime}) => {
    const preferanceData = useQueryResponseData()
    const isLoading = useQueryResponseLoading()
    const [loading, setLoading] = useState(false)
    const preferance_Data = useMemo(() => preferanceData, [preferanceData])

    const [instructorPreference, setInstructorPreference] = useState<any[]>([])
    const [categoryPreference, setCategoryPreference] = useState<any[]>([])

    const { dragStart, dragStop, dragMove } = useDrag();
    const handleDrag = ({ scrollContainer }: scrollVisibilityApiType) => (
        ev: React.MouseEvent
    ) =>
        dragMove(ev, (posDiff) => {
            if (scrollContainer.current) {
                scrollContainer.current.scrollLeft += posDiff;
            }
        });

    const btnNextHandle = async (e: any) => {
        setLoading(true)
        const preferenceDataSet = {
            categoryIds: categoryPreference,
            instructorIds: instructorPreference
        }

        savePreference(preferenceDataSet)
        .then((result : any) => {
            if (result?.studentId !== "" && result?.id !== "") {
                localStorage.setItem(FISRST_TIME_LOCAL_STORAGE_KEY, String('false'));
                setIsFirstTime('false')
                window.dispatchEvent(new Event("preferenceupdate"));
                setLoading(false)
                toast.success("Preference updated successfully...")
            }
        },(error) => {
          const resMessage =
              (error.response &&
                  error.response.data &&
                  error.response.data.message) || error.response.data.error || error.response.data.error ||
              error.message ||
              error.toString();
          setLoading(false)
          toast.error(resMessage)
        })
        .catch(() => {
            setLoading(false)
            toast.error('Please try again later...')
        })
    };

    return (
        <>
            {
                isLoading ? 
                <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> : 
                <>
                    <div className="alert alert-primary d-flex align-items-center p-5 mb-10">
                        <span className="svg-icon svg-icon-2hx svg-icon-primary me-3">
                            <span className="svg-icon svg-icon-2hx svg-icon-primary me-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="#019ef7"></rect><rect x="11" y="17" width="7" height="2" rx="1" transform="rotate(-90 11 17)" fill="black"></rect><rect x="11" y="9" width="2" height="2" rx="1" transform="rotate(-90 11 9)" fill="black"></rect></svg> 
                            </span>
                        </span>
                        <div className="d-flex flex-column">
                            <h5 className="mb-1">Information</h5>
                            <span>Please select your favourite Category & Instructor by clicking on heart icon </span>
                        </div>
                    </div>
                    {preferance_Data[1].category && (
                        <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
                            <div className='col-xl-12'>
                                <h1 className="fw-bold fs-4 fs-lg-1 text-gray-800 mb-5 mb-lg-5" style={{ color: '#144067' }}>Select
                                    your
                                    Favorite Categories</h1>
                                <div onMouseLeave={dragStop}>
                                    <ScrollMenu
                                        onWheel={onWheel}
                                        onMouseDown={() => dragStart}
                                        onMouseUp={() => dragStop}
                                        onMouseMove={handleDrag}
                                    >
                                        {preferance_Data[2].preference ? (preferance_Data[1].category.data.map((element, index) => {
                                            return <CategoriesItem data={element} Preference={preferance_Data[2].preference.data} index={index} setCategoryPreference={setCategoryPreference} />
                                        }
                                        )) : (preferance_Data[1].category.data.map((element, index) => {
                                            return <CategoriesItem data={element} Preference="" index={index} setCategoryPreference={setCategoryPreference} />
                                        }
                                        ))}
                                    </ScrollMenu>
                                </div>
                            </div>
                        </div>)
                    }

                    <div className='row g-5 g-xl-8 mb-5 mb-xl-10'>
                        {preferance_Data[0].instructor && (
                            <div className='col-xl-12'>
                                <h1 className="fw-bold fs-4 fs-lg-1 text-gray-800 mb-5 mb-lg-5" style={{ color: '#144067' }}>Select your favorite instructor(s)</h1>
                                <div onMouseLeave={dragStop}>
                                    <ScrollMenu
                                        onWheel={onWheel}
                                        onMouseDown={() => dragStart}
                                        onMouseUp={() => dragStop}
                                        onMouseMove={handleDrag}
                                    >

                                        {preferance_Data[2].preference ? (preferance_Data[0].instructor.data.map((element, index) => {
                                            return <InstructorItem data={element} Preference={preferance_Data[2].preference.data} index={index} setInstructorPreference={setInstructorPreference} />
                                        }
                                        )) : (preferance_Data[0].instructor.data.map((element, index) => {
                                            return <InstructorItem data={element} Preference="" index={index} setInstructorPreference={setInstructorPreference} />
                                        }
                                        ))}
                                    </ScrollMenu>
                                </div>
                            </div>)
                        }
                        <div className='col-xl-12 d-block text-center'>
                            <button 
                                className="btn btn-next mx-3 my-5 px-10 py-3"
                                style={{ backgroundColor: '#144067', color: '#FFFFFF' }}
                                disabled={loading}
                                onClick={btnNextHandle}> 
                                {!loading && <span className='indicator-label'>SAVE</span>}
                                {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                    Please wait...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export { Preference }

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