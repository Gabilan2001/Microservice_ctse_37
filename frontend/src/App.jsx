import React, { useEffect, useState } from "react";
import EventCard from "./components/EventCard";
import BookingModal from "./components/BookingModal";
import BookingList from "./components/BookingList";
import AdminPage from "./components/AdminPage";
import { getBookings } from "./services/bookingService";
import { getEvents } from "./services/eventService";
import "./App.css";

function App() {

  const [page, setPage] = useState("home");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  if (page === "admin") {
    return (
      <AdminPage
        onBack={() => {
          setPage("home");
          fetchEvents();
        }}
      />
    );
  }

  return (
    <div className="app">

      <nav className="navbar">
        <h1 className="nav-title">Event Booking System</h1>
        <button className="admin-btn" onClick={() => setPage("admin")}>
          Admin
        </button>
      </nav>

      <main className="main-content">

        <h2 className="section-title">Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="empty-msg">No events available. Check back later!</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onBook={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}

        {selectedEvent && (
          <BookingModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onBooked={() => {
              setSelectedEvent(null);
              fetchBookings();
            }}
          />
        )}

        <h2 className="section-title">My Bookings</h2>
        <BookingList bookings={bookings} refreshBookings={fetchBookings} />

      </main>

    </div>
  );
}

export default App;