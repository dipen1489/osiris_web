import {FC, useEffect, useRef, useState} from 'react'
import {KTSVG} from '../../../helpers'

const Search: FC = () => {
  const [searchVal, setSearchVal] = useState<string>('')
  const element = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Initialize search handler
    //const searchObject = SearchComponent.createInsance('#kt_header_search')

    // Search handler
    // searchObject!.on('kt.search.process', processs)
    //
    // // Clear handler
    // searchObject!.on('kt.search.clear', clear)
  }, [])

  return (
    <>
      <div
        id='kt_header_search'
        className='header-search d-flex align-items-center w-100'
        data-kt-search-keypress='true'
        data-kt-search-min-length='2'
        data-kt-search-enter='enter'
        data-kt-search-layout='menu'
        data-kt-search-responsive='false'
        data-kt-menu-trigger='auto'
        data-kt-menu-permanent='true'
        data-kt-menu-placement='bottom-start'
        data-kt-search='true'
        ref={element}
      >
        <form data-kt-search-element='form' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className='w-100 position-relative' autoComplete='off'>
          <KTSVG
            path='/img/gen021.svg'
            className='svg-icon svg-icon-2 search-icon position-absolute top-50 end-0 pe-1 translate-middle ms-8'
          />
          <input
            type='text'
            className='search-input form-control fs-4 py-3 pe-14 rounded-pill border border-1 border-gray-900 h-40px text-gray-700 placeholder-gray-400 mw-500px '
            name='search'
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder='Quick Search'
            data-kt-search-element='input'
          />
        </form>
      </div>
    </>
  )
}

export {Search}
