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

  return (
    <main className="section">
      <div className="page-head">
        <div>
          <p className="eyebrow">Host dashboard</p>
          <h2>Manage your properties and bookings</h2>
        </div>
        <button type="button" className="primary" onClick={openNewListing}>
          Add new listing
        </button>
      </div>

      <div className="dashboard">
        <StatCard
          label="Total listings"
          value={overview ? overview.totalListings : "--"}
          hint="Active properties"
        />
        <StatCard
          label="Upcoming bookings"
          value={overview ? overview.upcomingBookings : "--"}
          hint="Next 30 days"
        />
        <StatCard
          label="Monthly earnings"
          value={overview ? `₹${overview.monthlyEarnings}` : "--"}
          hint="Mock payouts"
        />
      </div>

      <div className="tab-row">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={tab === activeTab ? "primary" : "ghost"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Listings" && (
        <div className="grid">
          {listings.map((listing) => (
            <article className="card" key={listing.id}>
              <img src={listing.images[0]} alt={listing.name} />
              <div className="card-body">
                <div>
                  <h3>{listing.name}</h3>
                  <p>
                    {listing.type} · {listing.location.city}
                  </p>
                </div>
                <p className="price">₹{listing.pricePerNight} / night</p>
                <div className="meta">
                  <span>{listing.status}</span>
                  <span>{listing.bookingsThisMonth} bookings</span>
                </div>
                <div className="button-row">
                  <button type="button" className="ghost" onClick={() => openEdit(listing)}>
                    Edit
                  </button>
                  <button type="button" className="ghost">Block dates</button>
                  <button type="button" className="ghost" onClick={() => openDelete(listing)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === "Bookings" && (
        <div className="panel-list">
          {bookings.map((booking) => (
            <div className="panel-row" key={booking.id}>
              <div>
                <p>{booking.guestName}</p>
                <span>
                  {booking.propertyName} · {booking.checkInDate} → {booking.checkOutDate}
                </span>
              </div>
              <div className="status-pill">{booking.status}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Earnings" && (
        <div className="panel">
          <h3>Earnings summary</h3>
          <div className="panel-row">
            <div>
              <p>Gross earnings</p>
              <span>Last 30 days</span>
            </div>
            <strong>₹{overview ? overview.monthlyEarnings : "--"}</strong>
          </div>
          <div className="panel-row">
            <div>
              <p>Platform fees</p>
              <span>Estimated</span>
            </div>
            <strong>₹{overview ? overview.platformFees : "--"}</strong>
          </div>
          <div className="panel-row">
            <div>
              <p>Net payout</p>
              <span>Next payout date: 2026-02-12</span>
            </div>
            <strong>₹{overview ? overview.netPayout : "--"}</strong>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h3>{editing ? "Edit listing" : "Add new listing"}</h3>
              <button type="button" className="ghost" onClick={closeModal}>Close</button>
            </div>
            <form className="modal-body" onSubmit={handleSave}>
              <label>
                Property name
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Property type
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
                Price per night
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
              <div className="button-row">
                <button type="button" className="ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary">Save</button>
              </div>
              <p className="small">Changes are stored locally only for this session.</p>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-backdrop" role="presentation" onClick={closeDelete}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h3>Delete listing</h3>
              <button type="button" className="ghost" onClick={closeDelete}>Close</button>
            </div>
            <div className="modal-body">
              <p>
                You are about to delete {deleteModal.name}. This is a dummy action
                and only updates local state.
              </p>
              <div className="button-row">
                <button type="button" className="ghost" onClick={closeDelete}>Cancel</button>
                <button type="button" className="primary" onClick={confirmDelete}>
                  Confirm delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
