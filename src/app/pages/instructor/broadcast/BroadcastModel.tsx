export interface IBroadcast {
    title: string
    start_date: string
    recipients: [] | any
    subject: string
    description: string
}

export const initialValues = {
    title: '',
    start_date: '',
    recipients: [],
    subject: '',
    description: '',
}
