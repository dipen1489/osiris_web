export const HOUR_MINUTE_SECONDS_MASK = "HH:mm:ss";

export interface IMeeting {
    title: string
    start_date: string | null
    start_time: string
    duration: string
    max_student: number
    equipments_required: string | []
    timezone: string
    price: string
    category_id: string
    visibility: string
    image: any
    description: string
    repeat: {
        recurrence: boolean
        rtype: number
        end_date_time: string
        weekly_days: {
            sun: boolean
            mon: boolean
            tue: boolean
            wed: boolean
            thu: boolean
            fri: boolean
            sat: boolean
        }
        monthly:{
            monthly_day: boolean
            monthly_week: boolean
        }
        monthlydays:{
            day: number
        }
        weekly:{
            monthly_weekday: number
            monthly_week_day: number
        }
    }
}

export const initialValues = {
    title: '',
    start_date: '',
    start_time: '',
    duration: '60',
    max_student: 1,
    equipments_required: '',
    timezone: 'America/Los_Angeles',
    price: '',
    category_id: '',
    visibility: 'public',
    image: null,
    description: '',
    repeat: {
        recurrence: false,
        rtype: 1,
        end_date_time: '',
        repeat_interval: 0,
        weekly_days: {
            sun: false,
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: false,
        },
        monthly:{
            monthly_day: true,
            monthly_week: false,
        },
        monthlydays:{
            day: 1
        },
        weekly:{
            monthly_weekday: 1,
            monthly_week_day: 1,
        }
    },
}
