import React, { useState } from "react";
import {
  IconAlert,
  IconBolt,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconSeat,
  IconStatus,
  IconTicket,
  IconX,
} from "./EventCardIcons";
import "./EventCard.css";

function EventCard({ event, onBook, fallbackImage }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const eventDate = new Date(event.date);
  const now = new Date();
  const isPastEvent = eventDate < now;
  const isSoldOut = event.availableSeats === 0;
  const isAlmostFull = !isSoldOut && event.availableSeats <= event.totalSeats * 0.2;
  const canBook = !isSoldOut && !isPastEvent;

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getTimeRemaining = () => {
    const diffTime = eventDate - now;

    if (diffTime < 0) return "Event ended";

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) return `${Math.ceil(diffDays / 30)} months left`;
    if (diffDays > 7) return `${Math.ceil(diffDays / 7)} weeks left`;
    if (diffDays > 1) return `${diffDays} days left`;
    if (diffDays === 1) return "Tomorrow";

    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} hours left`;

    return "Today";
  };

  const getSeatPercentage = () => {
    if (!event.totalSeats) return 0;
    return ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div
      className={`event-card ${isSoldOut ? "sold-out" : ""} ${isAlmostFull ? "almost-full" : ""} ${
        isPastEvent ? "past-event" : ""
      }`}
    >
      <div className="event-card-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton">
            <div className="skeleton-loader" />
          </div>
        )}

        <img
          className={`event-card-image ${imageLoaded ? "loaded" : ""}`}
          src={imageError ? fallbackImage : event.imageUrl || fallbackImage}
          alt={event.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        <div className="image-overlay">
          {isSoldOut && (
            <div className="overlay-badge sold-out">
              <IconX className="event-card-icon event-card-icon--on-dark" />
              Sold out
            </div>
          )}
          {isAlmostFull && !isSoldOut && (
            <div className="overlay-badge almost-full">
              <IconBolt className="event-card-icon event-card-icon--on-dark" />
              Almost full
            </div>
          )}
        </div>
      </div>

      <div className="event-meta-row">
        <div className="event-date-pill">
          <IconCalendar className="event-card-icon event-card-icon--muted" />
          <span>{formattedDate}</span>
        </div>

        <div className={`event-seat-pill ${isSoldOut ? "sold" : isAlmostFull ? "limited" : "open"}`}>
          {isSoldOut ? (
            <IconX className="event-card-icon" />
          ) : isAlmostFull ? (
            <IconAlert className="event-card-icon" />
          ) : (
            <IconTicket className="event-card-icon" />
          )}
          <span>
            {isSoldOut
              ? "Sold out"
              : isAlmostFull
                ? `${event.availableSeats} left`
                : `${event.availableSeats} seats`}
          </span>
        </div>
      </div>

      {!isSoldOut && (
        <div className={`time-remaining ${isPastEvent ? "time-remaining--ended" : ""}`}>
          <IconClock className="event-card-icon event-card-icon--muted" />
          <span className="time-text">{timeRemaining}</span>
        </div>
      )}

      <h3 className="event-title">{event.title}</h3>

      <p className="event-description">{event.description}</p>

      {!isSoldOut && !isPastEvent && (
        <div className="seat-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getSeatPercentage()}%` }} />
          </div>
          <span className="progress-text">{Math.round(getSeatPercentage())}% booked</span>
        </div>
      )}

      <div className="event-details-grid">
        <div className="detail-item">
          <span className="detail-icon-wrap" aria-hidden>
            <IconMapPin className="event-card-icon event-card-icon--muted" />
          </span>
          <div className="detail-content">
            <span className="detail-label">Location</span>
            <span className="detail-value">{event.location}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon-wrap" aria-hidden>
            <IconTicket className="event-card-icon event-card-icon--muted" />
          </span>
          <div className="detail-content">
            <span className="detail-label">Total seats</span>
            <span className="detail-value">{event.totalSeats}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon-wrap" aria-hidden>
            <IconSeat className="event-card-icon event-card-icon--muted" />
          </span>
          <div className="detail-content">
            <span className="detail-label">Available</span>
            <span className="detail-value">{event.availableSeats}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon-wrap" aria-hidden>
            <IconStatus className="event-card-icon event-card-icon--muted" />
          </span>
          <div className="detail-content">
            <span className="detail-label">Status</span>
            <span className={`status-value ${isSoldOut ? "sold" : isAlmostFull ? "limited" : "available"}`}>
              {isSoldOut ? "Sold out" : isAlmostFull ? "Limited" : "Available"}
            </span>
          </div>
        </div>
      </div>

      {event.price ? (
        <div className="price-section">
          <span className="price-label">Starting from</span>
          <span className="price-value">${event.price}</span>
        </div>
      ) : null}

      <button
        type="button"
        className={`book-btn ${!canBook ? "disabled" : ""}`}
        onClick={onBook}
        disabled={!canBook}
      >
        {isSoldOut ? (
          <>
            <IconX className="event-card-icon event-card-icon--btn" />
            Sold out
          </>
        ) : isPastEvent ? (
          <>
            <IconClock className="event-card-icon event-card-icon--btn" />
            Event ended
          </>
        ) : (
          <>
            <IconTicket className="event-card-icon event-card-icon--btn" />
            {isAlmostFull ? "Book now" : "Book ticket"}
          </>
        )}
      </button>
    </div>
  );
}

export default EventCard;
