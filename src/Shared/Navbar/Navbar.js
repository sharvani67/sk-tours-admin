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
  FiMenu,FiHome,FiUsers,FiUser, FiLogOut,FiX, FiBell,FiClock,FiFlag,FiMap,FiMapPin,FiGift,FiArchive,FiAnchor,FiSettings,
  FiVideo,FiInfo,FiGlobe
} from "react-icons/fi";

import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { FaIdCard } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

const Navbar = ({ children }) => {
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

 const navStructure = [
  { 
    label: "Dashboard", 
    path: "/dashboard", 
    icon: <FiHome className="sidebar-icon" /> 
  },
   {
    label: "Add Videos",
    path: "/add-video",
    icon: <FiVideo className="sidebar-icon" />,   // tours = map routes
    // matchPaths: ["/categories-tour","/add-video"],
  },
  // {
  //   label: "Add Cards",
  //   path: "/add-card",
  //   icon: <FaIdCard className="sidebar-icon" />,   // tours = map routes
  //   // matchPaths: ["/categories-tour","/add-video"],
  // },
  {
    label: "PopUp Leads",
    path: "/leadspopup",
    icon: <FaCircleUser className="sidebar-icon" />,   // tours = map routes
    // matchPaths: ["/categories-tour","/add-video"],
  },

  {
    label: "Countries",
    path: "/countries",
    icon: <FiFlag className="sidebar-icon" />,   // more relevant
    matchPaths: ["/countries"],
  },

    {
    label: "International Countries",
    path: "/intl-countries",
    icon: <FiFlag className="sidebar-icon" />,   // more relevant
    matchPaths: ["/intl-countries","/intl-add-countries"],
  },

  // { 
  //   label: "Customers", 
  //   path: "/customers", 
  //   icon: <FiUsers className="sidebar-icon" />  // group of people
  // },

  {
    label: "DOM-Individual-Tours",
    path: "/tours",
    icon: <FiMap className="sidebar-icon" />,   // tours = map routes
    matchPaths: ["/tours", "/add-tour"],
  },

   {
    label: "DOM-Group-Tours", 
    path: "/group-tours",
    icon: <FiUsers className="sidebar-icon" />, 
    matchPaths: ["/group-tours", "/add-group-tour"],
  },

  
  // NEW TABS ADDED HERE
  {
    label: "DOM-Ladies Special Tours",
    path: "/ladies-special-tours",
    icon: <FiUsers className="sidebar-icon" />,
    matchPaths: ["/ladies-special-tours", "/add-ladies-special-tour"],
  },

  {
    label: "DOM-Senior Citizen Tours",
    path: "/senior-citizen-tours",
    icon: <FiUsers className="sidebar-icon" />,
    matchPaths: ["/senior-citizen-tours", "/add-senior-citizen-tour"],
  },

  {
    label: "DOM-Student Tours",
    path: "/student-tours",
    icon: <FiUsers className="sidebar-icon" />,
    matchPaths: ["/student-tours", "/add-student-tour"],
  },

  {
    label: "DOM-Honeymoon Tours",
    path: "/honeymoon-tours",
    icon: <FiMap className="sidebar-icon" />,
    matchPaths: ["/honeymoon-tours", "/add-honeymoon-tour"],
  },


  {
    label: "INTL-Individual-Tours",
    path: "/intl-tours",
    icon: <FiMap className="sidebar-icon" />,   // tours = map routes
    matchPaths: ["/intl-tours", "/intl-add-tour"],
  },

   {
    label: "INTL-Group-Tours", 
    path: "/intl-group-tours",
    icon: <FiUsers className="sidebar-icon" />, 
    matchPaths: ["/intl-group-tours", "/intl-add-group-tour"],
  },

  {
    label: "INTL-Ladies-Special-Tours",
    path: "/intl-ladies-special-tours",
    icon: <FiUsers className="sidebar-icon" />,
    matchPaths: ["/intl-ladies-special-tours", "/intl-add-ladies-special-tour"],
  },

  {
    label: "INTL-Senior-Citizen-Tours",
    path: "/intl-senior-citizen-tours",
    icon: <FiUsers className="sidebar-icon" />,
    matchPaths: ["/intl-senior-citizen-tours", "/intl-add-senior-citizen-tour"],
  },

  {
    label: "INTL-Student-Tours",
    path: "/intl-student-tours",
    icon: <FiUsers className="sidebar-icon" />,
    matchPaths: ["/intl-student-tours", "/intl-add-student-tour"],
  },

  {
    label: "INTL-Honeymoon-Tours",
    path: "/intl-honeymoon-tours",
    icon: <FiMap className="sidebar-icon" />,
    matchPaths: ["/intl-honeymoon-tours", "/intl-add-honeymoon-tour"],
  },

   {
    label: "Tours-categories",
    path: "/categories-tours",
    icon: <FiMap className="sidebar-icon" />,   // tours = map routes
    matchPaths: ["/categories-tour","/add-category"],
  },


  // {
  //   label: "Promotions",
  //   path: "/promotions",
  //   icon: <FiGift className="sidebar-icon" />,   // offers/promos = gift
  //   matchPaths: ["/promotions"],
  // },

  {
    label: "Destinations",
    path: "/destinations",
    icon: <FiMapPin className="sidebar-icon" />, // place pin
    matchPaths: ["/destinations", "/add-destination"],
  },

   {
    label: "International Destinations",
    path: "/intl-destinations",
    icon: <FiMapPin className="sidebar-icon" />, // place pin
    matchPaths: ["/intl-destinations", "/intl-add-destination"],
  },

  // Add this to your navStructure array in Navbar.js, after "International Destinations"
{
  label: "Exhibition",
  path: "/exhibition",
  icon: <FiArchive className="sidebar-icon" />,
  matchPaths: [
    "/exhibition",
    "/about-exhibition",
    "/domestic-exhibitions",
    "/international-exhibitions",
    "/add-exhibition/domestic",
    "/add-exhibition/international",
    "/add-exhibition-faq",
    "/edit-exhibition/domestic/:id",
    "/edit-exhibition/international/:id",
    "/edit-exhibition-faq/:id"
  ],
  submenu: [
    {
      label: "About Exhibition",
      path: "/about-exhibition",
      icon: <FiInfo className="sidebar-icon" />,
    },
    {
      label: "Domestic Exhibition",
      path: "/domestic-exhibitions",
      icon: <FiHome className="sidebar-icon" />,
    },
    {
      label: "International Exhibition",
      path: "/international-exhibitions",
      icon: <FiGlobe className="sidebar-icon" />,
    },
  ],
},
  // {
  //   label: "Bookings",
  //   path: "/bookings",
  //   icon: <FiArchive className="sidebar-icon" />, // records/bookings
  //   matchPaths: ["/bookings"],
  // },
   {
    label: "Cruise Bookings",
    path: "/cruise-bookings",
    icon: <FiAnchor className="sidebar-icon" />,
    matchPaths: ["/cruise-bookings"],
  },
   {
    label: "Advance Cruise Booking",
    path: "/advanced-cruise-bookings",
    icon: <FiSettings className="sidebar-icon" />,
    matchPaths: ["/advanced-cruise-bookings"],
  },
  {
    label: "Visa Appointments",
    path: "/visa-appointments",
    icon: <FiMapPin className="sidebar-icon" />,
    matchPaths: ["/visa-appointments"],
  },

    {
    label: "Contact Us",
    path: "/contact-us",
    icon: <FiUsers className="sidebar-icon" />, // You might want to use a more appropriate icon like FiMail
    matchPaths: ["/contact-us"],
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
                        navigate("/");
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

export default Navbar;