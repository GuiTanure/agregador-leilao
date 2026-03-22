# Real Estate Auction Aggregator

This project is organized into a full stack architecture:

- backend/: FastAPI backend with routes, scraper, services, models, utils, and db layers.
- frontend/: Frontend application structure.

Folder responsibilities:

- routes: API endpoint definitions. Handles incoming HTTP requests and maps them to service calls.
- scraper: Modules to scrape real estate data from various bank auction websites.
- services: Business logic and data processing, including data validation and transformation.
- models: Data models and schemas representing the domain entities.
- utils: Helper functions and utilities used across the backend.
- db: Database connection and setup, including ORM configuration.

--------------------------------------------------
BACKEND ARCHITECTURE
--------------------------------------------------

backend/
│
├── routes/
│   ├── properties.py        # API endpoints related to property data
│   └── scraper.py           # API endpoints to trigger or monitor scraping tasks
│
├── scraper/
│   └── caixa_scraper.py     # Scraper implementation for Caixa Econômica Federal auctions
│
├── services/
│   └── property_service.py  # Business logic for property data management
│
├── models/
│   └── property.py          # Property data models and schemas
│
├── utils/
│   └── helpers.py           # Utility functions and helpers
│
├── db.py                    # Database connection and ORM setup
└── main.py                  # FastAPI app initialization and route inclusion

--------------------------------------------------
FRONTEND ARCHITECTURE
--------------------------------------------------

frontend/
│
├── components/
│   ├── FilterSidebar        # UI component for filtering properties
│   ├── PropertyCard         # UI component to display individual property info
│   ├── PropertyGrid         # UI component to display a grid/list of properties
│   ├── Pagination           # UI component for pagination controls
│   └── Navbar               # Navigation bar component
│
├── pages/
│   ├── Dashboard            # Main page showing property listings and filters
│   └── PropertyDetails      # Detailed view of a single property
│
├── services/
│   └── api                  # API service layer to communicate with backend
│
├── hooks/
│   ├── useProperties        # Custom hook to fetch and manage property data
│   └── useFilters           # Custom hook to manage filter state and logic
│
├── styles/
│   └── global.css           # Global CSS styles
│
└── utils/                   # Utility functions for frontend

--------------------------------------------------
SYSTEM DESCRIPTION
--------------------------------------------------

1. Data flow: scraper → database → API → frontend

- Scraper modules (e.g., caixa_scraper.py) extract auction property data from bank websites.
- Scraped data is processed and stored in the database via services and models.
- The backend exposes API endpoints to query property data.
- The frontend consumes these APIs to display auction properties to users.

2. Main API endpoints

- GET /properties: Retrieve a paginated list of properties with filtering and sorting options.
- GET /properties/{id}: Retrieve detailed information about a specific property.
- POST /scraper/caixa: Trigger scraping of Caixa Econômica Federal auction properties.
- GET /scraper/status: Check the status of ongoing or last scraping tasks.

3. Property data model fields

- id: Unique identifier
- title: Property title or description
- address: Full address of the property
- city: City where the property is located
- state: State abbreviation
- auction_date: Date and time of the auction
- starting_bid: Initial bid amount
- current_bid: Current highest bid (if available)
- auction_status: Computed field indicating if auction is active or finished
- bank: Bank holding the auction (e.g., Caixa)
- property_type: Type of property (house, apartment, land, etc.)
- images: List of image URLs
- details: Additional property details and features

4. How auction status (active/finished) should be calculated

- The auction_status is determined by comparing the current date/time with the auction_date.
- If the current date/time is before the auction_date, status is "active".
- If the current date/time is after the auction_date, status is "finished".

5. How filters should work

- Filters allow users to narrow down properties by:
  - Location (city, state)
  - Property type
  - Auction status (active/finished)
  - Price range (starting_bid)
  - Auction date range
- Filters are applied via query parameters on the GET /properties endpoint.

6. How pagination and sorting should work

- Pagination is implemented via query parameters: page number and page size.
- Sorting can be applied on fields like auction_date, starting_bid, and city.
- Default sorting is by auction_date ascending (soonest auctions first).

7. How new scrapers (Banco do Brasil, Santander, etc.) can be added later

- Add new scraper modules under backend/scraper/ (e.g., banco_do_brasil_scraper.py).
- Implement scraper logic specific to the bank's auction website.
- Add corresponding routes in backend/routes/scraper.py to trigger new scrapers.
- Extend services/property_service.py to handle data from new scrapers.
- Update models/property.py if needed to accommodate new data fields.
- This modular approach allows easy integration of additional banks without affecting existing code.