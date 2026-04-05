import React from "react";

const svgProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
};

export function IconCalendar(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconTicket(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <path
        d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1l-2 1v4l2 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1l2-1v-4L2 10V9Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M10 8v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMapPin(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <path
        d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconSeat(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <path
        d="M5 11V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M5 11h14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8 17v3M16 17v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconStatus(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 12.5 10.5 15 16 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconX(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function IconAlert(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <path d="M12 4 3 19h18L12 4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconBolt(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <path
        d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Outline or filled star (e.g. ratings). */
export function IconStar({ filled, className = "", width = 14, height = 14, ...props }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`event-card-icon icon-star ${filled ? "icon-star--filled" : "icon-star--empty"} ${className}`.trim()}
      {...props}
    >
      <path
        d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg {...svgProps} className="event-card-icon" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
