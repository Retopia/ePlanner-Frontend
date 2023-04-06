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
import EventPage from './EventPage';
import './stylesheets/App.css';

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
          <Route path="/events/view/:eventId" element={<EventPage />} />
          <Route path="/user-page" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
          {/* Handles all redirects accordingly for non-existent pages */}
          <Route path="*" element={<NotFound />} />
          <Route path="/events/create" element={<ProtectedRoute><EditEvent editMode={false} /></ProtectedRoute>} />
          <Route path="/events/edit/:eventId" element={<ProtectedRoute><EditEvent editMode={true} /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
