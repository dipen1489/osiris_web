/* eslint-disable jsx-a11y/anchor-is-valid */
import { EventInput } from '@fullcalendar/react'
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
    {
        id: createEventId(),
        title: 'Timed event',
        start: todayStr + 'T00:00:00',
        end:  todayStr + 'T01:00:00',
    },
    {
        id: createEventId(),
        title: 'Timed event',
        start: todayStr + 'T02:00:00',
        end:  todayStr + 'T03:00:00',
    },
    {
        id: createEventId(),
        title: 'Timed event',
        start: todayStr + 'T04:00:00',
        end:  todayStr + 'T05:00:00',
    }
]

export function createEventId() {
    return String(eventGuid++)
}