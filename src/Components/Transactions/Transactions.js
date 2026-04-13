// components/Transactions/Transactions.js
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
  Tab,
  Tabs,
} from "react-bootstrap";
import { 
  FiEye, FiRefreshCw, FiSearch, FiDollarSign, 
  FiTrendingUp, FiCreditCard, FiHome, FiMapPin, 
  FiUsers, FiCalendar, FiClock, FiSun, FiMoon, FiCoffee 
} from "react-icons/fi";
import { 
  FaPlane, FaHotel, FaGlobe, FaHome, FaTree, 
  FaBuilding, FaChalkboardTeacher, FaBriefcase, FaUmbrellaBeach,
  FaSpa, FaMountain, FaCampground, FaSwimmingPool, FaHome as FaHouse,
  FaCalendarAlt
} from "react-icons/fa";
import { 
  GiFamilyHouse, GiBeachBag, GiHouse, GiBungalow, 
  GiTreehouse, GiIsland, GiPalmTree, GiSummer, GiVacation,
  GiCampingTent, GiWoodCabin, GiHomeGarage
} from "react-icons/gi";
import { MdWeekend, MdHolidayVillage, MdLocationCity } from "react-icons/md";
import axios from "axios";
import "./Transactions.css";
import { baseurl } from "../../Api/Baseurl";
import Navbar from "../../Shared/Navbar/Navbar";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("domestic");
  const [stats, setStats] = useState({
    domestic: 0,
    international: 0,
    onlineFlights: 0,
    offlineFlights: 0,
    offlineHotel: 0,
    bungalow: 0,
    oneDayPicnic: 0,
    weekendGateway: 0,
    exhibition: 0,
    mice: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [transactions]);

  const fetchTransactions = async () => {
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
        setTransactions(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  // Determine transaction type based on source_page and tour_code
  const getTransactionType = (transaction) => {
    const checkout = transaction.checkout_info;
    const sourcePage = checkout.source_page || "";
    const tourCode = checkout.tour_code || "";
    const tourTitle = checkout.tour_title || "";
    
    // Check for Bungalow bookings
    if (sourcePage === "bungalow-booking" || checkout.bungalow_code) {
      return "bungalow";
    }
    
    // Check for One Day Picnic bookings
    if (sourcePage === "oneday-picnic-booking" || checkout.picnic_code) {
      return "oneDayPicnic";
    }
    
    // Check for Weekend Gateway bookings
    if (sourcePage === "weekend-gateway-booking" || checkout.weekend_code || checkout.property_name) {
      return "weekendGateway";
    }
    
    // Check for Exhibition bookings
    if (sourcePage === "exhibition-packages" || (tourCode && tourCode.startsWith("EXH"))) {
      return "exhibition";
    }
    
    // Check for MICE bookings
    if (sourcePage === "mice-packages" || (tourCode && tourCode.startsWith("MICE"))) {
      return "mice";
    }
    
    // Check for Offline Flights
    if (sourcePage === "offline-flights" || (tourCode && tourCode.startsWith("FLT"))) {
      return "offlineFlights";
    }
    
    // Check for Offline Hotels
    if (sourcePage === "offline-hotels" || (tourCode && tourCode.startsWith("HTL"))) {
      return "offlineHotel";
    }
    
    // Check for Online Flights (no tour_code or empty tour_code but not other types)
    if ((!tourCode || tourCode === "") && sourcePage !== "offline-flights" && sourcePage !== "offline-hotels") {
      return "onlineFlights";
    }
    
    // Check for Domestic Tours
    if (tourCode.startsWith("DOM") || tourTitle.toLowerCase().includes("domestic")) {
      return "domestic";
    }
    
    // Check for International Tours
    if (tourCode.startsWith("INT") || tourTitle.toLowerCase().includes("international")) {
      return "international";
    }
    
    return "domestic";
  };

  // Get display name for transaction type
  const getTransactionTypeDisplay = (type) => {
    const types = {
      domestic: "Domestic Tour",
      international: "International Tour",
      onlineFlights: "Online Flight",
      offlineFlights: "Offline Flight",
      offlineHotel: "Offline Hotel",
      bungalow: "Bungalow Booking",
      oneDayPicnic: "One Day Picnic",
      weekendGateway: "Weekend Gateway",
      exhibition: "Exhibition",
      mice: "MICE"
    };
    return types[type] || "Unknown";
  };

  // Get icon for transaction type
  const getTransactionIcon = (type) => {
    const icons = {
      domestic: <FaHome />,
      international: <FaGlobe />,
      onlineFlights: <FaPlane />,
      offlineFlights: <FaPlane />,
      offlineHotel: <FaHotel />,
      bungalow: <GiFamilyHouse />,
      oneDayPicnic: <GiBeachBag />,
      weekendGateway: <MdWeekend />,  // Using MdWeekend from react-icons/md
      exhibition: <FaChalkboardTeacher />,
      mice: <FaBriefcase />
    };
    return icons[type] || <FiHome />;
  };

  const calculateStats = () => {
    const domestic = transactions.filter(t => getTransactionType(t) === "domestic").length;
    const international = transactions.filter(t => getTransactionType(t) === "international").length;
    const onlineFlights = transactions.filter(t => getTransactionType(t) === "onlineFlights").length;
    const offlineFlights = transactions.filter(t => getTransactionType(t) === "offlineFlights").length;
    const offlineHotel = transactions.filter(t => getTransactionType(t) === "offlineHotel").length;
    const bungalow = transactions.filter(t => getTransactionType(t) === "bungalow").length;
    const oneDayPicnic = transactions.filter(t => getTransactionType(t) === "oneDayPicnic").length;
    const weekendGateway = transactions.filter(t => getTransactionType(t) === "weekendGateway").length;
    const exhibition = transactions.filter(t => getTransactionType(t) === "exhibition").length;
    const mice = transactions.filter(t => getTransactionType(t) === "mice").length;
    
    const totalAmount = transactions.reduce((sum, transaction) => {
      const paymentAmount = transaction.payments.reduce(
        (paymentSum, p) => paymentSum + parseFloat(p.amount || 0),
        0
      );
      return sum + paymentAmount;
    }, 0);

    setStats({ 
      domestic, international, onlineFlights, offlineFlights, offlineHotel,
      bungalow, oneDayPicnic, weekendGateway, exhibition, mice, totalAmount 
    });
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    if (!status || status === "" || status?.toLowerCase() === "pending") {
      return <Badge bg="danger">Failed</Badge>;
    }
    
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return <Badge bg="success">Success</Badge>;
      case "failed":
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="danger">Failed</Badge>;
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

  // Get title for display based on transaction type
  const getDisplayTitle = (checkout, type) => {
    switch(type) {
      case 'bungalow':
        return checkout.bungalow_title || `Bungalow ${checkout.bungalow_code || checkout.tour_id}`;
      case 'oneDayPicnic':
        return checkout.picnic_title || `One Day Picnic at ${checkout.city || 'Unknown'}`;
      case 'weekendGateway':
        return checkout.property_name || checkout.weekend_title || `Weekend Gateway at ${checkout.city || 'Unknown'}`;
      case 'exhibition':
        return checkout.tour_title || `Exhibition at ${checkout.city || 'Unknown'}`;
      case 'mice':
        return checkout.tour_title || `MICE Event at ${checkout.city || 'Unknown'}`;
      default:
        return checkout.tour_title || "Flight Booking";
    }
  };

  // Get code for display based on transaction type
  const getDisplayCode = (checkout, type) => {
    switch(type) {
      case 'bungalow':
        return checkout.bungalow_code || checkout.tour_code;
      case 'oneDayPicnic':
        return checkout.picnic_code || checkout.tour_code;
      case 'weekendGateway':
        return checkout.weekend_code || checkout.tour_code;
      default:
        return checkout.tour_code;
    }
  };

  const TransactionTable = ({ transactions, type }) => {
    const searchedTransactions = searchTerm 
      ? transactions.filter(transaction => {
          const checkout = transaction.checkout_info;
          const searchLower = searchTerm.toLowerCase();
          return (
            checkout.first_name?.toLowerCase().includes(searchLower) ||
            checkout.last_name?.toLowerCase().includes(searchLower) ||
            checkout.email?.toLowerCase().includes(searchLower) ||
            checkout.phone?.includes(searchTerm) ||
            getDisplayCode(checkout, type)?.toLowerCase().includes(searchLower) ||
            getDisplayTitle(checkout, type)?.toLowerCase().includes(searchLower) ||
            checkout.checkout_id?.toString().includes(searchTerm)
          );
        })
      : transactions;

    return (
      <div className="table-responsive">
        <Table hover striped>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Booking Info</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchedTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No transactions found
                </td>
              </tr>
            ) : (
              searchedTransactions.map((transaction) => {
                const checkout = transaction.checkout_info;
                const transactionType = getTransactionType(transaction);
                const totalAmount = transaction.payments.reduce(
                  (sum, p) => sum + parseFloat(p.amount || 0),
                  0
                );
                const paymentStatus = transaction.payments[0]?.status || checkout.payment_status;
                const displayTitle = getDisplayTitle(checkout, transactionType);
                const displayCode = getDisplayCode(checkout, transactionType);
                
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
                        {displayCode ? (
                          <code className="tour-code">{displayCode}</code>
                        ) : (
                          <Badge bg="info" className="me-1">{getTransactionTypeDisplay(transactionType)}</Badge>
                        )}
                        <div className="small text-muted mt-1">
                          {displayTitle}
                        </div>
                        {checkout.tour_duration && (
                          <div className="small text-muted">
                            <FiClock className="me-1" /> {checkout.tour_duration}
                          </div>
                        )}
                        {/* Show additional info based on type */}
                        {transactionType === 'weekendGateway' && checkout.no_of_rooms && (
                          <div className="small text-muted">
                            <FaBuilding className="me-1" /> {checkout.no_of_rooms} room(s)
                          </div>
                        )}
                        {(transactionType === 'bungalow' || transactionType === 'oneDayPicnic') && checkout.no_of_people && (
                          <div className="small text-muted">
                            <FiUsers className="me-1" /> {checkout.no_of_people} guests
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{formatCurrency(totalAmount)}</strong>
                        {checkout.total_tour_cost && checkout.total_tour_cost != totalAmount && (
                          <div className="small text-muted">
                            Total: {formatCurrency(checkout.total_tour_cost)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(paymentStatus)}</td>
                    <td>{formatDate(checkout.created_at)}</td>
                    <td>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleViewDetails(transaction)}
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
    );
  };

  const TransactionsContent = () => {
    if (loading) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading transactions...</p>
          </div>
        </Container>
      );
    }

    return (
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="page-header mb-4">
              <h2 className="page-title">
                <FiDollarSign className="me-2" />
                Transaction Management
              </h2>
              <p className="text-muted">Manage and track all payment transactions</p>
            </div>
            
            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}
            
            {/* Stats Cards - Row 1: Tours & Flights */}
            <Row className="mb-4 stats-row">
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'domestic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('domestic')}
                >
                  <Card.Body>
                    <div className="stats-card-icon domestic-icon">
                      <FaHome />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Domestic Tours</h6>
                      <h3 className="stats-card-value">{stats.domestic}</h3>
                      <span className="stats-card-subtitle">Transactions</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'international' ? 'active' : ''}`}
                  onClick={() => setActiveTab('international')}
                >
                  <Card.Body>
                    <div className="stats-card-icon international-icon">
                      <FaGlobe />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">International Tours</h6>
                      <h3 className="stats-card-value">{stats.international}</h3>
                      <span className="stats-card-subtitle">Transactions</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'onlineFlights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('onlineFlights')}
                >
                  <Card.Body>
                    <div className="stats-card-icon online-icon">
                      <FaPlane />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Online Flights</h6>
                      <h3 className="stats-card-value">{stats.onlineFlights}</h3>
                      <span className="stats-card-subtitle">Transactions</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'offlineFlights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('offlineFlights')}
                >
                  <Card.Body>
                    <div className="stats-card-icon offline-icon">
                      <FiTrendingUp />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Offline Flights</h6>
                      <h3 className="stats-card-value">{stats.offlineFlights}</h3>
                      <span className="stats-card-subtitle">Transactions</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Stats Cards - Row 2: Hotels & Properties */}
            <Row className="mb-4 stats-row">
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'offlineHotel' ? 'active' : ''}`}
                  onClick={() => setActiveTab('offlineHotel')}
                >
                  <Card.Body>
                    <div className="stats-card-icon hotel-icon">
                      <FaHotel />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Offline Hotels</h6>
                      <h3 className="stats-card-value">{stats.offlineHotel}</h3>
                      <span className="stats-card-subtitle">Transactions</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'bungalow' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bungalow')}
                >
                  <Card.Body>
                    <div className="stats-card-icon bungalow-icon">
                      <GiFamilyHouse />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Bungalows</h6>
                      <h3 className="stats-card-value">{stats.bungalow}</h3>
                      <span className="stats-card-subtitle">Bookings</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'oneDayPicnic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('oneDayPicnic')}
                >
                  <Card.Body>
                    <div className="stats-card-icon picnic-icon">
                      <GiBeachBag />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">One Day Picnic</h6>
                      <h3 className="stats-card-value">{stats.oneDayPicnic}</h3>
                      <span className="stats-card-subtitle">Bookings</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'weekendGateway' ? 'active' : ''}`}
                  onClick={() => setActiveTab('weekendGateway')}
                >
                  <Card.Body>
                    <div className="stats-card-icon weekend-icon">
                      <MdWeekend /> {/* Using MdWeekend from react-icons/md */}
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Weekend Gateway</h6>
                      <h3 className="stats-card-value">{stats.weekendGateway}</h3>
                      <span className="stats-card-subtitle">Bookings</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Stats Cards - Row 3: Events & Revenue */}
            <Row className="mb-4 stats-row">
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'exhibition' ? 'active' : ''}`}
                  onClick={() => setActiveTab('exhibition')}
                >
                  <Card.Body>
                    <div className="stats-card-icon exhibition-icon">
                      <FaChalkboardTeacher />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Exhibitions</h6>
                      <h3 className="stats-card-value">{stats.exhibition}</h3>
                      <span className="stats-card-subtitle">Events</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={3} md={6} sm={12} className="mb-3">
                <Card 
                  className={`stats-card ${activeTab === 'mice' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mice')}
                >
                  <Card.Body>
                    <div className="stats-card-icon mice-icon">
                      <FaBriefcase />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">MICE</h6>
                      <h3 className="stats-card-value">{stats.mice}</h3>
                      <span className="stats-card-subtitle">Events</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={6} md={12} sm={12} className="mb-3">
                <Card className="stats-card revenue-card">
                  <Card.Body>
                    <div className="stats-card-icon revenue-icon">
                      <FiCreditCard />
                    </div>
                    <div className="stats-card-content">
                      <h6 className="stats-card-title">Total Revenue</h6>
                      <h3 className="stats-card-value revenue-value">{formatCurrency(stats.totalAmount)}</h3>
                      <span className="stats-card-subtitle">Overall Collection</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Search Bar */}
            <Card className="mb-4 search-card">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label className="search-label">
                        <FiSearch className="me-1" /> Search Transactions
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="search-icon">
                          <FiSearch />
                        </InputGroup.Text>
                        <FormControl
                          placeholder="Search by name, email, phone, booking ID, tour code..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="search-input"
                        />
                        {searchTerm && (
                          <Button
                            variant="outline-secondary"
                            onClick={() => setSearchTerm("")}
                            className="clear-btn"
                          >
                            Clear
                          </Button>
                        )}
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mt-md-0 mt-3">
                    <Button
                      variant="primary"
                      onClick={fetchTransactions}
                      className="w-100 refresh-btn"
                    >
                      <FiRefreshCw className="me-2" /> Refresh Data
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* Tabs */}
            <Card className="transactions-card">
              <Card.Body className="p-0">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => {
                    setActiveTab(k);
                    setSearchTerm("");
                  }}
                  className="transaction-tabs"
                  id="transaction-tabs"
                >
                  <Tab
                    eventKey="domestic"
                    title={
                      <span>
                        <FaHome className="me-2" />
                        Domestic Tours
                        <Badge bg="primary" className="ms-2 tab-badge">
                          {stats.domestic}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "domestic")} type="domestic" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="international"
                    title={
                      <span>
                        <FaGlobe className="me-2" />
                        International Tours
                        <Badge bg="info" className="ms-2 tab-badge">
                          {stats.international}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "international")} type="international" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="onlineFlights"
                    title={
                      <span>
                        <FaPlane className="me-2" />
                        Online Flights
                        <Badge bg="success" className="ms-2 tab-badge">
                          {stats.onlineFlights}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "onlineFlights")} type="onlineFlights" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="offlineFlights"
                    title={
                      <span>
                        <FiTrendingUp className="me-2" />
                        Offline Flights
                        <Badge bg="warning" className="ms-2 tab-badge">
                          {stats.offlineFlights}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "offlineFlights")} type="offlineFlights" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="offlineHotel"
                    title={
                      <span>
                        <FaHotel className="me-2" />
                        Offline Hotels
                        <Badge bg="danger" className="ms-2 tab-badge">
                          {stats.offlineHotel}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "offlineHotel")} type="offlineHotel" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="bungalow"
                    title={
                      <span>
                        <GiFamilyHouse className="me-2" />
                        Bungalows
                        <Badge bg="secondary" className="ms-2 tab-badge">
                          {stats.bungalow}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "bungalow")} type="bungalow" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="oneDayPicnic"
                    title={
                      <span>
                        <GiBeachBag className="me-2" />
                        One Day Picnic
                        <Badge bg="info" className="ms-2 tab-badge">
                          {stats.oneDayPicnic}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "oneDayPicnic")} type="oneDayPicnic" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="weekendGateway"
                    title={
                      <span>
                        <MdWeekend className="me-2" /> {/* Using MdWeekend */}
                        Weekend Gateway
                        <Badge bg="success" className="ms-2 tab-badge">
                          {stats.weekendGateway}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "weekendGateway")} type="weekendGateway" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="exhibition"
                    title={
                      <span>
                        <FaChalkboardTeacher className="me-2" />
                        Exhibition
                        <Badge bg="warning" className="ms-2 tab-badge">
                          {stats.exhibition}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "exhibition")} type="exhibition" />
                    </div>
                  </Tab>
                  <Tab
                    eventKey="mice"
                    title={
                      <span>
                        <FaBriefcase className="me-2" />
                        MICE
                        <Badge bg="danger" className="ms-2 tab-badge">
                          {stats.mice}
                        </Badge>
                      </span>
                    }
                  >
                    <div className="tab-content-wrapper">
                      <TransactionTable transactions={transactions.filter(t => getTransactionType(t) === "mice")} type="mice" />
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Details Modal */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
          className="transaction-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTransaction && (
              <>
                {/* Booking Information */}
                <Card className="mb-4 detail-card">
                  <Card.Header>
                    <h5>Booking Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Booking ID:</strong> #{selectedTransaction.checkout_info.checkout_id}</p>
                        <p><strong>Booking Type:</strong> {getTransactionTypeDisplay(getTransactionType(selectedTransaction))}</p>
                        <p><strong>Booking Code:</strong> {getDisplayCode(selectedTransaction.checkout_info, getTransactionType(selectedTransaction)) || "N/A"}</p>
                        <p><strong>Title:</strong> {getDisplayTitle(selectedTransaction.checkout_info, getTransactionType(selectedTransaction))}</p>
                        
                        {/* Type-specific fields */}
                        {getTransactionType(selectedTransaction) === 'weekendGateway' && (
                          <>
                            {selectedTransaction.checkout_info.property_name && (
                              <p><strong>Property Name:</strong> {selectedTransaction.checkout_info.property_name}</p>
                            )}
                            {selectedTransaction.checkout_info.no_of_rooms && (
                              <p><strong>Rooms:</strong> {selectedTransaction.checkout_info.no_of_rooms}</p>
                            )}
                            {selectedTransaction.checkout_info.price_per_room && (
                              <p><strong>Price per Room:</strong> {formatCurrency(selectedTransaction.checkout_info.price_per_room)}</p>
                            )}
                          </>
                        )}
                        
                        {(getTransactionType(selectedTransaction) === 'bungalow' || getTransactionType(selectedTransaction) === 'oneDayPicnic') && (
                          <>
                            {selectedTransaction.checkout_info.no_of_people && (
                              <p><strong>Number of People:</strong> {selectedTransaction.checkout_info.no_of_people}</p>
                            )}
                            {selectedTransaction.checkout_info.bungalow_code && (
                              <p><strong>Bungalow Code:</strong> {selectedTransaction.checkout_info.bungalow_code}</p>
                            )}
                          </>
                        )}
                        
                        {selectedTransaction.checkout_info.tour_duration && (
                          <p><strong>Duration:</strong> {selectedTransaction.checkout_info.tour_duration}</p>
                        )}
                        {selectedTransaction.checkout_info.tour_locations && (
                          <p><strong>Locations:</strong> {selectedTransaction.checkout_info.tour_locations}</p>
                        )}
                      </Col>
                      <Col md={6}>
                        <p><strong>Total Cost:</strong> {formatCurrency(selectedTransaction.checkout_info.total_tour_cost)}</p>
                        <p><strong>Advance Amount:</strong> {formatCurrency(selectedTransaction.checkout_info.advance_amount)}</p>
                        <p><strong>Advance Percentage:</strong> {selectedTransaction.checkout_info.advance_percentage}%</p>
                        <p><strong>Balance Due:</strong> {formatCurrency(selectedTransaction.checkout_info.balance_due)}</p>
                        <p><strong>Payment Method:</strong> {selectedTransaction.checkout_info.payment_method || "N/A"}</p>
                        <p><strong>Source Page:</strong> {selectedTransaction.checkout_info.source_page}</p>
                      </Col>
                    </Row>
                    {selectedTransaction.checkout_info.notes && (
                      <Row>
                        <Col>
                          <p><strong>Notes:</strong></p>
                          <pre className="notes-pre">{selectedTransaction.checkout_info.notes}</pre>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
                
                {/* Customer Information */}
                <Card className="mb-4 detail-card">
                  <Card.Header>
                    <h5>Customer Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Name:</strong> {selectedTransaction.checkout_info.first_name} {selectedTransaction.checkout_info.last_name}</p>
                        <p><strong>Email:</strong> {selectedTransaction.checkout_info.email}</p>
                        <p><strong>Phone:</strong> {selectedTransaction.checkout_info.phone}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Address:</strong></p>
                        <p>
                          {selectedTransaction.checkout_info.address}<br />
                          {selectedTransaction.checkout_info.city}, {selectedTransaction.checkout_info.state}<br />
                          {selectedTransaction.checkout_info.pincode}, {selectedTransaction.checkout_info.country}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Payment Transactions */}
                <Card className="detail-card">
                  <Card.Header>
                    <h5>Payment Transactions</h5>
                  </Card.Header>
                  <Card.Body>
                    {selectedTransaction.payments.length === 0 ? (
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
                          {selectedTransaction.payments.map((payment) => (
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
      <TransactionsContent />
    </Navbar>
  );
};

export default Transactions;