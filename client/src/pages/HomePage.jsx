import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

const filters = [
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
  "Most Popular"
];

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState({ location: "", guests: 2, type: "" });
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [propRes, reviewRes, bookingRes, statsRes] = await Promise.all([
        api.get("/properties"),
        api.get("/reviews"),
        api.get("/bookings"),
        api.get("/stats")
      ]);

      setProperties(propRes.data);
      setReviews(reviewRes.data);
      setBookings(bookingRes.data);
      setStats(statsRes.data);
    };

    loadData().catch(() => {
      setProperties([]);
    });
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await api.get("/search", { params: search });
    setSearchResults(response.data);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div>
            <p className="eyebrow">Dummy MERN build</p>
            <h1>Book stays that feel like home ? instantly.</h1>
            <p className="subtitle">
              This is a fully mocked interface using dummy APIs. Every action is
              simulated and does not create real bookings or payments.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary">Explore stays</button>
              <Link to="/become-host" className="ghost-button">Become a host</Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>Quick stats</h3>
            {stats ? (
              <ul>
                <li><span>Active users</span>{stats.activeUsers}</li>
                <li><span>Bookings this month</span>{stats.bookingsThisMonth}</li>
                <li><span>Revenue (mock)</span>{stats.revenueThisMonth}</li>
                <li><span>Avg rating</span>{stats.averageRating}</li>
              </ul>
            ) : (
              <p>Loading stats...</p>
            )}
          </div>
        </div>
      </section>

      <section className="search-panel">
        <div>
          <h2>Search stays</h2>
          <p>Search is mocked but filters and sorting are wired to dummy data.</p>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <label>
            Location
            <input
              value={search.location}
              onChange={(event) =>
                setSearch({ ...search, location: event.target.value })
              }
              placeholder="Goa, Bengaluru, Jaipur"
            />
          </label>
          <label>
            Guests
            <input
              type="number"
              min="1"
              value={search.guests}
              onChange={(event) =>
                setSearch({ ...search, guests: event.target.value })
              }
            />
          </label>
          <label>
            Property type
            <select
              value={search.type}
              onChange={(event) =>
                setSearch({ ...search, type: event.target.value })
              }
            >
              <option value="">Any</option>
              <option value="Hotel">Hotel</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Hostel">Hostel</option>
            </select>
          </label>
          <button type="submit" className="primary">Search</button>
        </form>
        {searchResults && (
          <div className="search-results">
            <p>
              Found {searchResults.results.length} mock matches for{" "}
              {searchResults.criteria.location || "all locations"}
            </p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Featured properties</h2>
          <div className="filters">
            {filters.map((filter) => (
              <button type="button" key={filter}>{filter}</button>
            ))}
          </div>
        </div>
        <div className="grid">
          {properties.map((property) => (
            <article className="card" key={property.id}>
              <img src={property.images[0]} alt={property.name} />
              <div className="card-body">
                <div>
                  <h3>{property.name}</h3>
                  <p>
                    {property.type} ? {property.location.city}
                  </p>
                </div>
                <p className="price">
                  ?{property.pricePerNight} / night
                </p>
                <div className="meta">
                  <span>{property.rating} ?</span>
                  <span>{property.maxGuests} guests</span>
                </div>
                <button type="button" className="ghost">View details</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="detail-layout">
          <div>
            <h2>Room details (mock)</h2>
            <p>
              Every room has an image gallery, full description, amenities, map,
              and availability calendar. This card simulates the details page.
            </p>
            <div className="detail-grid">
              <div className="detail-box">
                <h4>Check-in / out</h4>
                <p>2:00 PM ? 11:00 AM</p>
              </div>
              <div className="detail-box">
                <h4>Amenities</h4>
                <p>WiFi, AC, Kitchen, Parking</p>
              </div>
              <div className="detail-box">
                <h4>Map</h4>
                <p>Google Maps embed placeholder</p>
              </div>
            </div>
          </div>
          <div className="booking-card">
            <h3>Book this stay</h3>
            <div className="booking-row">
              <label>
                Check-in
                <input type="date" defaultValue="2026-02-15" />
              </label>
              <label>
                Check-out
                <input type="date" defaultValue="2026-02-18" />
              </label>
            </div>
            <label>
              Guests
              <input type="number" min="1" defaultValue="2" />
            </label>
            <div className="price-breakdown">
              <div>
                <span>Base price</span>
                <span>?10,497</span>
              </div>
              <div>
                <span>Taxes</span>
                <span>?1,260</span>
              </div>
              <div>
                <span>Platform fee</span>
                <span>?420</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>?12,177</span>
              </div>
            </div>
            <button type="button" className="primary">Confirm booking</button>
            <p className="small">Payment is mocked. No real transaction occurs.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Guest dashboard (dummy)</h2>
        <div className="dashboard">
          <div className="panel">
            <h3>Bookings</h3>
            {bookings.map((booking) => (
              <div className="panel-row" key={booking.id}>
                <div>
                  <p>{booking.status}</p>
                  <span>
                    {booking.checkInDate} ? {booking.checkOutDate}
                  </span>
                </div>
                <strong>?{booking.pricing.total}</strong>
              </div>
            ))}
          </div>
          <div className="panel">
            <h3>Reviews</h3>
            {reviews.map((review) => (
              <div className="panel-row" key={review.id}>
                <div>
                  <p>{review.text}</p>
                  <span>{review.createdAt}</span>
                </div>
                <strong>{review.rating}?</strong>
              </div>
            ))}
          </div>
          <div className="panel">
            <h3>Host earnings</h3>
            <div className="panel-row">
              <div>
                <p>Total earnings (mock)</p>
                <span>Updated daily</span>
              </div>
              <strong>?2,84,530</strong>
            </div>
            <button type="button" className="ghost">View host dashboard</button>
          </div>
        </div>
      </section>
    </>
  );
}
