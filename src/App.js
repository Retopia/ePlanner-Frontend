import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ViewEvents from './ViewEvents';
import UserPage from './UserPage';
import EditEvent from './EditEvent';
import NotFound from './NotFound';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/view-events" element={<ViewEvents />} />
          {/* <Route path="/user-page" element={<UserPage />} />
          <Route path="/edit-event" element={<EditEvent />} /> */}
          <Route path="/user-page" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
          <Route path="/edit-event" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
          {/* Handles all redirects accordingly for non-existent pages */}
          <Route path="*" element={<NotFound />} />
          <Route path="/events/create" element={<ProtectedRoute><EditEvent editMode={false} /></ProtectedRoute>} />
          <Route path="/events/:eventId" element={<ProtectedRoute><EditEvent editMode={true} /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
