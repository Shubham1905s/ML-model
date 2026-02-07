import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

const steps = [
  "Upload photos",
  "Auto-fill details",
  "Confirm & publish"
];

const defaultForm = {
  title: "",
  description: "",
  propertyType: "Apartment",
  rooms: 1,
  washrooms: 1,
  maxGuests: 2,
  amenities: [],
  equipment: [],
  pricePerNight: "",
  city: "",
  state: "",
  country: ""
};

export default function BecomeHost() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [published, setPublished] = useState(false);
  const scanState = loading
    ? "running"
    : scanResult
      ? "done"
      : photos.length > 0
        ? "ready"
        : "idle";

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setPhotos(files);
    setActiveStep(1);
  };

  const runScan = async () => {
    setLoading(true);
    setPublished(false);
    const response = await api.post("/host/ai-scan", {
      count: photos.length
    });
    setScanResult(response.data);
    setForm((prev) => ({
      ...prev,
      title: response.data.summary.title,
      description: response.data.summary.description,
      propertyType: response.data.summary.propertyType,
      rooms: response.data.summary.rooms,
      washrooms: response.data.summary.washrooms,
      maxGuests: response.data.summary.maxGuests,
      amenities: response.data.amenities,
      equipment: response.data.detectedEquipment
    }));
    setLoading(false);
    setActiveStep(2);
  };

  const toggleListValue = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value]
      };
    });
  };

  const handlePublish = async (event) => {
    event.preventDefault();
    if (publishing) return;
    setPublishing(true);
    try {
      await api.post("/host/listings", {
        ...form
      });
      setPublished(true);
      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      setPublished(false);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="section">
      <div className="page-head">
        <div>
          <p className="eyebrow">Become a host</p>
          <h2>Upload photos and let the model auto-fill your listing</h2>
          <p className="subtitle">
            This is a prototype: the AI scan is simulated and fills details for
            you. You only need to provide price and location, then confirm.
          </p>
        </div>
      </div>

      <div className="stepper">
        {steps.map((step, index) => (
          <div key={step} className={index <= activeStep ? "step active" : "step"}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>

      <section className="panel wizard">
        <div>
          <h3>1. Upload property photos</h3>
          <p className="small">
            Upload 6-12 photos of rooms, washrooms, and amenities. The AI will
            extract details from these images.
          </p>
          <div className="upload-box">
            <div>
              <p className="upload-title">Drop photos here or browse</p>
              <p className="small">
                Best results with wide-angle, well-lit shots. JPG/PNG.
              </p>
            </div>
            <label className="upload-action">
              <span>Choose files</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
          <div className="upload-meta">
            <span className="meta-pill">{photos.length} selected</span>
            <span className="meta-pill">AI ready: {photos.length > 0 ? "Yes" : "No"}</span>
          </div>
          {photos.length > 0 && (
            <div className="photo-grid">
              {photos.map((photo) => (
                <div key={photo.name} className="photo-card">
                  <div className="photo-placeholder">{photo.name}</div>
                  <p className="photo-size">{Math.round(photo.size / 1024)} kb</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="scan-panel">
          <div className="scan-head">
            <div>
              <p className="eyebrow">AI Studio</p>
              <h3>2. Auto-fill with AI</h3>
            </div>
            <span className={`ai-status ${scanState}`}>{scanState}</span>
          </div>
          <p className="small">
            We scan the photos to detect rooms, amenities, and description. This is
            a simulated flow to show how the model experience will feel.
          </p>
          <div className="scan-steps">
            <div className={`scan-step ${scanState}`}>
              <span>01</span>
              <p>Quality check & lighting balance</p>
            </div>
            <div className={`scan-step ${scanState}`}>
              <span>02</span>
              <p>Room layout & count detection</p>
            </div>
            <div className={`scan-step ${scanState}`}>
              <span>03</span>
              <p>Amenities & equipment extraction</p>
            </div>
          </div>
          <button
            type="button"
            className="primary"
            disabled={photos.length === 0 || loading}
            onClick={runScan}
          >
            {loading ? "Scanning..." : "Run AI scan"}
          </button>
          {scanResult && (
            <div className="scan-result">
              <p><strong>Confidence:</strong> {Math.round(scanResult.confidence * 100)}%</p>
              <p><strong>Detected:</strong> {scanResult.amenities.join(", ")}</p>
              <div className="ai-summary">
                <div>
                  <p className="small">Suggested title</p>
                  <p>{scanResult.summary.title}</p>
                </div>
                <div>
                  <p className="small">Property type</p>
                  <p>{scanResult.summary.propertyType}</p>
                </div>
              </div>
              {scanResult.conflicts.length > 0 && (
                <div className="conflict-box">
                  <h4>Conflicts to resolve</h4>
                  <ul>
                    {scanResult.conflicts.map((conflict) => (
                      <li key={conflict.field}>
                        <strong>{conflict.field}:</strong> {conflict.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="panel form-panel">
        <h3>3. Confirm details & publish</h3>
        <form className="wizard-form" onSubmit={handlePublish}>
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <div className="two-col">
            <label>
              Rooms
              <input
                type="number"
                value={form.rooms}
                onChange={(event) => setForm({ ...form, rooms: Number(event.target.value) })}
              />
            </label>
            <label>
              Washrooms
              <input
                type="number"
                value={form.washrooms}
                onChange={(event) => setForm({ ...form, washrooms: Number(event.target.value) })}
              />
            </label>
          </div>
          <div className="two-col">
            <label>
              Max guests
              <input
                type="number"
                value={form.maxGuests}
                onChange={(event) => setForm({ ...form, maxGuests: Number(event.target.value) })}
              />
            </label>
            <label>
              Property type
              <select
                value={form.propertyType}
                onChange={(event) => setForm({ ...form, propertyType: event.target.value })}
              >
                <option value="Hotel">Hotel</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Hostel">Hostel</option>
              </select>
            </label>
          </div>
          <div>
            <p className="small">Amenities</p>
            <div className="chip-row">
              {form.amenities.map((amenity) => (
                <button
                  type="button"
                  key={amenity}
                  className="chip active"
                  onClick={() => toggleListValue("amenities", amenity)}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="small">Detected equipment</p>
            <div className="chip-row">
              {form.equipment.map((item) => (
                <button
                  type="button"
                  key={item}
                  className="chip active"
                  onClick={() => toggleListValue("equipment", item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="two-col">
            <label>
              Price per night (required)
              <input
                type="number"
                required
                value={form.pricePerNight}
                onChange={(event) => setForm({ ...form, pricePerNight: event.target.value })}
              />
            </label>
            <label>
              City (required)
              <input
                required
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
              />
            </label>
          </div>
          <div className="two-col">
            <label>
              State
              <input
                value={form.state}
                onChange={(event) => setForm({ ...form, state: event.target.value })}
              />
            </label>
            <label>
              Country
              <input
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
              />
            </label>
          </div>
          <div className="button-row">
            <button type="submit" className="primary" disabled={publishing}>
              {publishing ? "Publishing..." : "Publish listing"}
            </button>
          </div>
          {published && (
            <p className="success">Listing submitted! We will verify and publish it soon.</p>
          )}
        </form>
      </section>
    </main>
  );
}
