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

- GET /properties: List properties with filtering, sorting, and pagination.
- GET /properties/{id}: Get detailed information about a specific property.
- POST /scraper/caixa: Trigger scraping of Caixa Econômica Federal auction properties.
- GET /scraper/status: Check status of scraping tasks.

3. Property data model fields

- id: Unique identifier
- title: Property title or description
- address: Full address string
- city: City name
- state: State abbreviation
- auction_date: Date and time of the auction
- starting_price: Initial auction price
- current_bid: Current highest bid (if applicable)
- status: Auction status (active, finished)
- bank: Bank name (e.g., Caixa)
- property_type: Type of property (house, apartment, land, etc.)
- images: List of image URLs
- details: Additional property details (area, bedrooms, bathrooms, etc.)

4. How auction status (active/finished) should be calculated

- The status is determined by comparing the current date/time with the auction_date.
- If the auction_date is in the future, status is "active".
- If the auction_date is past, status is "finished".

5. How filters should work

- Filters include city, state, price range, auction status, property type, and bank.
- Filters are applied on the backend via query parameters.
- The backend returns filtered and paginated results.

6. How pagination and sorting should work

- Pagination uses page number and page size parameters.
- Sorting can be done by auction_date, starting_price, or current_bid.
- Sorting order can be ascending or descending.

7. How new scrapers (Banco do Brasil, Santander, etc.) can be added later

- Add new scraper modules under backend/scraper/ (e.g., banco_do_brasil_scraper.py).
- Add corresponding routes under backend/routes/scraper.py to trigger new scrapers.
- Extend services to handle data from new scrapers.
- Update models if needed to accommodate new data fields.
- Frontend can filter by bank to show properties from different banks.