import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api.js";
import { useAuth } from "../auth/AuthProvider.jsx";
import CaptchaField from "../components/CaptchaField.jsx";

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
  const { t } = useTranslation();
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
      setBookingError(t("home.booking.loginToBook"));
      return;
    }
    if (user.role !== "guest") {
      setBookingError(t("home.booking.hostCannotBook"));
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
            <p className="eyebrow">{t("home.hero.eyebrow")}</p>
            <h1>{t("home.hero.title")}</h1>
            <p className="subtitle">{t("home.hero.subtitle")}</p>
            <div className="hero-actions">
              <button type="button" className="primary">{t("home.hero.exploreStays")}</button>
            </div>
          </div>
          <div className="hero-card">
            <h3>{t("home.popularDestinations")}</h3>
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
              <p>{t("common.loading")}</p>
            )}
          </div>
        </div>
      </section>

      <section className="search-panel">
        <div>
          <h2>{t("home.search.title")}</h2>
          <p>{t("home.search.subtitle")}</p>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <label>
            {t("home.search.location")}
            <input
              value={search.location}
              onChange={(event) => setSearch({ ...search, location: event.target.value })}
              placeholder={t("home.search.location")}
            />
          </label>
          <label>
            {t("home.search.guests")}
            <input
              type="number"
              min="1"
              value={search.guests}
              onChange={(event) => setSearch({ ...search, guests: event.target.value })}
            />
          </label>
          <label>
            {t("home.search.propertyType")}
            <select value={search.type} onChange={(event) => setSearch({ ...search, type: event.target.value })}>
              <option value="">{t("home.search.any")}</option>
              <option value="Hotel">{t("home.search.hotel")}</option>
              <option value="Apartment">{t("home.search.apartment")}</option>
              <option value="Villa">{t("home.search.villa")}</option>
              <option value="Hostel">{t("home.search.hostel")}</option>
            </select>
          </label>
          <button type="submit" className="primary">{t("home.search.searchBtn")}</button>
        </form>
        {searchResults && (
          <div className="search-results">
            <p>{t("home.search.found", { count: formatNumber(searchResults.results.length), location: searchResults.criteria.location || "" })}</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{t("home.featured")}</h2>
          <div className="filters">
            {[t("home.filters.priceLowHigh"), t("home.filters.priceHighLow"), t("home.filters.topRated"), t("home.filters.mostPopular")].map((filter) => (
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
                <p className="price">{formatCurrency(property.pricePerNight)} {t("home.perNight")}</p>
                <div className="meta">
                  <span>{formatRating(property.rating)}</span>
                  <span>{t("home.upToGuests", { count: property.maxGuests })}</span>
                </div>
                <button type="button" className="ghost" onClick={() => setSelectedPropertyId(property.id)}>
                  {t("home.details.viewDetails")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="detail-layout">
          <div>
            <h2>{t("home.details.title")}</h2>
            {selectedProperty ? (
              <>
                <p>{selectedProperty.description}</p>
                <div className="detail-grid">
                  <div className="detail-box">
                    <h4>{selectedProperty.name}</h4>
                    <p>{selectedProperty.type} in {selectedProperty.location.city}</p>
                  </div>
                  <div className="detail-box">
                    <h4>{t("home.details.checkIn")}</h4>
                    <p>{t("home.details.checkIn")}: {selectedProperty.availability?.checkIn || "14:00"} | {t("home.details.checkOut")}: {selectedProperty.availability?.checkOut || "11:00"}</p>
                  </div>
                  <div className="detail-box">
                    <h4>{t("home.details.blackoutDates")}</h4>
                    <p>
                      {selectedProperty.availability?.blackoutDates?.length
                        ? selectedProperty.availability.blackoutDates.join(", ")
                        : t("home.details.noBlackout")}
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
              <p>{t("home.details.noProperty")}</p>
            )}
          </div>

          <form className="booking-card" onSubmit={handleBookNow}>
            <h3>{t("home.booking.title")}</h3>
            <div className="booking-row">
              <label>
                {t("home.booking.checkIn")}
                <input
                  type="date"
                  value={bookingForm.checkInDate}
                  onChange={(event) => setBookingForm({ ...bookingForm, checkInDate: event.target.value })}
                />
              </label>
              <label>
                {t("home.booking.checkOut")}
                <input
                  type="date"
                  value={bookingForm.checkOutDate}
                  onChange={(event) => setBookingForm({ ...bookingForm, checkOutDate: event.target.value })}
                />
              </label>
            </div>
            <label>
              {t("home.booking.guests")}
              <input
                type="number"
                min="1"
                max={selectedProperty?.maxGuests || 1}
                value={bookingForm.guests}
                onChange={(event) => setBookingForm({ ...bookingForm, guests: event.target.value })}
              />
            </label>
            <label>
              {t("home.booking.paymentMethod")}
              <select
                value={bookingForm.paymentMethod}
                onChange={(event) => setBookingForm({ ...bookingForm, paymentMethod: event.target.value })}
              >
                <option value="Onsite Payment">{t("home.booking.onsitePayment")}</option>
                <option value="Net Banking">{t("home.booking.netBanking")}</option>
                <option value="UPI">{t("home.booking.upi")}</option>
              </select>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={bookingForm.termsAccepted}
                onChange={(event) => setBookingForm({ ...bookingForm, termsAccepted: event.target.checked })}
              />
              {t("home.booking.terms")}
            </label>
            <CaptchaField
              purpose="booking"
              value={bookingCaptcha}
              onChange={setBookingCaptcha}
              disabled={bookingLoading}
            />
            <div className="price-breakdown">
              <div><span>{t("home.booking.basePrice", { nights })}</span><span>{formatCurrency(pricing.base)}</span></div>
              <div><span>{t("home.booking.taxes")}</span><span>{formatCurrency(pricing.taxes)}</span></div>
              <div><span>{t("home.booking.platformFee")}</span><span>{formatCurrency(pricing.platformFee)}</span></div>
              <div className="total"><span>{t("home.booking.total")}</span><span>{formatCurrency(pricing.total)}</span></div>
            </div>
            <button type="submit" className="primary" disabled={bookingLoading || user?.role === "host"}>
              {bookingLoading ? t("home.booking.booking") : t("home.booking.bookNow")}
            </button>
            {user?.role === "host" && <p className="small error">{t("home.booking.hostCannotBook")}</p>}
            {bookingError && <p className="error">{bookingError}</p>}
            {bookingMessage && <p className="success">{bookingMessage}</p>}
          </form>
        </div>
      </section>

      {user && (user.role === "guest" || user.role === "admin") && (
        <section className="section">
          <h2>{t("home.dashboard.title")}</h2>
          <div className="dashboard">
            <div className="panel">
              <h3>{t("home.dashboard.bookings")}</h3>
              {bookings.length === 0 ? (
                <p className="small">{t("home.dashboard.noBookings")}</p>
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
              <h3>{t("home.dashboard.reviews")}</h3>
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
