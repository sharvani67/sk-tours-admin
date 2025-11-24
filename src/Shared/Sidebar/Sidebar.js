import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Nav,
  Offcanvas,
  Badge,
} from "react-bootstrap";
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiMail,
  FiBriefcase,
  FiTruck,
  FiUser,
  FiFileText,
  FiList,
  FiFile,
  FiBarChart2,
  FiLogOut,
  FiX,
  FiBell,
  FiClock,
  FiChevronDown,
  FiChevronRight
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const AdminLayout = ({ children }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const vendorData = JSON.parse(localStorage.getItem("admin_user"));
  const firstName = vendorData?.admin_name || "Admin";
  const notificationsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://145.79.0.94:85/orders/admin-notifications/");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data) {
        setNotifications(data.data);
        // Count unread notifications
        const unreadCount = data.data.filter(notification => !notification.is_read).length;
        setNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // For demo purposes, using sample data if API fails
      const sampleNotifications = [
        {
          notification_id: "1",
          message: "Your work details has been updated.",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          sender_name: "Abhijith",
          is_read: false
        },
        {
          notification_id: "2",
          message: "New RFQ received from iiiQbets Banglore karnataka",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          sender_name: "System",
          is_read: false
        },
        {
          notification_id: "3",
          message: "Payment received for invoice #INV-2024-001",
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          sender_name: "Finance",
          is_read: true
        }
      ];
      setNotifications(sampleNotifications);
      setNotificationCount(sampleNotifications.filter(n => !n.is_read).length);
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const response = await fetch("http://145.79.0.94:85/orders/admin-notifications/read-all/", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("All notifications marked as read successfully:", result);
      
      // Update local state to mark all notifications as read
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        is_read: true
      }));
      
      setNotifications(updatedNotifications);
      setNotificationCount(0);
      
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Fallback: update UI even if API call fails
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        is_read: true
      }));
      setNotifications(updatedNotifications);
      setNotificationCount(0);
    }
  };

  // Change the page title based on login
  useEffect(() => {
    if (vendorData?.admin_name) {
      document.title = `${vendorData.admin_name} (Admin)`; 
    } else {
      document.title = "A2Z Ships";
    }
  }, [vendorData]);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setShowMobileSidebar(!showMobileSidebar);
    }
  };

  const isActiveNavItem = (item) => {
    if (item.matchPaths) {
      return item.matchPaths.some((path) => location.pathname.includes(path));
    }
    return (
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`)
    );
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleViewAllNotifications = async () => {
    setShowNotifications(false);
    
    // Mark all notifications as read via API
    await markAllNotificationsAsRead();
    
    // Navigate to notifications page if you have one
    // navigate("/notifications");
    console.log("All notifications marked as read");
  };

  const handleNotificationItemClick = (notification) => {
    // Mark as read and handle notification click
    if (!notification.is_read) {
      const updatedNotifications = notifications.map(n =>
        n.notification_id === notification.notification_id ? { ...n, is_read: true } : n
      );
      setNotifications(updatedNotifications);
      setNotificationCount(prev => prev - 1);
    }
    
    // Handle navigation based on notification type
    if (notification.type === "RFQ_CREATED") {
      navigate("/rfq");
    }
    // Add more navigation logic for different notification types
    
    setShowNotifications(false);
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInDays >= 1) {
      const days = Math.floor(diffInDays);
      const hours = Math.floor(diffInHours % 24);
      return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  const navStructure = [
    { label: "Dashboard", path: "/a-dashboard", icon: <FiHome className="sidebar-icon" /> },
    {
      label: "Countries",
      path: "/adminusers",
      icon: <FiUsers className="sidebar-icon" />,
      matchPaths: ["/adminusers", "/add-admin-user", "/edit-admin-user"],
    },
    { label: "Customers", path: "/invitation", icon: <FiMail className="sidebar-icon" /> },
    {
      label: "Tours",
      path: "/clientDetails",
      icon: <FiBriefcase className="sidebar-icon" />,
      matchPaths: ["/clientDetails", "/clientDetailView/"],
    },
    {
      label: "Promotions",
      path: "/vendorDetails",
      icon: <FiTruck className="sidebar-icon" />,
      matchPaths: ["/vendorDetails", "/vendorDetailView/"],
    },
    {
      label: "Destinations",
      path: "/candidateDetails",
      icon: <FiUser className="sidebar-icon" />,
      matchPaths: ["/candidateDetails", "/candidateDetailView/"],
    },
    {
      label: "Bookings",
      path: "/admin-orders",
      icon: <FiList className="sidebar-icon" />,
      matchPaths: ["/admin-orders"],
    },
  
  ];

  const handleNavClick = (label, path) => {
    if (path) {
      navigate(path);
      setShowMobileMenu(false);
      setShowMobileSidebar(false);
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <header className="header shadow-sm">
        <Container fluid>
          <Row className="align-items-center justify-content-between">
            <Col xs="auto">
              <div className="d-flex align-items-center">
                {/* Desktop sidebar toggle */}
                <div className="d-none d-md-block">
                  <div
                    className="navbar-logo"
                    onClick={toggleSidebar}
                    style={{ cursor: "pointer" }}
                  >
                    <FiMenu size={20} className="me-2" />
                    <i className="fas fa-anchor me-2"></i>
                    <span className="navbar-brand mb-0">SK Tours</span>
                  </div>
                </div>
                
                {/* Mobile logo (no click functionality) */}
                <div className="d-md-none">
                  <div className="navbar-logo">
                    <i className="fas fa-anchor me-2"></i>
                    <span className="navbar-brand mb-0">Sk Tours</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs="auto" className="d-none d-md-block">
              {/* Desktop dropdown */}
              <div className="d-flex align-items-center gap-2 justify-content-end navbar-icons">
                {/* Notification Bell Icon with Dropdown */}
                <div 
                  className="notification-container position-relative"
                  ref={notificationsRef}
                >
                  <div 
                    className="notification-icon" 
                    onClick={handleNotificationClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <FiBell size={20} className="notification-bell" />
                    {notificationCount > 0 && (
                      <Badge bg="danger" className="badge-count">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </Badge>
                    )}
                    {loading && (
                      <Badge bg="secondary" className="badge-count">
                        ...
                      </Badge>
                    )}
                  </div>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="notifications-dropdown">
                      <div className="notifications-header">
                        <h6 className="mb-0">Notifications</h6>
                      </div>
                      <div className="notifications-body">
                        {notifications.length === 0 ? (
                          <div className="text-center py-3 text-muted">
                            No notifications
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification.notification_id}
                              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                              onClick={() => handleNotificationItemClick(notification)}
                            >
                              <div className="notification-message">
                                {notification.message}
                              </div>
                              <div className="notification-time">
                                <FiClock size={12} className="me-1" />
                                {getTimeAgo(notification.created_at)}
                                {notification.sender_name && (
                                  <span className="ms-1">by {notification.sender_name}</span>
                                )}
                              </div>
                              {!notification.is_read && (
                                <div className="unread-indicator"></div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="notifications-footer">
                        <hr className="my-2" />
                        <button
                          className="btn btn-link w-100 text-decoration-none p-0"
                          onClick={handleViewAllNotifications}
                        >
                          <strong>View all notifications</strong>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="d-flex align-items-center border-0 bg-transparent"
                  >
                    <span className="me-2 fw-semibold">{firstName}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/admin-profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="/reset-password">Reset Password</Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        localStorage.removeItem("admin_user");
                        navigate("/login");
                      }}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>

            {/* Mobile menu icons */}
            <Col xs="auto" className="d-md-none">
              <div className="d-flex align-items-center gap-3">
                {/* Notification Bell Icon for Mobile */}
                <div 
                  className="notification-icon" 
                  onClick={handleNotificationClick}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <FiBell size={20} className="notification-bell" />
                  {notificationCount > 0 && (
                    <Badge bg="danger" className="badge-count">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                  )}
                  {loading && (
                    <Badge bg="secondary" className="badge-count">
                      ...
                    </Badge>
                  )}
                </div>
                
                {/* Mobile sidebar toggle */}
                <FiMenu
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowMobileSidebar(true)}
                />
                {/* Mobile profile menu */}
                <FiUser
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowMobileMenu(true)}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Sidebar + Main */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div
          className={`sidebar d-none d-md-flex flex-column p-3 ${
            isSidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Nav className="flex-column">
            {navStructure.map((item, index) => (
              <Nav.Link
                key={index}
                className={`sidebar-link ${
                  isActiveNavItem(item) ? "active" : ""
                }`}
                onClick={() => handleNavClick(item.label, item.path)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    {item.icon}
                    <span className="ms-2 sidebar-label">{item.label}</span>
                  </div>
                </div>
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Main Content */}
        <main className={`main-content flex-grow-1 p-4 overflow-auto ${
          isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'
        }`}>
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Offcanvas */}
      <Offcanvas
        show={showMobileSidebar}
        onHide={() => setShowMobileSidebar(false)}
        placement="start"
        className="mobile-sidebar-offcanvas"
      >
        <Offcanvas.Header>
          <Offcanvas.Title>
            <div className="navbar-logo">
              <i className="fas fa-anchor me-2"></i>
              <span>a2zships</span>
            </div>
          </Offcanvas.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowMobileSidebar(false)}
          >
            <FiX size={20} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Nav className="flex-column">
            {navStructure.map((item, index) => (
              <Nav.Link
                key={index}
                className={`sidebar-link ${
                  isActiveNavItem(item) ? "active" : ""
                }`}
                onClick={() => handleNavClick(item.label, item.path)}
              >
                <div className="d-flex align-items-center">
                  {item.icon}
                  <span className="ms-2">{item.label}</span>
                </div>
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Mobile Profile Menu Offcanvas */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="mobile-profile-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{firstName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => {
              navigate("/admin-profile");
              setShowMobileMenu(false);
            }}>
              <FiUser className="me-2" /> Profile
            </Nav.Link>
            <Nav.Link onClick={() => {
              navigate("/reset-password");
              setShowMobileMenu(false);
            }}>
              Reset Password
            </Nav.Link>
            <hr />
            <Nav.Link
              className="logout-link"
              onClick={() => {
                localStorage.removeItem("admin_user");
                navigate("/login");
              }}
            >
              <FiLogOut className="me-2" /> Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}; 

export default AdminLayout;