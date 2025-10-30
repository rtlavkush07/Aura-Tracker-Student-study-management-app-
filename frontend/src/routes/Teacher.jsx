import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import TeacherProfile from '../pages/teacher/TeacherProfile'
import AddAssignment from '../pages/teacher/AddAssignment'
import AddSubjectData from '../pages/teacher/AddSubjectData'



const Teacher = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<TeacherDashboard />} />
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path='/addassignment' element={<AddAssignment />} />
        <Route path='/addsubjectdata' element={<AddSubjectData/>} />

      </Routes>
    </div>
  )
}

export default Teacher