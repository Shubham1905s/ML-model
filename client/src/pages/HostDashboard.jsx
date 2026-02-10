import { useEffect, useState } from "react";
import {
  getHostBookings,
  getHostListings,
  getHostOverview
} from "../services/dashboard.js";
import StatCard from "../components/StatCard.jsx";

const tabs = ["Listings", "Bookings", "Earnings"];

const emptyListing = {
  name: "",
  type: "Apartment",
  city: "",
  price: "",
  status: "Active"
};

export default function HostDashboard() {
  const [overview, setOverview] = useState(null);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Listings");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyListing);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [overviewData, listingsData, bookingData] = await Promise.all([
        getHostOverview(),
        getHostListings(),
        getHostBookings()
      ]);

      setOverview(overviewData);
      setListings(listingsData);
      setBookings(bookingData);
    };

    loadData().catch(() => {
      setOverview(null);
    });
  }, []);

  const openNewListing = () => {
    setEditing(null);
    setForm(emptyListing);
    setShowModal(true);
  };

  const openEdit = (listing) => {
    setEditing(listing.id);
    setForm({
      name: listing.name,
      type: listing.type,
      city: listing.location.city,
      price: listing.pricePerNight,
      status: listing.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const updatedListings = editing
      ? listings.map((item) =>
          item.id === editing
            ? {
                ...item,
                name: form.name,
                type: form.type,
                location: { ...item.location, city: form.city },
                pricePerNight: Number(form.price) || item.pricePerNight,
                status: form.status
              }
            : item
        )
      : [
          {
            id: `temp-${Date.now()}`,
            name: form.name,
            type: form.type,
            location: { city: form.city, state: "", country: "" },
            description: "Mock listing created locally.",
            amenities: ["WiFi"],
            pricePerNight: Number(form.price) || 0,
            maxGuests: 2,
            rating: 0,
            hostId: "u2",
            images: ["https://picsum.photos/seed/new-listing/800/500"],
            availability: {
              checkIn: "14:00",
              checkOut: "11:00",
              blackoutDates: []
            },
            status: form.status,
            bookingsThisMonth: 0
          },
          ...listings
        ];

    setListings(updatedListings);
    closeModal();
  };

  const openDelete = (listing) => {
    setDeleteModal(listing);
  };

  const closeDelete = () => setDeleteModal(null);

  const confirmDelete = () => {
    if (!deleteModal) return;
    setListings((items) => items.filter((item) => item.id !== deleteModal.id));
    closeDelete();
  };

  const getStatusColor = (status) => {
    if (status === "Active") return "#2c6a2f";
    if (status === "Under review") return "#1d4f6f";
    return "#7d3b12";
  };

  return (
    <main className="section">
      <div className="host-header">
        <div className="host-header-content">
          <div>
            <p className="eyebrow">Property Management</p>
            <h1>Welcome back, Host</h1>
            <p className="subtitle">Manage your listings, monitor bookings, and track earnings</p>
          </div>
          <button type="button" className="btn-primary-large" onClick={openNewListing}>
            + Create New Listing
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Active Listings"
          value={listings.filter((l) => l.status === "Active").length}
          hint="Properties live"
        />
        <StatCard
          label="Upcoming Bookings"
          value={overview ? overview.upcomingBookings : "--"}
          hint="Next 30 days"
        />
        <StatCard
          label="Monthly Revenue"
          value={overview ? `₹${(overview.monthlyEarnings || 0).toLocaleString()}` : "--"}
          hint="Total earned"
        />
        <StatCard
          label="Net Payout"
          value={overview ? `₹${(overview.netPayout || 0).toLocaleString()}` : "--"}
          hint="After platform fees"
        />
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              className={`tab-btn ${tab === activeTab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Listings" && (
          <div className="tab-content">
            {listings.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">No listings yet</p>
                <p className="empty-hint">Create your first listing to start hosting</p>
                <button type="button" className="primary" onClick={openNewListing}>
                  Create Listing
                </button>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.map((listing) => (
                  <div className="listing-card" key={listing.id}>
                    <div className="listing-image">
                      <img src={listing.images[0]} alt={listing.name} />
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(listing.status) }}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <div className="listing-body">
                      <div>
                        <h3>{listing.name}</h3>
                        <p className="listing-meta">
                          {listing.type} • {listing.location.city}
                        </p>
                      </div>
                      <div className="listing-footer">
                        <p className="price">₹{listing.pricePerNight}/night</p>
                        <p className="bookings">{listing.bookingsThisMonth} bookings</p>
                      </div>
                      <div className="listing-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => openEdit(listing)}
                        >
                          Edit
                        </button>
                        <button type="button" className="btn-secondary">
                          Dates
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => openDelete(listing)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Bookings" && (
          <div className="tab-content">
            {bookings.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">No bookings yet</p>
                <p className="empty-hint">Your bookings will appear here</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div className="booking-item" key={booking.id}>
                    <div className="booking-info">
                      <div>
                        <h4>{booking.guestName}</h4>
                        <p className="booking-property">{booking.propertyName}</p>
                        <p className="booking-dates">
                          {booking.checkInDate} → {booking.checkOutDate}
                        </p>
                      </div>
                    </div>
                    <div className="booking-amount">₹{booking.pricing.total.toLocaleString()}</div>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          booking.status === "Confirmed" ? "#2c6a2f" : "#1d4f6f"
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Earnings" && (
          <div className="tab-content">
            <div className="earnings-summary">
              <div className="earning-card">
                <p className="earning-label">Gross Earnings</p>
                <p className="earning-value">₹{overview ? (overview.monthlyEarnings || 0).toLocaleString() : "--"}</p>
                <span className="earning-period">This month</span>
              </div>
              <div className="earning-card">
                <p className="earning-label">Platform Fees</p>
                <p className="earning-value">₹{overview ? (overview.platformFees || 0).toLocaleString() : "--"}</p>
                <span className="earning-period">Deducted</span>
              </div>
              <div className="earning-card highlight">
                <p className="earning-label">Net Payout</p>
                <p className="earning-value">₹{overview ? (overview.netPayout || 0).toLocaleString() : "--"}</p>
                <span className="earning-period">Next: 2026-02-12</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <h3>{editing ? "Edit Listing" : "Create New Listing"}</h3>
              <button type="button" className="btn-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              <label>
                Property Name
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Property Type
                <select
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </label>
              <label>
                City
                <input
                  value={form.city}
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                  required
                />
              </label>
              <label>
                Price per Night
                <input
                  type="number"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  required
                />
              </label>
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Under review">Under review</option>
                  <option value="Paused">Paused</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {editing ? "Update Listing" : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-backdrop" role="presentation" onClick={closeDelete}>
          <div
            className="modal confirm-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <h3>Delete Listing</h3>
              <button type="button" className="btn-close" onClick={closeDelete}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{deleteModal.name}</strong>? This
                action cannot be undone.
              </p>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeDelete}>
                  Cancel
                </button>
                <button type="button" className="btn-danger-primary" onClick={confirmDelete}>
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
