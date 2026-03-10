import React, { useEffect, useState } from "react";
import { getEvents, createEvent, deleteEvent } from "../services/eventService";
import { getBookings, deleteBooking } from "../services/bookingService";

function AdminPage({ onBack }) {

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      await createEvent({ title, description, date, location, totalSeats: Number(totalSeats) });
      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setTotalSeats("");
      fetchEvents();

    } catch (error) {

      alert("Failed to create event: " + error.message);

    }

    setLoading(false);
  };

  const handleDeleteEvent = async (id) => {

    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      fetchEvents();
    }

  };

  const handleCancelBooking = async (id) => {

    if (window.confirm("Are you sure you want to cancel this booking?")) {
      await deleteBooking(id);
      fetchBookings();
    }

  };

  return (
    <div className="app">

      <nav className="navbar">
        <h1 className="nav-title">Admin Panel</h1>
        <button className="back-btn" onClick={onBack}>← Back to Home</button>
      </nav>

      <main className="main-content">

        <div className="admin-grid">

          <div className="admin-form-section">

            <h2>Add New Event</h2>

            <form className="admin-form" onSubmit={handleSubmit}>

              <label>Event Title</label>
              <input
                type="text"
                placeholder="e.g. Tech Conference 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Describe the event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />

              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <label>Location</label>
              <input
                type="text"
                placeholder="e.g. Colombo, Sri Lanka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <label>Total Seats</label>
              <input
                type="number"
                placeholder="e.g. 100"
                min="1"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                required
              />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </button>

            </form>

          </div>

          <div className="admin-events-section">

            <h2>All Events ({events.length})</h2>

            {events.length === 0 ? (
              <p className="empty-msg">No events yet. Add one using the form.</p>
            ) : (
              <ul className="admin-event-list">
                {events.map((event) => (
                  <li key={event._id} className="admin-event-item">
                    <div>
                      <strong>{event.title}</strong>
                      <p>{event.location} — {new Date(event.date).toLocaleDateString()}</p>
                      <p>{event.availableSeats} / {event.totalSeats} seats available</p>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

          </div>

        </div>

        <h2 className="section-title">All Bookings ({bookings.length})</h2>

        {bookings.length === 0 ? (
          <p className="empty-msg">No bookings yet.</p>
        ) : (
          <div className="bookings-section">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Event ID</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Booked At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.userId}</td>
                    <td>{booking.eventId}</td>
                    <td>{booking.seats}</td>
                    <td>{booking.status}</td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

    </div>
  );
}

export default AdminPage;
