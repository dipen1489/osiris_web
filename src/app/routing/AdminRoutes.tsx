import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'

import { BroadcastWrapper } from '../pages/admin/broadcast/BroadcastWrapper';
import { InstructorListWrapper } from '../pages/admin/instructors/list/InstructorListWrapper';
import { InstructorFormWrapper } from '../pages/admin/instructors/form/InstructorFormWrapper';
import { StudentListWrapper } from '../pages/admin/students/list/StudentListWrapper';
import { SessionListWrapper } from '../pages/admin/sessions/SessionListWrapper';
import { CategoryListWrapper } from '../pages/admin/categories/list/CategoryListWrapper';
import { CategoryFormWrapper } from '../pages/admin/categories/form/CategoryFormWrapper';

const AdminRoutes = () => {

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path='auth/*' element={<Navigate to='/sessions' />} />

        <Route path='instructors' element={<InstructorListWrapper />} />
        <Route path='create_instructor' element={<InstructorFormWrapper />} />
        <Route path='edit_instructor/:id' element={<InstructorFormWrapper />} />
        <Route path='sessions' element={<SessionListWrapper />} />
        <Route path='students' element={<StudentListWrapper />} />

        <Route path='categories' element={<CategoryListWrapper />} />
        <Route path='create_category' element={<CategoryFormWrapper />} />
        <Route path='categories/edit_category/:id' element={<CategoryFormWrapper />} />
        
        <Route path='broadcastemail' element={<BroadcastWrapper />} />

        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export {AdminRoutes}
