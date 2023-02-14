import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'

import {ScheduleWrapper} from "../pages/instructor/schedule/ScheduleWrapper";
import {ChatWrapper} from "../pages/instructor/chat/ChatWrapper";
import {SettingsWrapper} from "../pages/instructor/settings/SettingsWrapper";
import { SessionWrapper } from '../pages/instructor/meeting/SessionWrapper';
import { InstructorDashboardWrapper } from '../pages/instructor/dashboard/DashboardList';
import { MeetingDetailsWrapper } from '../pages/instructor/details/MeetingDetails';
import { BroadcastWrapper } from '../pages/instructor/broadcast/BroadcastWrapper';

const PrivateRoutes = () => {

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />

        <Route path='dashboard' element={<InstructorDashboardWrapper />} />
        <Route path='dashboard/enrolled/:id' element={<MeetingDetailsWrapper />} />
        <Route path='dashboard/createmeeting' element={<SessionWrapper />} />
        <Route path='dashboard/createmeeting/:id' element={<SessionWrapper />} />
        <Route path='broadcastmessage' element={<BroadcastWrapper />} />
        <Route path='schedule' element={<ScheduleWrapper />} />
        <Route path='chat' element={<ChatWrapper />} />
        <Route path='settings' element={<SettingsWrapper />} />        
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export {PrivateRoutes}
