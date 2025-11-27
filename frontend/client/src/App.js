import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = 'http://localhost:8080/api/guests';

function App() {
  const [guests, setGuests] = useState([]);
  
  // 1. NEW: State for the search input
  const [searchTerm, setSearchTerm] = useState(''); 

  const [formData, setFormData] = useState({
    guest_name: '',
    stay_duration: '',
    room_type: 'Standard',
    status_checkin: false
  });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get(API_URL);
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        await axios.patch(`${API_URL}/${isEditing}`, formData);
        setIsEditing(null);
      } catch (error) {
        console.error("Error updating guest:", error);
      }
    } else {
      try {
        await axios.post(API_URL, formData);
      } catch (error) {
        console.error("Error creating guest:", error);
      }
    }
    fetchGuests();
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchGuests();
      } catch (error) {
        console.error("Error deleting guest:", error);
      }
    }
  };

  const handleEdit = (guest) => {
    setIsEditing(guest._id);
    setFormData({
      guest_name: guest.guest_name,
      stay_duration: guest.stay_duration,
      room_type: guest.room_type,
      status_checkin: guest.status_checkin
    });
  };

  const resetForm = () => {
    setFormData({
      guest_name: '',
      stay_duration: '',
      room_type: 'Standard',
      status_checkin: false
    });
    setIsEditing(null);
  };

  // 2. NEW: Filter Logic
  // We create a new array 'filteredGuests' based on the search term
  const filteredGuests = guests.filter((guest) => 
    guest.guest_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Hotel Guest Management</h1>
      </header>
      
      <main className="content-wrapper">
        
        {/* LEFT COLUMN: FORM */}
        <div className="form-container card">
          <h2 className="card-title">{isEditing ? 'Edit Guest' : 'Add New Guest'}</h2>
          <form onSubmit={handleSubmit} className="guest-form">
            <div className="form-group">
              <label htmlFor="guest_name">Guest Name</label>
              <input
                id="guest_name"
                name="guest_name"
                type="text" 
                value={formData.guest_name}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="stay_duration">Stay Duration (days)</label>
              <input
                id="stay_duration"
                name="stay_duration"
                type="number"
                value={formData.stay_duration}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="room_type">Room Type</label>
              <select id="room_type" name="room_type" value={formData.room_type} onChange={handleInputChange}>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div className="form-group-checkbox">
              <input
                id="status_checkin"
                name="status_checkin"
                type="checkbox"
                checked={formData.status_checkin}
                onChange={handleInputChange}
              />
              <label htmlFor="status_checkin">Guest is Checked-In</label>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">{isEditing ? 'Update Guest' : 'Add Guest'}</button>
              {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: TABLE */}
        <div className="table-container card">
          
          {/* 3. NEW: Header with Search Input */}
          <div className="table-header">
            <h2 className="card-title">Guest List</h2>
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stay (days)</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* 4. NEW: Map over 'filteredGuests' instead of 'guests' */}
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <tr key={guest._id}> 
                    <td data-label="Name">{guest.guest_name}</td>
                    <td data-label="Stay">{guest.stay_duration}</td>
                    <td data-label="Room Type">{guest.room_type}</td>
                    <td data-label="Status">
                      <span className={guest.status_checkin ? 'status status-checkedin' : 'status status-checkedout'}>
                        {guest.status_checkin ? 'Checked-In' : 'Checked-Out'}
                      </span>
                    </td>
                    <td data-label="Actions" className="actions">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(guest)} title="Edit">✏️</button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(guest._id)} title="Delete">🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                // 5. NEW: Show this row if no guests match the search
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    No guests found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default App;