import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import CaptchaField from "../components/CaptchaField.jsx";

const filters = ["Price: Low to High", "Price: High to Low", "Top Rated", "Most Popular"];

const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");
const formatCurrency = (value) => `INR ${formatNumber(value)}`;
const formatRating = (value) => `${Number(value || 0).toFixed(1)} / 5`;

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const defaultBookingForm = {
  checkInDate: "2026-02-15",
  checkOutDate: "2026-02-18",
  guests: 2,
  paymentMethod: "Onsite Payment",
  termsAccepted: false
};

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState({ location: "", guests: 2, type: "" });
  const [searchResults, setSearchResults] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [bookingForm, setBookingForm] = useState(defaultBookingForm);
  const [bookingCaptcha, setBookingCaptcha] = useState({ captchaId: "", text: "" });
  const [bookingError, setBookingError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [propRes, reviewRes] = await Promise.all([api.get("/properties"), api.get("/reviews")]);
      setProperties(propRes.data);
      setReviews(reviewRes.data);
      if (propRes.data.length > 0) {
        setSelectedPropertyId(propRes.data[0].id);
      }
    };

    loadData().catch(() => {
      setProperties([]);
      setReviews([]);
    });
  }, []);

  useEffect(() => {
    if (!user || (user.role !== "guest" && user.role !== "admin")) {
      setBookings([]);
      return;
    }
    api
      .get("/bookings")
      .then((response) => setBookings(response.data))
      .catch(() => setBookings([]));
  }, [user]);

  const selectedProperty = useMemo(
    () => properties.find((item) => item.id === selectedPropertyId) || properties[0] || null,
    [properties, selectedPropertyId]
  );

  const nights = useMemo(() => {
    const start = new Date(`${bookingForm.checkInDate}T00:00:00`);
    const end = new Date(`${bookingForm.checkOutDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 1;
    return Math.max(1, Math.round((end - start) / (24 * 60 * 60 * 1000)));
  }, [bookingForm.checkInDate, bookingForm.checkOutDate]);

  const pricing = useMemo(() => {
    const base = Number(selectedProperty?.pricePerNight || 0) * nights;
    const taxes = Math.round(base * 0.12);
    const platformFee = Math.round(base * 0.04);
    const total = base + taxes + platformFee;
    return { base, taxes, platformFee, total };
  }, [nights, selectedProperty]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await api.get("/search", { params: search });
    setSearchResults(response.data);
  };

  const handleBookNow = async (event) => {
    event.preventDefault();
    setBookingError("");
    setBookingMessage("");

    if (!user) {
      setBookingError("Please login as a guest user to book.");
      return;
    }
    if (user.role !== "guest") {
      setBookingError("Only guest users can book properties.");
      return;
    }
    if (!selectedProperty) {
      setBookingError("Please select a property first.");
      return;
    }
    if (!bookingForm.termsAccepted) {
      setBookingError("Please accept terms and conditions.");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post("/bookings", {
        propertyId: selectedProperty.id,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guests: Number(bookingForm.guests),
        paymentMethod: bookingForm.paymentMethod,
        termsAccepted: bookingForm.termsAccepted,
        captchaId: bookingCaptcha.captchaId,
        captchaText: bookingCaptcha.text
      });
      setBookingMessage(
        `${response.data.message} Payment method: ${response.data.payment.method}`
      );
      setBookings((prev) => [response.data.booking, ...prev]);
      setBookingForm((prev) => ({ ...prev, termsAccepted: false }));
      setBookingCaptcha({ captchaId: "", text: "" });
    } catch (error) {
      setBookingError(error.response?.data?.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const destinationSummary = properties.reduce((acc, property) => {
    const city = property.location?.city || "Unknown";
    if (!acc[city]) acc[city] = { city, listings: 0, topPrice: 0 };
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
              Find verified homes, villas, and hotels in top destinations with transparent pricing and guest-first support.
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
              onChange={(event) => setSearch({ ...search, location: event.target.value })}
              placeholder="Goa, Bengaluru, Jaipur"
            />
          </label>
          <label>
            Guests
            <input
              type="number"
              min="1"
              value={search.guests}
              onChange={(event) => setSearch({ ...search, guests: event.target.value })}
            />
          </label>
          <label>
            Property type
            <select value={search.type} onChange={(event) => setSearch({ ...search, type: event.target.value })}>
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
            <p>Found {formatNumber(searchResults.results.length)} stays for {searchResults.criteria.location || "all locations"}</p>
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
            <article className={`card ${selectedProperty?.id === property.id ? "card-selected" : ""}`} key={property.id}>
              <img src={property.images[0]} alt={property.name} />
              <div className="card-body">
                <div>
                  <h3>{property.name}</h3>
                  <p>{property.type} in {property.location.city}</p>
                </div>
                <p className="price">{formatCurrency(property.pricePerNight)} / night</p>
                <div className="meta">
                  <span>{formatRating(property.rating)}</span>
                  <span>Up to {property.maxGuests} guests</span>
                </div>
                <button type="button" className="ghost" onClick={() => setSelectedPropertyId(property.id)}>
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="detail-layout">
          <div>
            <h2>Property details</h2>
            {selectedProperty ? (
              <>
                <p>{selectedProperty.description}</p>
                <div className="detail-grid">
                  <div className="detail-box">
                    <h4>{selectedProperty.name}</h4>
                    <p>{selectedProperty.type} in {selectedProperty.location.city}</p>
                  </div>
                  <div className="detail-box">
                    <h4>Availability</h4>
                    <p>Check-in: {selectedProperty.availability?.checkIn || "14:00"} | Check-out: {selectedProperty.availability?.checkOut || "11:00"}</p>
                  </div>
                  <div className="detail-box">
                    <h4>Blackout Dates</h4>
                    <p>
                      {selectedProperty.availability?.blackoutDates?.length
                        ? selectedProperty.availability.blackoutDates.join(", ")
                        : "No blocked dates"}
                    </p>
                  </div>
                </div>
                <div className="property-gallery">
                  {(selectedProperty.images || []).map((imageUrl, index) => (
                    <img key={`${selectedProperty.id}-img-${index}`} src={imageUrl} alt={`${selectedProperty.name} ${index + 1}`} />
                  ))}
                </div>
              </>
            ) : (
              <p>No property selected.</p>
            )}
          </div>

          <form className="booking-card" onSubmit={handleBookNow}>
            <h3>Book this stay</h3>
            <div className="booking-row">
              <label>
                Check-in
                <input
                  type="date"
                  value={bookingForm.checkInDate}
                  onChange={(event) => setBookingForm({ ...bookingForm, checkInDate: event.target.value })}
                />
              </label>
              <label>
                Check-out
                <input
                  type="date"
                  value={bookingForm.checkOutDate}
                  onChange={(event) => setBookingForm({ ...bookingForm, checkOutDate: event.target.value })}
                />
              </label>
            </div>
            <label>
              Guests
              <input
                type="number"
                min="1"
                max={selectedProperty?.maxGuests || 1}
                value={bookingForm.guests}
                onChange={(event) => setBookingForm({ ...bookingForm, guests: event.target.value })}
              />
            </label>
            <label>
              Payment method
              <select
                value={bookingForm.paymentMethod}
                onChange={(event) => setBookingForm({ ...bookingForm, paymentMethod: event.target.value })}
              >
                <option value="Onsite Payment">Onsite Payment (Pay at property)</option>
                <option value="Net Banking">Net Banking</option>
                <option value="UPI">UPI</option>
              </select>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={bookingForm.termsAccepted}
                onChange={(event) => setBookingForm({ ...bookingForm, termsAccepted: event.target.checked })}
              />
              I agree to Terms and Conditions
            </label>
            <CaptchaField
              purpose="booking"
              value={bookingCaptcha}
              onChange={setBookingCaptcha}
              disabled={bookingLoading}
            />
            <div className="price-breakdown">
              <div><span>Base price ({nights} nights)</span><span>{formatCurrency(pricing.base)}</span></div>
              <div><span>Taxes</span><span>{formatCurrency(pricing.taxes)}</span></div>
              <div><span>Platform fee</span><span>{formatCurrency(pricing.platformFee)}</span></div>
              <div className="total"><span>Total</span><span>{formatCurrency(pricing.total)}</span></div>
            </div>
            <button type="submit" className="primary" disabled={bookingLoading || user?.role === "host"}>
              {bookingLoading ? "Booking..." : "Book now"}
            </button>
            {user?.role === "host" && <p className="small error">Host users cannot book properties.</p>}
            {bookingError && <p className="error">{bookingError}</p>}
            {bookingMessage && <p className="success">{bookingMessage}</p>}
          </form>
        </div>
      </section>

      {user && (user.role === "guest" || user.role === "admin") && (
        <section className="section">
          <h2>Guest dashboard</h2>
          <div className="dashboard">
            <div className="panel">
              <h3>Bookings</h3>
              {bookings.length === 0 ? (
                <p className="small">No bookings yet.</p>
              ) : (
                bookings.map((booking) => (
                  <div className="panel-row" key={booking.id}>
                    <div>
                      <p>{booking.status}</p>
                      <span>{formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}</span>
                    </div>
                    <strong>{formatCurrency(booking.pricing?.total)}</strong>
                  </div>
                ))
              )}
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
          </div>
        </section>
      )}
    </>
  );
}
