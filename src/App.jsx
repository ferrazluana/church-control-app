import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import UserManagement from './components/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import MemberList from './components/members/MemberList';
import AddMember from './components/members/AddMember';
import EditMember from './components/members/EditMember';
import ViewMember from './components/members/ViewMember';
import MinistryList from './components/ministries/MinistryList';
import AddMinistry from './components/ministries/AddMinistry';
import EditMinistry from './components/ministries/EditMinistry';
import CourseList from './components/courses/CourseList';
import AddCourse from './components/courses/AddCourse';
import EditCourse from './components/courses/EditCourse';
import UnderConstruction from './components/UnderConstruction';

function App() {
  const { isAuthenticated, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />

            {/* Member Routes */}
            <Route path="/members" element={<PrivateRoute><MemberList /></PrivateRoute>} />
            <Route path="/members/add" element={<PrivateRoute><AddMember /></PrivateRoute>} />
            <Route path="/members/:id/edit" element={<PrivateRoute><EditMember /></PrivateRoute>} />
            <Route path="/members/:id" element={<PrivateRoute><ViewMember /></PrivateRoute>} />

            {/* Ministry Routes */}
            <Route path="/ministries" element={<PrivateRoute><MinistryList /></PrivateRoute>} />
            <Route path="/ministries/add" element={<PrivateRoute><AddMinistry /></PrivateRoute>} />
            <Route path="/ministries/:id/edit" element={<PrivateRoute><EditMinistry /></PrivateRoute>} />

            {/* Course Routes */}
            <Route path="/courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
            <Route path="/courses/add" element={<PrivateRoute><AddCourse /></PrivateRoute>} />
            <Route path="/courses/:id/edit" element={<PrivateRoute><EditCourse /></PrivateRoute>} />

            <Route path="/logout" element={<Navigate to="/login" replace />} onEnter={handleLogout} />
            <Route path="/construction" element={<UnderConstruction />} />

            <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/construction" replace />} />

          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
