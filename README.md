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

- GET /properties: List properties with support for filters, pagination, and sorting.
- GET /properties/{id}: Get detailed information about a specific property.
- POST /scraper/caixa: Trigger scraping of Caixa Econômica Federal auction properties.
- Additional scraper endpoints can be added for other banks.

3. Property data model fields

- id: Unique identifier
- title: Property title or description
- address: Full address
- city: City name
- state: State abbreviation
- auction_date: Date and time of auction
- price: Starting price or current bid
- status: Auction status (active, finished)
- bank: Bank name (e.g., Caixa)
- url: Link to auction listing
- images: List of image URLs
- created_at: Record creation timestamp
- updated_at: Record update timestamp

4. How auction status (active/finished) should be calculated

- Status is determined by comparing the current date/time with the auction_date.
- If current datetime < auction_date, status is "active".
- Otherwise, status is "finished".

5. How filters should work

- Filters can be applied on fields like city, state, price range, auction status, bank, and auction date range.
- Filters are passed as query parameters to the /properties endpoint.
- Backend applies filters in database queries for efficient retrieval.

6. How pagination and sorting should work

- Pagination via query parameters: page number and page size.
- Sorting by fields such as auction_date, price, or city in ascending or descending order.
- Backend returns paginated results with metadata (total count, pages).

7. How new scrapers (Banco do Brasil, Santander, etc.) can be added later

- Add new scraper modules under backend/scraper/ (e.g., banco_do_brasil_scraper.py).
- Implement scraping logic specific to the bank.
- Add corresponding routes in backend/routes/scraper.py to trigger new scrapers.
- Extend services/property_service.py to handle data from new scrapers.
- Update models/property.py if needed to accommodate new data fields.
- Frontend can remain unchanged as it consumes unified API data.

--------------------------------------------------