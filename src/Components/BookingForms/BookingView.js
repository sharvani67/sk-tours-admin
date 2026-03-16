import React, { useState, useEffect } from "react";
import Navbar from "../../Shared/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { baseurl } from "../../Api/Baseurl";
import dayjs from "dayjs"; // Install via npm install dayjs

const BookingView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    booking_id: "",
    bungalow_code: "",
    city: "",
    contact_person: "",
    booking_phone: "",
    booking_email: "",
    address: "",
    pin_code: "",
    state: "",
    country: "",
    no_of_people: "",
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
          contact_person: result.contact_person || "",
          booking_phone: result.booking_phone || "",
          booking_email: result.booking_email || "",
          address: result.address || "",
          pin_code: result.pin_code || "",
          state: result.state || "",
          country: result.country || "",
          no_of_people: result.no_of_people || "",
          created_at: result.created_at
            ? dayjs(result.created_at).format("DD-MM-YYYY HH:mm")
            : "",
          guests: result.guests || []
        });
      } else {
        setError(result.message || "Booking not found");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  return (
    <Navbar>
      <div className="container-fluid ven-container">
        <div className="ven-back-btn mb-3 d-flex justify-content-between">
          <button
            className="btn btn-info ven-btn-back"
            onClick={() => navigate("/Bookingtable")}
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
          <h3 className="mb-4">Booking Details</h3>

          {loading ? (
            <div>Loading booking...</div>
          ) : (
            <>
              <div className="row mb-3">
                <div className="col-md-3 mb-2">
                  <label>Booking ID</label>
                  <input type="text" className="form-control" value={formData.booking_id} readOnly />
                </div>
                <div className="col-md-3 mb-2">
                  <label>Bungalow Code</label>
                  <input type="text" className="form-control" value={formData.bungalow_code} readOnly />
                </div>
                <div className="col-md-3 mb-2">
                  <label>City</label>
                  <input type="text" className="form-control" value={formData.city} readOnly />
                </div>
                <div className="col-md-3 mb-2">
                  <label>Contact Person</label>
                  <input type="text" className="form-control" value={formData.contact_person} readOnly />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-3 mb-2">
                  <label>Phone</label>
                  <input type="text" className="form-control" value={formData.booking_phone} readOnly />
                </div>
                <div className="col-md-3 mb-2">
                  <label>Email</label>
                  <input type="text" className="form-control" value={formData.booking_email} readOnly />
                </div>
                <div className="col-md-6 mb-2">
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
                  <label>No. of People</label>
                  <input type="text" className="form-control" value={formData.no_of_people} readOnly />
                </div>
              </div>



              {/* Guest Details */}
              <h4 className="mt-4 mb-2">Number of People's</h4>
              {formData.guests.length > 0 ? (
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
                    {formData.guests.map((guest) => (
                      <tr key={guest.guest_id}>
                      
                        <td>{guest.name}</td>
                        <td>{guest.age}</td>
                        <td>{guest.phone}</td>
                        <td>{guest.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No guests found</p>
              )}
            </>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default BookingView;