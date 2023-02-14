import {format} from 'date-fns'
import CryptoJS from 'crypto-js'
import moment from 'moment'

export const userimg = ['/img/user1.png', '/img/user2.png', '/img/user3.png']
export const userImgSM = ['/img/user_sm1.png', '/img/user_sm2.png', '/img/user_sm3.png']
export const getRandomElement = (arr: any[]) =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined
export const randomImg = getRandomElement(userimg)

export const uint8array = (arrayBuffer: any[] | ArrayBuffer | ArrayLike<number>) =>
  new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
export const imgTobase64String = (uint8array: any) => btoa(uint8array)
const salt = '6d090796-ecdf-11ea-adc1-0242ac112345'

export const pagesize = 100

export const addSomeMinutesToTime = (startTime: string | Date, minutestoAdd: number) => {
  const dateObj = new Date(startTime)
  const newDateInNumber = dateObj.setMinutes(dateObj.getMinutes() + minutestoAdd)
  const processedTime = new Date(newDateInNumber).toISOString()
  return processedTime
}

export const verifyJoiningTime = (startTime: string | Date) => {
  // const currentDate = new Date()
  const currentDate = moment().toDate()

  const meetingDate = new Date(startTime)

  const newCurrentDate = currentDate.setMinutes(currentDate.getMinutes() - 5)
  const FSCurrentDate = new Date(newCurrentDate).toISOString()

  if (meetingDate.toISOString() <= FSCurrentDate) {
    return true
  }
  return false
}

export const verifyMeetingIsExpired = (startTime: string | Date) => {
  // const currentDate = new Date()
    const currentDate = moment().toDate()

  const meetingDate = new Date(startTime)

  const newCurrentDate = currentDate.setMinutes(currentDate.getMinutes() - 5)
  const FSCurrentDate = new Date(newCurrentDate).toISOString()

  if (meetingDate.toISOString() < FSCurrentDate) {
    return true
  }
  return false
}

export const checkExpired = (startTime: string | Date) => {
    // const currentDate = new Date()
    const currentDate = moment().toDate()
    
    const meetingDate = new Date(startTime)
    if (format(meetingDate, 'y-MM-dd HH:mm') >= format(currentDate, 'y-MM-dd HH:mm')) {
      return true
    }
    return false
}

export const verifyDateIsToday = (startTime: string | Date) => {
  const currentDate = format(moment().toDate(), 'y-MM-dd')
  const meetingDate = format(new Date(startTime), 'y-MM-dd')

  if (meetingDate === currentDate) {
    return true
  }
  return false
}

export const verifyJoiningTimeInstructor = (startTime: string | Date) => {
  // const currentDate = new Date()
  const currentDate = moment().toDate()

  const meetingDate = new Date(startTime)

  const newCurrentDate = currentDate.setMinutes(currentDate.getMinutes() - 15)
  const FSCurrentDate = new Date(newCurrentDate).toISOString()
  const newTCurrentDate = moment().toDate().setMinutes(moment().toDate().getMinutes() + 15)

  if (format(meetingDate, 'y-MM-dd') <= format(new Date(newCurrentDate), 'y-MM-dd')) {
    if (
      format(meetingDate, 'HH:mm') >= format(new Date(newCurrentDate), 'HH:mm') &&
      format(meetingDate, 'HH:mm') <= format(new Date(newTCurrentDate), 'HH:mm')
    ) {
      // console.log("FSCurrentDate :: ", format(meetingDate, 'y-MM-dd HH:mm'));
      // console.log("newCurrentDate :: ", format(new Date(newCurrentDate), 'y-MM-dd HH:mm'));
      return false
    }
    return true
  }
  // if(meetingDate.toISOString() <= FSCurrentDate){
  //     return true
  // }
  return true
}

export const getYearEndDate = () => {
  // const FSCurrentDate = new Date(new Date().getFullYear(), 11, 31)
  const FSCurrentDate = new Date(moment().toDate().getFullYear(), 11, 31)
  return format(FSCurrentDate, 'y-MM-dd')
}

export const getMonthEndDate = () => {
  // const gtYear = new Date().getFullYear()
  // const gtMonth = new Date().getMonth()
  const gtYear = moment().toDate().getFullYear()
  const gtMonth = moment().toDate().getMonth()

  const FSCurrentMonthDate = new Date(gtYear, gtMonth + 1, 0)
  return format(FSCurrentMonthDate, 'y-MM-dd')
}

export const getWeekEndDate = () => {
  const startDay = 0
  // const weekend = new Date(
  //   new Date().getFullYear(),
  //   new Date().getMonth(),
  //   new Date().getDate() + ((7 - new Date().getDay() - startDay) % 7)
  // )
  const weekend = new Date(
    moment().toDate().getFullYear(),
    moment().toDate().getMonth(),
    moment().toDate().getDate() + ((7 - moment().toDate().getDay() - startDay) % 7)
  )
  return format(weekend, 'y-MM-dd')
}

export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString()
}

export const decryptData = (ciphertext: any) => {
  const getLocalStorageData = localStorage.getItem(ciphertext)
  const bytes = getLocalStorageData ? CryptoJS.AES.decrypt(getLocalStorageData, salt) : null
  try {
    return bytes !== null ? JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) : null
  } catch (err) {
    return null
  }
}
