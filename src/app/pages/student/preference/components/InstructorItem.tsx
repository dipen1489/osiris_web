/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, Dispatch, SetStateAction, useEffect, } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers'
// import { uint8array, imgTobase64String, userimg } from '../../../../modules/helper';
import { PreferenceInstructor, PreferencesGetData } from '../core/_models';
import { userimg } from '../../../../modules/helper';

type Props = {
    data: PreferenceInstructor
    index: number
    Preference: any | PreferencesGetData
    setInstructorPreference: Dispatch<SetStateAction<any[]>>;
}

//const getRandomElement = (arr: any[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined

const InstructorItem: React.FC<Props> = ({ data, index, Preference, setInstructorPreference }) => {

    // const arrayBuffer = data.profilePic !== "" ? data.profilePic.data.data : [] as ArrayLike<number> | ArrayBuffer
    // const base64String = imgTobase64String(uint8array(arrayBuffer))

    const [favorite, setFavorite] = useState<boolean>(false)
    const fullname = data.firstName + ' ' + data.lastName
    const toggleFavorite = (recipeId: any) => {
        setFavorite((favorite) => {
            if (favorite === true) {
                setInstructorPreference(instructorPreference => [...instructorPreference.filter((item) => { return item !== recipeId })]);
            }
            if (favorite === false) {
                setInstructorPreference(instructorPreference => [...instructorPreference, recipeId]);
            }
            return !favorite;
        });
    }

    useEffect(() => {
        if(Preference != null && Preference !== "" && Preference.instructorIds.length > 0){
            Preference.instructorIds.some((x: string) => {
                if(x === data.id){
                    setInstructorPreference(instructorPreference => [...instructorPreference, data.id])
                    setFavorite(true)
                    return true
                }
                else{
                    setInstructorPreference(instructorPreference => [...instructorPreference.filter((item) => { return item !== data.id })]);
                    setFavorite(false)
                    return false
                }
            })
        }
    }, [setInstructorPreference, data.id, Preference]);

    return (
        <div className='categories-main' key={index}>
            <div className="flex-column overflow-hidden text-center">
                <div className='overlay'>
                    <div className='overlay-wrapper'>
                        {/* {base64String ? (<img src={`data:image/png;base64,${base64String}`}
                            className='categories-img'
                            alt={`${data.profilePic.name}`} />) : (<img src={toAbsoluteUrl(getRandomElement(userimg))}
                                className='categories-img'
                                alt={`${data.profilePic.name}`} />)} */}
                    <img src={data.profilePic ? data.profilePic : toAbsoluteUrl('img/blank.svg')}
                            className='categories-img'
                            alt={fullname} />

                    </div>
                    <button key={data.id} className="overlay-layer bg-transparent categories-img-favorite"
                        onClick={() => toggleFavorite(data.id)}>
                        {favorite === true ? (<KTSVG
                            path='/img/like_ic.svg'
                            className='svg-icon svg-icon-1'
                        />) : (<KTSVG
                            path='/img/unlike_ic.svg'
                            className='svg-icon svg-icon-1'
                        />)}
                    </button>
                </div>
                <div className="m-0">
                    <div className="fw-bold fs-5 text-dark my-2"
                        style={{ color: '#293039' }}>
                            { fullname.trim().length > 14 ? fullname.substring(0,14)+'...' : fullname }
                            
                    </div>
                </div>
                <div className="m-0">
                    <div className="fw-semibold fs-6 my-2 mb-0 " style={{color: '#919499'}}>
                        {data.expertise.length !== 0 ? data.expertise.length > 17 ? data.expertise.substring(0,17)+'...' : data.expertise : data.role }
                    </div>
                </div>
            </div>
        </div>
    )
}

export { InstructorItem }