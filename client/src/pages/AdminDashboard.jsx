import { useEffect, useState } from "react";
import {
  getAdminApprovals,
  getAdminOverview,
  getAdminUsers
} from "../services/dashboard.js";
import StatCard from "../components/StatCard.jsx";

const tabs = ["Approvals", "Users", "Reports"];

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Approvals");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [overviewData, approvalsData, usersData] = await Promise.all([
        getAdminOverview(),
        getAdminApprovals(),
        getAdminUsers()
      ]);

      setOverview(overviewData);
      setApprovals(approvalsData);
      setUsers(usersData);
    };

    loadData().catch(() => {
      setOverview(null);
    });
  }, []);

  const openModal = (action, payload) => {
    setModal({ action, payload });
  };

  const closeModal = () => setModal(null);

  const confirmAction = () => {
    if (!modal) return;
    if (modal.action === "approve") {
      setApprovals((items) => items.filter((item) => item.id !== modal.payload.id));
    }
    if (modal.action === "reject") {
      setApprovals((items) => items.filter((item) => item.id !== modal.payload.id));
    }
    if (modal.action === "suspend") {
      setUsers((items) => items.map((item) =>
        item.id === modal.payload.id ? { ...item, status: "Suspended" } : item
      ));
    }
    closeModal();
  };

  return (
    <main className="section">
      <div className="page-head">
        <div>
          <p className="eyebrow">Admin control</p>
          <h2>Moderate the platform and track growth</h2>
        </div>
        <button type="button" className="ghost">Export reports</button>
      </div>

      <div className="dashboard">
        <StatCard
          label="Hosts pending"
          value={overview ? overview.pendingHosts : "--"}
          hint="Need approval"
        />
        <StatCard
          label="Listings flagged"
          value={overview ? overview.flaggedListings : "--"}
          hint="Need review"
        />
        <StatCard
          label="Monthly revenue"
          value={overview ? `?${overview.monthlyRevenue}` : "--"}
          hint="Platform take"
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

      {activeTab === "Approvals" && (
        <div className="panel-list">
          {approvals.map((item) => (
            <div className="panel-row" key={item.id}>
              <div>
                <p>{item.name}</p>
                <span>{item.city} ? {item.type}</span>
              </div>
              <div className="button-row">
                <button type="button" className="primary" onClick={() => openModal("approve", item)}>
                  Approve
                </button>
                <button type="button" className="ghost" onClick={() => openModal("reject", item)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Users" && (
        <div className="panel-list">
          {users.map((user) => (
            <div className="panel-row" key={user.id}>
              <div>
                <p>{user.name}</p>
                <span>{user.role} ? {user.email}</span>
              </div>
              <div className="button-row">
                <button type="button" className="ghost" onClick={() => openModal("suspend", user)}>
                  Suspend
                </button>
                <button type="button" className="ghost">Reset password</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Reports" && (
        <div className="panel">
          <h3>Reports summary</h3>
          <div className="panel-row">
            <div>
              <p>Disputes resolved</p>
              <span>Last 30 days</span>
            </div>
            <strong>{overview ? overview.disputesResolved : "--"}</strong>
          </div>
          <div className="panel-row">
            <div>
              <p>Refunds issued</p>
              <span>Mock data</span>
            </div>
            <strong>?{overview ? overview.refundsIssued : "--"}</strong>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h3>Confirm action</h3>
              <button type="button" className="ghost" onClick={closeModal}>Close</button>
            </div>
            <div className="modal-body">
              <p>
                You are about to {modal.action} {modal.payload.name}. This is a
                dummy action and only updates local state.
              </p>
              <div className="button-row">
                <button type="button" className="ghost" onClick={closeModal}>Cancel</button>
                <button type="button" className="primary" onClick={confirmAction}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
