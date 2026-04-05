import React, { useEffect, useState } from "react";
import AppNavbar from "./AppNavbar";
import {
  createEvent,
  deleteEvent,
  getEvents,
  uploadEventImage,
} from "../services/eventService";
import {
  confirmBooking,
  deleteBooking,
  getBannerImage,
  getBookings,
  updateBannerImage,
  uploadBannerImage,
} from "../services/bookingService";
import { deleteReview, getReviews } from "../services/reviewService";
import { getUsers, updateUser } from "../services/userService";
import {
  IconCalendar,
  IconMapPin,
  IconStar,
  IconTicket,
  IconUsers,
} from "./EventCardIcons";

function AdminPage({
  currentUser,
  userMenuRef,
  isUserMenuOpen,
  setIsUserMenuOpen,
  onLogout,
  canAccessAdminPanel,
  onNavigate,
}) {
  const isAdmin = currentUser?.role === "admin";
  const [activeService, setActiveService] = useState("events");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [eventFile, setEventFile] = useState(null);
  const [eventPreview, setEventPreview] = useState("");
  const [editingUserId, setEditingUserId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingRole, setEditingRole] = useState("attendee");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEvents = async () => {
    const response = await getEvents();
    setEvents(response.data);
  };

  const fetchBookings = async () => {
    const response = await getBookings();
    setBookings(response.data);
  };

  const fetchUsers = async () => {
    const response = await getUsers();
    setUsers(response.data);
  };

  const fetchReviews = async () => {
    const response = await getReviews();
    setReviews(response.data);
  };

  const fetchBanner = async () => {
    const response = await getBannerImage();
    setBannerImageUrl(response.data.imageUrl || "");
  };

  useEffect(() => {
    fetchEvents();
    fetchBookings();
    if (isAdmin) {
      fetchUsers();
    }
    fetchReviews();
    fetchBanner();
  }, [isAdmin]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (eventFile) {
        const uploadResponse = await uploadEventImage(eventFile, "ctse-events/events");
        imageUrl = uploadResponse.data.imageUrl;
      }

      await createEvent({
        title,
        description,
        date,
        location,
        totalSeats: Number(totalSeats),
        imageUrl,
      });

      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setTotalSeats("");
      setEventFile(null);
      setEventPreview("");
      await fetchEvents();
      alert("Event created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create event");
    }

    setLoading(false);
  };

  const handleBannerUpload = async () => {
    if (!bannerFile) {
      alert("Select a banner image first");
      return;
    }

    try {
      const uploadResponse = await uploadBannerImage(bannerFile);
      await updateBannerImage(uploadResponse.data.imageUrl);
      await fetchBanner();
      setBannerFile(null);
      alert("Banner updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload banner");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    await deleteEvent(id);
    fetchEvents();
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) {
      return;
    }

    try {
      await deleteBooking(id);
      fetchBookings();
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      await confirmBooking(id);
      await fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to confirm booking");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    await deleteReview(id);
    fetchReviews();
  };

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setEditingName(user.name);
    setEditingEmail(user.email);
    setEditingRole(user.role || "attendee");
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    await updateUser(editingUserId, {
      role: editingRole,
    });

    setEditingUserId("");
    setEditingName("");
    setEditingEmail("");
    setEditingRole("attendee");
    fetchUsers();
    alert("User role updated successfully");
  };

  const findUser = (userId) => (Array.isArray(users) ? users.find((user) => user._id === userId) : null);
  const findEvent = (eventId) => (Array.isArray(events) ? events.find((event) => event._id === eventId) : null);
  const normalizeBookingStatus = (status) => {
    if (status == null || status === "") return "confirmed";
    if (status === "BOOKED") return "confirmed";
    return String(status).toLowerCase();
  };

  const activeBookings = Array.isArray(bookings)
    ? bookings.filter((booking) => normalizeBookingStatus(booking.status) !== "cancelled").length
    : 0;

  const filteredEvents = Array.isArray(events) ? events.filter((event) =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredBookings = Array.isArray(bookings) ? bookings.filter((booking) => {
    const user = findUser(booking.userId);
    const event = findEvent(booking.eventId);
    return (
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  const filteredReviews = Array.isArray(reviews) ? reviews.filter((review) => {
    const event = findEvent(review.eventId);
    return (
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  const filteredUsers = Array.isArray(users) ? users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const renderEventsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>Event Management</h2>
        <span className="badge">{events.length} Total Events</span>
      </div>

      <div className="admin-grid">
        <div className="form-card">
          <h3>Create New Event</h3>
          <form className="admin-form" onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>Event Title</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                placeholder="Enter event title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                rows={4} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                placeholder="Describe the event"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  required 
                  placeholder="Event location"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Seats</label>
                <input 
                  type="number" 
                  min="1" 
                  value={totalSeats} 
                  onChange={(e) => setTotalSeats(e.target.value)} 
                  required 
                  placeholder="Number of seats"
                />
              </div>

              <div className="form-group">
                <label>Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setEventFile(file || null);
                    setEventPreview(file ? URL.createObjectURL(file) : "");
                  }}
                />
              </div>
            </div>

            {eventPreview && (
              <div className="preview-container">
                <img className="upload-preview" src={eventPreview} alt="Event preview" />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>

        <div className="list-card">
          <h3>Events List</h3>
          <ul className="admin-event-list">
            {filteredEvents.map((event) => (
              <li key={event._id} className="admin-event-item card-stack">
                {event.imageUrl && (
                  <img className="event-admin-thumb" src={event.imageUrl} alt={event.title} />
                )}
                <div className="event-info">
                  <strong>{event.title}</strong>
                  <div className="event-meta admin-event-meta">
                    <span className="admin-event-meta-item">
                      <IconMapPin className="event-card-icon" aria-hidden />
                      {event.location}
                    </span>
                    <span className="admin-event-meta-item">
                      <IconCalendar className="event-card-icon" aria-hidden />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="admin-event-meta-item">
                      <IconTicket className="event-card-icon" aria-hidden />
                      {event.availableSeats}/{event.totalSeats} seats
                    </span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteEvent(event._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderBookingsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>Booking Management</h2>
        <span className="badge">{bookings.length} Total Bookings</span>
      </div>
      
      <div className="bookings-section">
        <div className="banner-section">
          <h3>Banner Settings</h3>
          <div className="admin-form banner-panel">
            <div className="form-group">
              <label>Home Banner Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)} 
              />
            </div>
            
            {bannerImageUrl && (
              <div className="preview-container">
                <img className="upload-preview banner-preview" src={bannerImageUrl} alt="Banner preview" />
              </div>
            )}
            
            <button type="button" className="submit-btn" onClick={handleBannerUpload}>
              Update Banner
            </button>
          </div>
        </div>

        <div className="table-section">
          <h3>Recent Bookings</h3>
          <table className="booking-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Event</th>
                <th>Seats</th>
                <th>Seat Numbers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const user = findUser(booking.userId);
                const event = findEvent(booking.eventId);
                const bookingStatus = normalizeBookingStatus(booking.status);

                return (
                  <tr key={booking._id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{user?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td>{user?.email || "-"}</td>
                    <td>
                      <span className={`role-badge ${user?.role}`}>
                        {user?.role || "-"}
                      </span>
                    </td>
                    <td>{event?.title || "Unknown Event"}</td>
                    <td>
                      <span className="seat-count">{booking.seats}</span>
                    </td>
                    <td>
                      <small>{booking.seatNumbers?.join(", ") || "-"}</small>
                    </td>
                    <td>
                      <span className={`status-badge ${bookingStatus}`}>
                        {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-booking-actions">
                        {bookingStatus === "pending" ? (
                          <button
                            type="button"
                            className="submit-btn small"
                            onClick={() => handleConfirmBooking(booking._id)}
                          >
                            Confirm
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="delete-btn small"
                          disabled={bookingStatus === "cancelled"}
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>Reviews Management</h2>
        <span className="badge">{reviews.length} Total Reviews</span>
      </div>
      
      <div className="review-list admin-review-list">
        {filteredReviews.map((review) => {
          const event = findEvent(review.eventId);

          return (
            <div className="review-card" key={review._id}>
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{review.userName}</strong>
                  <div className="rating rating--svg" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <IconStar key={n} filled={n <= review.rating} />
                    ))}
                  </div>
                </div>
                <span className="event-name">{event?.title || "Unknown Event"}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-footer">
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <button className="delete-btn small" onClick={() => handleDeleteReview(review._id)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderUsersSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>User Management</h2>
        <span className="badge">{users.length} Total Users</span>
      </div>
      
      <div className="admin-grid">
        <div className="table-section">
          <h3>Users List</h3>
          <table className="booking-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-avatar">
                      <div className="avatar-circle">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button className="admin-btn small" onClick={() => startEditUser(user)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-card">
          <h3>Edit User</h3>
          {editingUserId ? (
            <form className="admin-form" onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>User Name</label>
                <input 
                  value={editingName} 
                  disabled
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>User Email</label>
                <input 
                  type="email" 
                  value={editingEmail} 
                  disabled
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>User Role</label>
                <select
                  value={editingRole}
                  onChange={(e) => setEditingRole(e.target.value)}
                  required
                >
                  <option value="admin">admin</option>
                  <option value="organizer">organizer</option>
                  <option value="attendee">attendee</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
                <button type="button" className="cancel-btn" onClick={() => setEditingUserId("")}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="empty-state">
              <p>Select a user to edit their information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app admin-page">
      <AppNavbar
        variant="admin"
        activePage="admin"
        currentUser={currentUser}
        canAccessAdminPanel={canAccessAdminPanel}
        onNavigate={onNavigate}
        userMenuRef={userMenuRef}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        onLogout={onLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={`Search ${activeService}…`}
      />

      <main className="main-content">
        <section className="admin-top-strip">
          <article className="stat-card">
            <strong>{events.length}</strong>
            <span>Total Events</span>
          </article>
          <article className="stat-card">
            <strong>{activeBookings}</strong>
            <span>Active Bookings</span>
          </article>
          <article className="stat-card">
            <strong>{users.length}</strong>
            <span>Registered Users</span>
          </article>
          <article className="stat-card">
            <strong>{reviews.length}</strong>
            <span>User Reviews</span>
          </article>
        </section>

        <section className="admin-layout">
          <aside className="service-sidebar">
            <button
              type="button"
              className={`service-nav-btn ${activeService === "events" ? "active" : ""}`}
              onClick={() => setActiveService("events")}
            >
              <IconCalendar className="event-card-icon service-nav-icon" aria-hidden />
              Event Service
            </button>
            <button
              type="button"
              className={`service-nav-btn ${activeService === "bookings" ? "active" : ""}`}
              onClick={() => setActiveService("bookings")}
            >
              <IconTicket className="event-card-icon service-nav-icon" aria-hidden />
              Booking Service
            </button>
            <button
              type="button"
              className={`service-nav-btn ${activeService === "reviews" ? "active" : ""}`}
              onClick={() => setActiveService("reviews")}
            >
              <IconStar width={18} height={18} className="service-nav-icon" filled={false} aria-hidden />
              User Review Service
            </button>
            {isAdmin && (
              <button
                type="button"
                className={`service-nav-btn ${activeService === "users" ? "active" : ""}`}
                onClick={() => setActiveService("users")}
              >
                <IconUsers className="event-card-icon service-nav-icon" aria-hidden />
                User Management Service
              </button>
            )}
          </aside>

          <section className="admin-main-panel">
            {activeService === "events" && renderEventsSection()}
            {activeService === "bookings" && renderBookingsSection()}
            {activeService === "reviews" && renderReviewsSection()}
            {isAdmin && activeService === "users" && renderUsersSection()}
          </section>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;