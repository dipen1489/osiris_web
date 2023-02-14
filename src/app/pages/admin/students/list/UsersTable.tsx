/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
// @ts-nocheck
import {useEffect, useMemo, useState} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {useQueryResponse, useQueryResponseData, useQueryResponseLoading} from './core/QueryResponseProvider'
import {usersColumns} from './columns/_columns'
import {KTCardBody} from '../../../../../_metronic/helpers'
import { CustomHeaderColumn } from './columns/CustomHeaderColumn'
import { UserData } from '../../request/_models'
import { CustomRow } from './columns/CustomRow'
import { useQueryRequest } from './core/QueryRequestProvider'
import { PageTitle } from '../../../../../_metronic/layout/core'
import { useIntl } from 'react-intl'
import clsx from 'clsx'
import { getAllUsersStudentIntructor } from '../../request/_requests'
import { pagesize } from '../../../../modules/helper'
import { useListView } from './core/ListViewProvider'
import { Loader } from '../../../component/Loader'

const mappedLabel = (label: string): string => {
  if (label === '&laquo; Previous') {
    return 'Previous'
  }

  if (label === 'Next &raquo;') {
    return 'Next'
  }

  return label
}


const UsersTable = () => {
  const intl = useIntl()
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const {state, updateState} = useQueryRequest()
  const data = useMemo(() => users, [users])
  const [instructorData, setInstructorData] = useState(data)
  const [instructorTempData, setInstructorTempData] = useState([])
  const [instructorDropDownData, setInstructorDropDownData] = useState([])
  const [instructorDropDown, setInstructorDropDown] = useState([])
  const {refetch} = useQueryResponse()
  const columns = useMemo(() => usersColumns, [])
  const [tableRange, setTableRange] = useState([]);
  const [page, setPage] = useState(1);
  const [slice, setSlice] = useState([]);
  
  const {isUpdated, setIsUpdated} = useListView()

  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data: instructorData,
  })

  useEffect(() => {
    const fetchInstructors = async () => {
      await getAllUsersStudentIntructor('role=instructor&limit=all').then((result) => {
        setInstructorDropDownData(result.data);
      }).catch((err) => {
        
      });
    }
    fetchInstructors()
  }, [])

  useEffect(() => {
    for(var i = 0; i < instructorDropDownData.length; i++) {
      const recipients = { label: instructorDropDownData[i].firstName + " " + instructorDropDownData[i].lastName, value: instructorDropDownData[i].id }
      instructorDropDown.push(recipients);
    }
  }, [instructorDropDownData, instructorDropDownData.length])

  useEffect(() => {
    if(users.length > 0 && !isLoading) {
      if(instructorTempData.length === 0){
        setInstructorTempData(data)  
      }
      else if(isUpdated === false){
        setInstructorTempData(instructorTempData.concat(data))  
      }
      else if(isUpdated === true){
        setInstructorTempData(data) 
        setIsUpdated(false)
      }
    }
  }, [users])


  useEffect(() => {
    if(state.search !== undefined && state.search !== null && state.search !== "" && data.length > 0) {
        let filteredData = instructorTempData.filter(value => {
          return (
            value.firstName!.toLowerCase().includes(state.search!.toLowerCase()) ||
            value.lastName!.toLowerCase().includes(state.search!.toLowerCase()) ||
            value.email!.toLowerCase().includes(state.search!.toLowerCase())
          );
        });
        calculatepagination(filteredData)
        // setInstructorData(filteredData)
    }
    else if(state.search?.length === 0){
      // setInstructorData(instructorTempData)
      calculatepagination()
    }
  }, [instructorTempData, state.search])

  // useEffect(() => {
  //   if(state.sort !== undefined && state.order !== undefined && data.length > 0) {
  //     let sortableItems = [...instructorTempData];
  //     let sortKey: any = state.sort

  //     const sortedCurrentUsers = sortableItems.sort((a, b) => {
  //       return a[sortKey].localeCompare(b[sortKey]);
  //     });

  //     setInstructorData(state.order === 'asc' ? sortedCurrentUsers : sortedCurrentUsers.reverse())
  //   }
  //   else if(state.sort === undefined && state.order === undefined){

  //     setInstructorData(instructorTempData)
      
  //   }
  // }, [instructorTempData, state.sort, state.order])

  useEffect(() => {
    if(state.sort !== undefined && state.order !== undefined && data.length > 0) {
      let sortableItems = [...instructorTempData];
      let sortKey: any = state.sort

      const sortedCurrentUsers = sortableItems.sort((a, b) => {
        return a[sortKey].localeCompare(b[sortKey]);
      });
      calculatepagination(state.order === 'asc' ? sortedCurrentUsers : sortedCurrentUsers.reverse())
      // setInstructorData(state.order === 'asc' ? sortedCurrentUsers : sortedCurrentUsers.reverse())
    }
    else if(state.sort === undefined && state.order === undefined){
      // setInstructorData(instructorTempData)
      calculatepagination()
    }
  }, [instructorTempData, state.sort, state.order])
  
  const calculateRange = (data, rowsPerPage) => {
    const range = [];
    const num = Math.ceil(data.length / rowsPerPage);
    for (let i = 1; i <= num; i++) {
      range.push(i);
    } 
    return range;
  };

  const sliceData = (data, page, rowsPerPage) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  };

  useEffect(() => {
    const tbllength = tableRange.length - 2
    
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
    const nextdis = document.getElementsByClassName('next');
    for(var i = 0; i < nextdis.length; i++)
    {
      tbllength === page ? nextdis[i].classList.add("disabled") : nextdis[i].classList.remove("disabled")
    }

    const previousdis = document.getElementsByClassName('previous');
    for(var j = 0; j < previousdis.length; j++)
    {
      page === 1 ? previousdis[j].classList.add("disabled") : previousdis[j].classList.remove("disabled")
    }
    
    if((tableRange.length-3 === page || tableRange.length-2 === page) && instructorTempData.length >= state.page * pagesize){
      updateState({ page: state.page + 1})
      setTimeout(() => {
        refetch()
      }, 100);
    }
  }, [slice, page, setPage, tableRange.length]);

  useEffect(() => {
    calculatepagination()
    // if(instructorTempData.length > 0){
    //   const range = calculateRange(instructorTempData, 10);
    //   setTableRange(['Previous', ...range, 'Next'],);

    //   const slice = sliceData(instructorTempData, page, 10);
    //   setSlice([...slice]);
    //   setInstructorData([...slice])
    // }
  }, [instructorTempData, setTableRange, setSlice, page]);

  const calculatepagination = (dataTS: any = null) => {
    if(instructorTempData.length > 0 && dataTS === null){
      const range = calculateRange(instructorTempData, 10);
      setTableRange(['Previous', ...range, 'Next'],);

      const slice = sliceData(instructorTempData, page, 10);
      setSlice([...slice]);
      setInstructorData([...slice])
    }

    if(dataTS !== null){
      const range = calculateRange(dataTS, 10);
      setTableRange(['Previous', ...range, 'Next'],);

      const slice = sliceData(dataTS, page, 10);
      setSlice([...slice]);
      setInstructorData([...slice])
    }
  }

  return (
    <>
    <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.STUDENTS'})}</PageTitle>
    {isLoading ? <Loader classes='image-input-wrapper d-grid align-content-center w-100 h-150px start-0 left-0 top-0' position='inherit' message='Please wait...' addCustomStyles={false} iconWidth={50} /> :
      <KTCardBody className='py-4'>
        <div className='table-responsive'>
          <table
            id='kt_table_users'
            className='table align-middle border tbl-border table-row-bordered fs-6 gy-5 dataTable no-footer'
            {...getTableProps()}
          >
            <thead>
              <tr className='text-start text-muted fw-semibold fs-7 text-uppercase gs-0 tbl'>
                {headers.map((column: ColumnInstance<UserData>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            </thead>
            <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row: Row<UserData>, i) => {
                  prepareRow(row)
                  return <CustomRow row={row} instructor={instructorDropDown} key={`row-${i}-${row.id}`} />
                })
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                      No matching records found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {tableRange.length > 3 && <div className='row mt-10'>
          <div className='col-sm-12 col-md-12 d-flex align-items-center justify-content-center'>
            <div id='kt_table_users_paginate'>
              <ul className='pagination'>
                {tableRange
                  ?.map((link, index) => {
                    return {...link, label: mappedLabel(link)}
                  })
                  .map((link, index) => (
                    <li
                      key={index}
                      className={clsx('page-item', {
                        active: page === link.label,
                        disabled: page === link.label ? true : false,
                        previous: link.label === 'Previous',
                        next: link.label === 'Next',
                      })}
                    >
                      <a
                        className={clsx('page-link', {
                          'page-text': link.label === 'Previous' || link.label === 'Next',
                          'me-5': link.label === 'Previous',
                        })}
                        onClick={() => {
                        link.label === "Next" ? setPage(page + 1) : link.label === "Previous" ? setPage(page - 1) : setPage(link.label)}}
                        style={{cursor: 'pointer'}}
                      >
                        {mappedLabel(link.label)}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>}
      </KTCardBody>
    }
    </>
  )
}

export {UsersTable}
