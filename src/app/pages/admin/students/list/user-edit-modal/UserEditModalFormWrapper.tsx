/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query"
import { QUERIES, isNotEmpty } from "../../../../../../_metronic/helpers"
import { useListView } from "../core/ListViewProvider"
import { UserEditModalForm } from "./UserEditModalForm"
import { getAllUsersStudentIntructor } from "../../../request/_requests"
import { useEffect, useState } from "react"

const UserEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate, itemIdForChange, setItemIdForChange, setIsUpdated} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const data = localStorage.getItem('instructor')
  const instructorDropDownData = JSON.parse(data!)
  const recipientsDataValue: any = []
  const [finalData, setFinalData] = useState<any>()

  // useEffect(() => {
  //   const hostdata: any = itemIdForChange?.toString().split(',');
    
  //   for(var i = 0; i < instructorDropDownData.length; i++) {
  //     for(var j = 0; j < hostdata.length; j++) {
  //       if(hostdata[j] === instructorDropDownData[i].value){
  //         const recipients = { label: instructorDropDownData[i].label, value: instructorDropDownData[i].value }
  //         recipientsDataValue.push(recipients)
  //       }
  //     }
  //   }
  //   setFinalData({
  //     instrctor: instructorDropDownData,
  //     selected: recipientsDataValue
  //   })
    
  // }, [instructorDropDownData, instructorDropDownData.length])

  // const {
  //   isLoading,
  //   data,
  //   error,
  // } = useQuery(
  //   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
  //   () => {
  //     return getAllUsersStudentIntructor('role=instructor&limit=all')
  //   },
  //   {
  //     cacheTime: 0,
  //     enabled: enabledQuery,
  //     onError: (err) => {
  //       setItemIdForUpdate(undefined)
  //       console.error(err)
  //     },
  //   }
  // )

  // if (!itemIdForUpdate) {
  //   return <UserEditModalForm isUserLoading={isLoading} user={{id: undefined}} />
  // }

  // if (!isLoading && !error && data) {
    return <UserEditModalForm isUserLoading={false} user={instructorDropDownData} />
  // }

  // return null
}

export {UserEditModalFormWrapper}
