# Event Management API

A full-featured backend API for creating and managing events, built with Node.js, Express, and PostgreSQL.  
Designed to demonstrate backend logic, validation, and data handling.

---

## Features

- Create and list events
- Register users for events (with constraints)
- Cancel registrations
- Get event details with user list
- Get event stats (capacity, usage %)
- List upcoming events with custom sorting

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL client for Node)
- dotenv, cors

---

## Setup Instructions

1. Clone the repo
   ```bash
   git clone https://github.com/VaibhavRajai/eventmanagement_apis
    cd eventmanagement_apis


##  API Endpoints & Descriptions

### 🔹 `POST /events/create`
Create a new event. Validates capacity (must be between 1–1000) and returns the event ID upon success.

---

### 🔹 `POST /events/register`
Registers a user for a specific event.  
Constraints:
- No duplicate registration
- Cannot register if the event is full
- Cannot register for past events

---

### 🔹 `DELETE /events/cancel`
Cancels a user's registration for a specific event.  
Returns an error if the user is not already registered.

---

### 🔹 `GET /events/get/:id`
Fetch full event details using the event ID.  
Returns event info along with a list of registered users.

---

### 🔹 `GET /events/getUpcoming`
Fetch all upcoming (future) events.  
Events are sorted:
- First by date (ascending)
- Then by location (alphabetically)

---

### 🔹 `GET /events/getStats/:id`
Returns statistics for a specific event:
- Total number of registrations
- Remaining capacity
- Percentage of capacity used
