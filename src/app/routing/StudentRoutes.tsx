import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {ScheduleWrapper} from "../pages/student/schedule/ScheduleWrapper";
import {ChatWrapper} from "../pages/student/chat/ChatWrapper";
import {SettingsWrapper} from "../pages/student/settings/SettingsWrapper";
import { DashboardListWrapper } from '../pages/student/dashboard/DashboardList';
import { MeetingDetailsWrapper } from '../pages/student/details/MeetingDetails';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        <Route path='dashboard' element={<DashboardListWrapper />} />
        <Route
            path='dashboard/enrolled/:id'
            element={<MeetingDetailsWrapper />}
        />
        <Route path='schedule' element={<ScheduleWrapper />} />
        <Route path='chat' element={<ChatWrapper />} />
        <Route path='settings' element={<SettingsWrapper />} />
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export {StudentRoutes}
