const trimTrailingSlash = (value) => (value || "").replace(/\/$/, "");

const apiBase = trimTrailingSlash(process.env.REACT_APP_API_BASE_URL);
const gateway = trimTrailingSlash(process.env.REACT_APP_API_GATEWAY_URL);
const proxyBase = trimTrailingSlash(process.env.REACT_APP_API_PROXY_BASE);
const isProduction = process.env.NODE_ENV === "production";

const baseApi = apiBase || gateway || proxyBase || (isProduction ? "/api" : "");

const resolveDirectServiceUrl = (directServiceUrl, pathAfterApi) => {
  const sanitizedDirectUrl = trimTrailingSlash(directServiceUrl);

  if (!sanitizedDirectUrl) {
    return sanitizedDirectUrl;
  }

  // Accept either a host-only URL (http://host:port) or a full API endpoint
  // (http://host:port/api/events). Also supports base /api URL.
  if (sanitizedDirectUrl.includes("/api/")) {
    return sanitizedDirectUrl;
  }

  if (sanitizedDirectUrl.endsWith("/api")) {
    return `${sanitizedDirectUrl}${pathAfterApi}`;
  }

  return `${sanitizedDirectUrl}/api${pathAfterApi}`;
};

const resolveApiUrl = (pathAfterApi, directServiceUrl) => {
  if (baseApi) {
    return `${baseApi}${pathAfterApi}`;
  }

  return resolveDirectServiceUrl(directServiceUrl, pathAfterApi);
};

/**
 * REACT_APP_API_BASE_URL is the single override for all APIs
 * (example: https://api.example.com/api or /api).
 *
 * When REACT_APP_API_GATEWAY_URL is set (e.g. http://3.214.194.159:8081), all API
 * calls go through the gateway. Otherwise use per-service URLs (direct to each port).
 */
export const eventApiUrl =
  resolveApiUrl(
    "/events",
    process.env.REACT_APP_EVENT_API_URL || "http://localhost:3002/api/events"
  );

export const bookingApiUrl =
  resolveApiUrl(
    "/bookings",
    process.env.REACT_APP_BOOKING_API_URL || "http://localhost:3003/api/bookings"
  );

export const authApiUrl =
  resolveApiUrl(
    "/auth",
    process.env.REACT_APP_AUTH_API_URL || "http://localhost:3001/api/auth"
  );

export const reviewApiUrl =
  resolveApiUrl(
    "/reviews",
    process.env.REACT_APP_REVIEW_API_URL || "http://localhost:3004/api/reviews"
  );
