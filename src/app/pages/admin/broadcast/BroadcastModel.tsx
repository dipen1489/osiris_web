export interface IBroadcast {
    usertype: {
        instructor: boolean
        student: boolean
    }
    recipients: [] | any
    subject: string
    description: string
}

export const initialValues = {
    usertype: {
        instructor: true,
        student: false
    },
    recipients: [],
    subject: '',
    description: '',
}
