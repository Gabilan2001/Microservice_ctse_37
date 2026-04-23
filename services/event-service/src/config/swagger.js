import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Service API",
      description: "API documentation for Event Management Service - handles event creation, retrieval, updates, and deletion",
      version: "1.0.0",
      contact: {
        name: "API Support",
        email: "support@ctse.com"
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3002}`,
        description: "Development Server"
      },
      {
        url: "http://api-gateway:80",
        description: "Production Server (via API Gateway)"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Token for authentication"
        }
      },
      schemas: {
        Event: {
          type: "object",
          required: ["title", "description", "date", "location", "totalSeats"],
          properties: {
            _id: {
              type: "string",
              description: "Unique event identifier (MongoDB ObjectId)",
              example: "507f1f77bcf86cd799439011"
            },
            title: {
              type: "string",
              description: "Event title",
              example: "Summer Music Festival"
            },
            description: {
              type: "string",
              description: "Detailed event description",
              example: "A vibrant summer music festival featuring local and international artists"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Event date and time",
              example: "2026-07-15T18:00:00Z"
            },
            location: {
              type: "string",
              description: "Event venue location",
              example: "Central Park, New York"
            },
            imageUrl: {
              type: "string",
              description: "URL to event banner/cover image",
              example: "https://cdn.example.com/events/music-festival.jpg"
            },
            totalSeats: {
              type: "number",
              description: "Total number of available seats for the event",
              example: 500
            },
            availableSeats: {
              type: "number",
              description: "Number of seats still available for booking",
              example: 250
            },
            createdBy: {
              type: "string",
              description: "User ID of event creator",
              example: "507f1f77bcf86cd799439012"
            },
            creatorEmail: {
              type: "string",
              format: "email",
              description: "Email of event creator",
              example: "organizer@example.com"
            },
            creatorName: {
              type: "string",
              description: "Name of event creator",
              example: "John Organizer"
            },
            creatorRole: {
              type: "string",
              enum: ["admin", "organizer", "attendee"],
              description: "Role of the event creator",
              example: "organizer"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Event creation timestamp",
              example: "2026-05-20T10:30:00Z"
            }
          }
        },
        EventCreateRequest: {
          type: "object",
          required: ["title", "description", "date", "location", "totalSeats"],
          properties: {
            title: {
              type: "string",
              description: "Event title",
              example: "Summer Music Festival"
            },
            description: {
              type: "string",
              description: "Detailed event description",
              example: "A vibrant summer music festival featuring local and international artists"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Event date and time",
              example: "2026-07-15T18:00:00Z"
            },
            location: {
              type: "string",
              description: "Event venue location",
              example: "Central Park, New York"
            },
            imageUrl: {
              type: "string",
              description: "URL to event banner/cover image",
              example: "https://cdn.example.com/events/music-festival.jpg"
            },
            totalSeats: {
              type: "number",
              description: "Total number of available seats for the event",
              example: 500
            }
          }
        },
        EventUpdateRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Event title",
              example: "Updated Festival Title"
            },
            description: {
              type: "string",
              description: "Detailed event description",
              example: "Updated description"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Event date and time",
              example: "2026-07-15T18:00:00Z"
            },
            location: {
              type: "string",
              description: "Event venue location",
              example: "Updated Location"
            },
            imageUrl: {
              type: "string",
              description: "URL to event banner/cover image",
              example: "https://cdn.example.com/events/updated.jpg"
            },
            totalSeats: {
              type: "number",
              description: "Total number of available seats",
              example: 600
            }
          }
        },
        ImageUploadResponse: {
          type: "object",
          properties: {
            imageUrl: {
              type: "string",
              description: "URL of the uploaded image",
              example: "https://res.cloudinary.com/example/image/upload/v123/ctse-events/image.jpg"
            }
          }
        },
        Banner: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Banner document ID",
              example: "507f1f77bcf86cd799439013"
            },
            key: {
              type: "string",
              description: "Banner identifier key",
              example: "home-banner"
            },
            imageUrl: {
              type: "string",
              description: "URL of the banner image",
              example: "https://res.cloudinary.com/example/image/upload/v123/banners/home.jpg"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2026-05-20T10:30:00Z"
            }
          }
        },
        BannerUpdateRequest: {
          type: "object",
          required: ["imageUrl"],
          properties: {
            imageUrl: {
              type: "string",
              description: "URL of the banner image",
              example: "https://res.cloudinary.com/example/image/upload/v123/banners/home.jpg"
            }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "Event not found"
            }
          }
        },
        HealthCheck: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Service status",
              example: "Event Service is healthy"
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Health check timestamp",
              example: "2026-05-20T10:30:00.000Z"
            }
          }
        }
      }
    },
    security: []
  },
  apis: ["./src/routes/eventRoutes.js"]
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
