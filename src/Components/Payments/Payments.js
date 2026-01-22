// components/Payments/Payments.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FiEye, FiRefreshCw, FiSearch } from "react-icons/fi";
import axios from "axios";
import "./Payments.css";
import { baseurl } from "../../Api/Baseurl";
import Navbar from "../../Shared/Navbar/Navbar";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(`${baseurl}/api/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setPayments(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = payments.length;
    const completed = payments.filter(
      p => p.checkout_info.payment_status === "completed"
    ).length;
    const pending = payments.filter(
      p => p.checkout_info.payment_status === "pending"
    ).length;
    const totalAmount = payments.reduce((sum, payment) => {
      const paymentAmount = payment.payments.reduce(
        (paymentSum, p) => paymentSum + parseFloat(p.amount || 0),
        0
      );
      return sum + paymentAmount;
    }, 0);

    setStats({ total, completed, pending, totalAmount });
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = async (checkoutId, status) => {
    try {
      const token = localStorage.getItem("admin_token");
      await axios.put(
        `${baseurl}/api/payments/${checkoutId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state
      setPayments(prev =>
        prev.map(payment =>
          payment.checkout_info.checkout_id === checkoutId
            ? {
                ...payment,
                checkout_info: {
                  ...payment.checkout_info,
                  payment_status: status,
                },
              }
            : payment
        )
      );
      
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge bg="success">Completed</Badge>;
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "failed":
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredPayments = payments.filter((payment) => {
    const checkout = payment.checkout_info;
    
    // Filter by status
    if (filterStatus !== "all" && checkout.payment_status !== filterStatus) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        checkout.first_name?.toLowerCase().includes(searchLower) ||
        checkout.last_name?.toLowerCase().includes(searchLower) ||
        checkout.email?.toLowerCase().includes(searchLower) ||
        checkout.phone?.includes(searchTerm) ||
        checkout.tour_code?.toLowerCase().includes(searchLower) ||
        checkout.tour_title?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const PaymentsContent = () => {
    if (loading) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading payments...</p>
          </div>
        </Container>
      );
    }

    return (
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-4">Payment Management</h2>
            
            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
            
            {/* Stats Cards */}
            <Row className="mb-4">
              <Col md={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <Card.Title>Total Payments</Card.Title>
                    <h3>{stats.total}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <Card.Title>Completed</Card.Title>
                    <h3 className="text-success">{stats.completed}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <Card.Title>Pending</Card.Title>
                    <h3 className="text-warning">{stats.pending}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="stat-card">
                  <Card.Body>
                    <Card.Title>Total Amount</Card.Title>
                    <h3 className="text-primary">{formatCurrency(stats.totalAmount)}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Filters and Search */}
            <Card className="mb-4">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Filter by Status</Form.Label>
                      <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Search</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FiSearch />
                        </InputGroup.Text>
                        <FormControl
                          placeholder="Search by name, email, phone, tour code..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="mt-4">
                    <Button
                      variant="outline-primary"
                      onClick={fetchPayments}
                      className="w-100"
                    >
                      <FiRefreshCw /> Refresh
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* Payments Table */}
            <Card>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Tour</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            No payments found
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((payment) => {
                          const checkout = payment.checkout_info;
                          const totalAmount = payment.payments.reduce(
                            (sum, p) => sum + parseFloat(p.amount || 0),
                            0
                          );
                          
                          return (
                            <tr key={checkout.checkout_id}>
                              <td>#{checkout.checkout_id}</td>
                              <td>
                                <div>
                                  <strong>{checkout.first_name} {checkout.last_name}</strong>
                                  <div className="small text-muted">
                                    {checkout.email}
                                  </div>
                                  <div className="small">{checkout.phone}</div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div>{checkout.tour_code}</div>
                                  <div className="small text-muted">
                                    {checkout.tour_title}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{formatCurrency(totalAmount)}</strong>
                                  <div className="small text-muted">
                                    Total: {formatCurrency(checkout.total_tour_cost)}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  {getStatusBadge(checkout.payment_status)}
                                  <Form.Select
                                    size="sm"
                                    style={{ width: "120px" }}
                                    value={checkout.payment_status}
                                    onChange={(e) =>
                                      handleStatusUpdate(
                                        checkout.checkout_id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                  </Form.Select>
                                </div>
                              </td>
                              <td>{formatDate(checkout.created_at)}</td>
                              <td>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleViewDetails(payment)}
                                >
                                  <FiEye /> View
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Details Modal */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Payment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPayment && (
              <>
                {/* Checkout Information */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5>Booking Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Booking ID:</strong> #{selectedPayment.checkout_info.checkout_id}</p>
                        <p><strong>Tour Code:</strong> {selectedPayment.checkout_info.tour_code}</p>
                        <p><strong>Tour Title:</strong> {selectedPayment.checkout_info.tour_title}</p>
                        <p><strong>Duration:</strong> {selectedPayment.checkout_info.tour_duration}</p>
                        <p><strong>Locations:</strong> {selectedPayment.checkout_info.tour_locations}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Total Cost:</strong> {formatCurrency(selectedPayment.checkout_info.total_tour_cost)}</p>
                        <p><strong>Advance Amount:</strong> {formatCurrency(selectedPayment.checkout_info.advance_amount)}</p>
                        <p><strong>Balance Due:</strong> {formatCurrency(selectedPayment.checkout_info.balance_due)}</p>
                        <p><strong>Payment Method:</strong> {selectedPayment.checkout_info.payment_method}</p>
                        <p><strong>Source Page:</strong> {selectedPayment.checkout_info.source_page}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Customer Information */}
                <Card className="mb-4">
                  <Card.Header>
                    <h5>Customer Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Name:</strong> {selectedPayment.checkout_info.first_name} {selectedPayment.checkout_info.last_name}</p>
                        <p><strong>Email:</strong> {selectedPayment.checkout_info.email}</p>
                        <p><strong>Phone:</strong> {selectedPayment.checkout_info.phone}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Address:</strong></p>
                        <p>
                          {selectedPayment.checkout_info.address}<br />
                          {selectedPayment.checkout_info.city}, {selectedPayment.checkout_info.state}<br />
                          {selectedPayment.checkout_info.pincode}, {selectedPayment.checkout_info.country}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Payment Transactions */}
                <Card>
                  <Card.Header>
                    <h5>Payment Transactions</h5>
                  </Card.Header>
                  <Card.Body>
                    {selectedPayment.payments.length === 0 ? (
                      <p className="text-muted">No payment transactions found</p>
                    ) : (
                      <Table striped bordered size="sm">
                        <thead>
                          <tr>
                            <th>Payment ID</th>
                            <th>Amount</th>
                            <th>Gateway</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPayment.payments.map((payment) => (
                            <tr key={payment.payment_id}>
                              <td>#{payment.payment_id}</td>
                              <td>{formatCurrency(payment.amount)}</td>
                              <td>{payment.payment_gateway}</td>
                              <td>
                                <code>{payment.gateway_txn_id || "N/A"}</code>
                              </td>
                              <td>{formatDate(payment.payment_date)}</td>
                              <td>{getStatusBadge(payment.status)}</td>
                              <td>{payment.payment_type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };

  return (
    <Navbar>
      <PaymentsContent />
    </Navbar>
  );
};

export default Payments;