import React, { useState, useEffect } from "react";
import Navbar from "../../Shared/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { baseurl } from "../../Api/Baseurl";
import dayjs from "dayjs";

const WeekendView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    booking_id: "",
    bungalow_code: "",
    city: "",
    city_location: "",
    contact_person: "",
    booking_phone: "",
    booking_email: "",
    address: "",
    pin_code: "",
    state: "",
    country: "",
    no_of_adults: "",
    no_of_child: "",
    no_of_rooms: "",
    type: "",
    created_at: "",
    guests: []
  });

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${baseurl}/api/passport/bookings/${id}`);
      const result = await response.json();

      if (response.ok) {
        setFormData({
          booking_id: result.booking_id || "",
          bungalow_code: result.bungalow_code || "",
          city: result.city || "",
          city_location: result.city_location || "",
          contact_person: result.contact_person || "",
          booking_phone: result.booking_phone || "",
          booking_email: result.booking_email || "",
          address: result.address || "",
          pin_code: result.pin_code || "",
          state: result.state || "",
          country: result.country || "",
          no_of_adults: result.no_of_adults || "0",
          no_of_child: result.no_of_child || "0",
          no_of_rooms: result.no_of_rooms || "",
          type: result.type || "weekend",
          created_at: result.created_at
            ? dayjs(result.created_at).format("DD-MM-YYYY HH:mm")
            : "",
          guests: result.guests || []
        });
      } else {
        setError(result.message || "Weekend booking not found");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching weekend booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  // Separate adults and children using guest_type
  const adults = formData.guests.filter(guest => guest.guest_type === 'adult');
  const children = formData.guests.filter(guest => guest.guest_type === 'child');

  return (
    <Navbar>
      <div className="container-fluid ven-container">
        <div className="ven-back-btn mb-3 d-flex justify-content-between">
          <button
            className="btn btn-info ven-btn-back"
            onClick={() => navigate("/weekendtable")}
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        <div className="card ven-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Weekend Gateway Booking Details</h3>
            <span className="badge bg-info text-white p-2">
              {formData.type?.toUpperCase() || "WEEKEND"}
            </span>
          </div>

          {loading ? (
            <div>Loading booking...</div>
          ) : (
            <>
              <div className="row mb-3">
                <div className="col-md-4 mb-2">
                  <label>Booking ID</label>
                  <input type="text" className="form-control" value={formData.booking_id} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Property Name</label>
                  <input type="text" className="form-control" value={formData.bungalow_code} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Booking Date</label>
                  <input type="text" className="form-control" value={formData.created_at} readOnly />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4 mb-2">
                  <label>City</label>
                  <input type="text" className="form-control" value={formData.city} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>City Location</label>
                  <input type="text" className="form-control" value={formData.city_location} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Address</label>
                  <input type="text" className="form-control" value={formData.address} readOnly />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-3 mb-2">
                  <label>Pin Code</label>
                  <input type="text" className="form-control" value={formData.pin_code} readOnly />
                </div>
                <div className="col-md-3 mb-2">
                  <label>State</label>
                  <input type="text" className="form-control" value={formData.state} readOnly />
                </div>
                <div className="col-md-3 mb-2">
                  <label>Country</label>
                  <input type="text" className="form-control" value={formData.country} readOnly />
                </div>
                <div className="col-md-3 mb-2">
                  <label>No of Rooms</label>
                  <input type="text" className="form-control" value={formData.no_of_rooms} readOnly />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4 mb-2">
                  <label>Contact Person</label>
                  <input type="text" className="form-control" value={formData.contact_person} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Phone</label>
                  <input type="text" className="form-control" value={formData.booking_phone} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Email</label>
                  <input type="text" className="form-control" value={formData.booking_email} readOnly />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4 mb-2">
                  <label>Total Adults</label>
                  <input type="text" className="form-control" value={formData.no_of_adults} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Total Children</label>
                  <input type="text" className="form-control" value={formData.no_of_child} readOnly />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Total Guests</label>
                  <input type="text" className="form-control" value={formData.guests.length} readOnly />
                </div>
              </div>

              {/* Adults Details */}
              {adults.length > 0 && (
                <>
                  <h4 className="mt-4 mb-2">Adults Details ({adults.length})</h4>
                  <table className="table table-bordered mb-4">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adults.map((guest) => (
                        <tr key={guest.guest_id}>
                          <td>{guest.name}</td>
                          <td>{guest.age}</td>
                          <td>{guest.phone}</td>
                          <td>{guest.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Children Details */}
              {children.length > 0 && (
                <>
                  <h4 className="mt-4 mb-2">Children Details ({children.length})</h4>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {children.map((guest) => (
                        <tr key={guest.guest_id}>
                          <td>{guest.name}</td>
                          <td>{guest.age}</td>
                          <td>{guest.phone}</td>
                          <td>{guest.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {formData.guests.length === 0 && (
                <p className="mt-3">No guests found</p>
              )}
            </>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default WeekendView;