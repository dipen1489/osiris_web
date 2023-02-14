/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { imgTobase64String, uint8array, userimg } from '../../../../modules/helper'
import { PreferenceCategory, PreferencesGetData } from '../core/_models';

type Props = {
    data: PreferenceCategory
    index: number
    Preference: any | PreferencesGetData
    setCategoryPreference: Dispatch<SetStateAction<any[]>>;
}

const getRandomElement = (arr: any[]) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined

const CategoriesItem: React.FC<Props> = ({ data, index, Preference, setCategoryPreference }) => {

    // const arrayBuffer = data.image !== "" ? data.image.data.data : [] as ArrayLike<number> | ArrayBuffer
    // const base64String = imgTobase64String(uint8array(arrayBuffer))

    const [favorite, setFavorite] = useState<boolean>(false)

    const toggleFavorite = (recipeId: any) => {
        setFavorite((favorite) => {
            if (favorite === true) {
                setCategoryPreference(categoryPreference => [...categoryPreference.filter((item) => { return item !== recipeId })]);
            }
            if (favorite === false) {
                setCategoryPreference(categoryPreference => [...categoryPreference, recipeId]);
            }
            return !favorite;
        });
    }
    useEffect(() => {
        if(Preference != null && Preference !== "" && Preference.categoryIds.length > 0){
            Preference.categoryIds.some((x: string) => {
                if(x === data.id){
                    setCategoryPreference(categoryPreference => [...categoryPreference, data.id])
                    setFavorite(true)
                    return true
                }
                else{
                    setCategoryPreference(categoryPreference => [...categoryPreference.filter((item) => { return item !== data.id })]);
                    setFavorite(false)
                    return false
                }
            })
        }
    }, [setCategoryPreference, data.id, Preference])

    return (
        <div className='categories-main'>
            <div className="flex-column overflow-hidden text-center">
                <div className='overlay'>
                    <div className='overlay-wrapper'>
                    {/* {base64String ? (<img src={`data:image/png;base64,${base64String}`}
                            className='categories-img'
                            alt={`${data.image.name}`} />) : (<img src={toAbsoluteUrl(getRandomElement(userimg))}
                                className='categories-img'
                                alt={`${data.image.name}`} />)} */}
                    <img src={data.image ? data.image : toAbsoluteUrl('img/blank.svg')}
                            className='categories-img'
                            alt={data.name} />
                    </div>
                    <button key={index} className="overlay-layer bg-transparent categories-img-favorite"
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
                    <div className="fw-bold fs-5 text-dark my-3 mb-0"
                        style={{ color: '#293039' }}>
                            { data.name.trim().length > 33 ? data.name.substring(0,33)+'...' : data.name }
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CategoriesItem }