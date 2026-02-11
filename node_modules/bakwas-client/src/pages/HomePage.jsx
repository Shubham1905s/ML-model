import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

const filters = [
  "Price: Low to High",
  "Price: High to Low",
  "Top Rated",
  "Most Popular"
];

const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");

const formatCurrency = (value) => `INR ${formatNumber(value)}`;

const formatRating = (value) => `${Number(value || 0).toFixed(1)} / 5`;

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState({ location: "", guests: 2, type: "" });
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [propRes, reviewRes, bookingRes] = await Promise.all([
        api.get("/properties"),
        api.get("/reviews"),
        api.get("/bookings")
      ]);

      setProperties(propRes.data);
      setReviews(reviewRes.data);
      setBookings(bookingRes.data);
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

  const destinationSummary = properties.reduce((acc, property) => {
    const city = property.location?.city || "Unknown";
    if (!acc[city]) {
      acc[city] = { city, listings: 0, topPrice: 0 };
    }
    acc[city].listings += 1;
    acc[city].topPrice = Math.max(acc[city].topPrice, Number(property.pricePerNight) || 0);
    return acc;
  }, {});

  const topDestinations = Object.values(destinationSummary)
    .sort((a, b) => b.listings - a.listings || b.topPrice - a.topPrice)
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div>
            <p className="eyebrow">Trusted stays across India</p>
            <h1>Book stays that feel like home, instantly.</h1>
            <p className="subtitle">
              Find verified homes, villas, and hotels in top destinations with
              transparent pricing and guest-first support.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary">Explore stays</button>
              <Link to="/become-host" className="ghost-button">Become a host</Link>
            </div>
          </div>
          <div className="hero-card">
            <h3>Popular destinations</h3>
            {topDestinations.length > 0 ? (
              <ul>
                {topDestinations.map((destination) => (
                  <li key={destination.city}>
                    <span>{destination.city}</span>
                    <strong>
                      {destination.listings} stays from {formatCurrency(destination.topPrice)}/night
                    </strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading destinations...</p>
            )}
          </div>
        </div>
      </section>

      <section className="search-panel">
        <div>
          <h2>Search stays</h2>
          <p>Filter by location, guests, and property type to find the right stay.</p>
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
              Found {formatNumber(searchResults.results.length)} stays for{" "}
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
                    {property.type} in {property.location.city}
                  </p>
                </div>
                <p className="price">
                  {formatCurrency(property.pricePerNight)} / night
                </p>
                <div className="meta">
                  <span>{formatRating(property.rating)}</span>
                  <span>Up to {property.maxGuests} guests</span>
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
            <h2>Room details</h2>
            <p>
              Each listing includes a full gallery, detailed amenities, nearby
              map view, and an up-to-date availability calendar.
            </p>
            <div className="detail-grid">
              <div className="detail-box">
                <h4>Check-in / out</h4>
                <p>2:00 PM to 11:00 AM</p>
              </div>
              <div className="detail-box">
                <h4>Amenities</h4>
                <p>WiFi, AC, Kitchen, Parking</p>
              </div>
              <div className="detail-box">
                <h4>Map</h4>
                <p>Property location and neighborhood highlights</p>
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
                <span>{formatCurrency(10497)}</span>
              </div>
              <div>
                <span>Taxes</span>
                <span>{formatCurrency(1260)}</span>
              </div>
              <div>
                <span>Platform fee</span>
                <span>{formatCurrency(150)}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>{formatCurrency(11907)}</span>
              </div>
            </div>
            <button type="button" className="primary">Confirm booking</button>
            <p className="small">You will be charged only after booking confirmation.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Guest dashboard</h2>
        <div className="dashboard">
          <div className="panel">
            <h3>Bookings</h3>
            {bookings.map((booking) => (
              <div className="panel-row" key={booking.id}>
                <div>
                  <p>{booking.status}</p>
                  <span>
                    {formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}
                  </span>
                </div>
                <strong>{formatCurrency(booking.pricing.total)}</strong>
              </div>
            ))}
          </div>
          <div className="panel">
            <h3>Reviews</h3>
            {reviews.map((review) => (
              <div className="panel-row" key={review.id}>
                <div>
                  <p>{review.text}</p>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
                <strong>{formatRating(review.rating)}</strong>
              </div>
            ))}
          </div>
          <div className="panel">
            <h3>Host earnings</h3>
            <div className="panel-row">
              <div>
                <p>Total earnings</p>
                <span>Updated daily</span>
              </div>
              <strong>{formatCurrency(284530)}</strong>
            </div>
            <button type="button" className="ghost">View host dashboard</button>
          </div>
        </div>
      </section>
    </>
  );
}
