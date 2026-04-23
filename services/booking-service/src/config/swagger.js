const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking Service API",
      version: "1.0.0",
      description: "Booking microservice for Event Management System"
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8081}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        Booking: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6808bf47a90881efe7f5932b" },
            userId: { type: "string", example: "6800ea1bb929d5b5f80c9321" },
            userEmail: { type: "string", example: "user@example.com", nullable: true },
            userName: { type: "string", example: "John Doe", nullable: true },
            userRole: { type: "string", example: "attendee", nullable: true },
            eventId: { type: "string", example: "6808bf47a90881efe7f51000" },
            seats: { type: "number", example: 2 },
            seatNumbers: {
              type: "array",
              items: { type: "number" },
              example: [1, 2]
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "BOOKED"],
              example: "pending"
            },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        BannerRequest: {
          type: "object",
          required: ["imageUrl"],
          properties: {
            imageUrl: {
              type: "string",
              example: "https://res.cloudinary.com/demo/image/upload/v1/events/banner.jpg"
            }
          }
        },
        BookingStatusUpdateRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["confirmed"],
              example: "confirmed"
            }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Internal server error" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec