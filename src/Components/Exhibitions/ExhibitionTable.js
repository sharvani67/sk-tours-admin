// ExhibitionTable.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Button, Badge } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Eye } from 'react-bootstrap-icons';

const ExhibitionTable = ({ exhibitionType = 'domestic' }) => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dummy data based on exhibition type
  const getDummyData = () => {
    if (exhibitionType === 'about') {
      return [
        {
          id: 1,
          serial_no: 1,
          question: "What are the exhibition timings?",
          answer: "The exhibition is open from 10:00 AM to 6:00 PM daily.",
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          serial_no: 2,
          question: "How can I register for the exhibition?",
          answer: "You can register online through our website or at the venue registration desk.",
          created_at: "2024-01-14T14:20:00Z"
        },
        {
          id: 3,
          serial_no: 3,
          question: "Is there parking available?",
          answer: "Yes, we have ample parking space available for all visitors.",
          created_at: "2024-01-13T09:15:00Z"
        }
      ];
    } else if (exhibitionType === 'domestic') {
      return [
        {
          id: 1,
          serial_no: 1,
          code: "DOME00001",
          title: "National Textile Expo 2024",
          product_type: "Textile",
          city: "Mumbai",
          start_date: "2024-03-15",
          end_date: "2024-03-18",
          created_at: "2024-01-10T10:00:00Z"
        },
        {
          id: 2,
          serial_no: 2,
          code: "DOME00002",
          title: "AgriTech India 2024",
          product_type: "Agriculture",
          city: "Delhi",
          start_date: "2024-04-05",
          end_date: "2024-04-08",
          created_at: "2024-01-09T14:30:00Z"
        }
      ];
    } else {
      return [
        {
          id: 1,
          serial_no: 1,
          code: "INTE00001",
          title: "Dubai Gulf Food Expo 2024",
          country: "Dubai",
          product_type: "Gulf Food",
          city: "Dubai",
          start_date: "2024-02-15",
          end_date: "2024-02-18",
          created_at: "2024-01-05T13:00:00Z"
        },
        {
          id: 2,
          serial_no: 2,
          code: "INTE00002",
          title: "London Tourism Fair",
          country: "United Kingdom",
          product_type: "Tourism",
          city: "London",
          start_date: "2024-03-22",
          end_date: "2024-03-25",
          created_at: "2024-01-04T15:30:00Z"
        }
      ];
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setExhibitions(getDummyData());
      setLoading(false);
    }, 1000);
  }, [exhibitionType]);

  // Handle actions
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this exhibition?')) {
      return;
    }
    // Remove from local state
    setExhibitions(exhibitions.filter(item => item.id !== id));
  };

  const handleEdit = (id) => {
    if (exhibitionType === 'about') {
      navigate(`/edit-exhibition-faq/${id}`);
    } else {
      navigate(`/edit-exhibition/${exhibitionType}/${id}`);
    }
  };

  const handleView = (id) => {
    // Navigate to view details page
    console.log(`View exhibition ${id}`);
  };

  // Get configuration
  const getConfig = () => {
    switch(exhibitionType) {
      case 'domestic':
        return {
          title: 'Domestic Exhibitions',
          addRoute: '/add-exhibition/domestic'
        };
      case 'international':
        return {
          title: 'International Exhibitions',
          addRoute: '/add-exhibition/international'
        };
      case 'about':
        return {
          title: 'About Exhibition FAQs',
          addRoute: '/add-exhibition-faq'
        };
      default:
        return {
          title: 'Exhibitions',
          addRoute: '/add-exhibition/domestic'
        };
    }
  };

  const config = getConfig();

  // Define columns
  const getColumns = () => {
    if (exhibitionType === 'about') {
      return [
        {
          key: 'serial_no',
          title: 'S.No',
          render: (item) => item.serial_no,
          style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
        },
        {
          key: 'question',
          title: 'Question',
          render: (item) => item.question
        },
        {
          key: 'answer',
          title: 'Answer',
          render: (item) => item.answer.length > 100 ? `${item.answer.substring(0, 100)}...` : item.answer
        },
        {
          key: 'actions',
          title: 'Actions',
          render: (item) => (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => handleView(item.id)}
                title="View"
              >
                <Eye />
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleEdit(item.id)}
                title="Edit"
              >
                <Pencil />
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(item.id)}
                title="Delete"
              >
                <Trash />
              </button>
            </div>
          )
        }
      ];
    } else {
      return [
        {
          key: 'serial_no',
          title: 'S.No',
          render: (item) => item.serial_no,
          style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
        },
        {
          key: 'code',
          title: 'Code',
          render: (item) => (
            <Badge bg={exhibitionType === 'domestic' ? 'primary' : 'info'}>
              {item.code}
            </Badge>
          )
        },
        {
          key: 'title',
          title: 'Title',
          render: (item) => item.title
        },
        {
          key: exhibitionType === 'domestic' ? 'product_type' : 'country',
          title: exhibitionType === 'domestic' ? 'Product Type' : 'Country',
          render: (item) => exhibitionType === 'domestic' ? item.product_type : item.country
        },
        {
          key: 'city',
          title: 'City',
          render: (item) => item.city
        },
        {
          key: 'dates',
          title: 'Dates',
          render: (item) => {
            const formatDate = (dateString) => {
              if (!dateString) return 'N/A';
              const date = new Date(dateString);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            };
            return `${formatDate(item.start_date)} - ${formatDate(item.end_date)}`;
          }
        },
        {
          key: 'actions',
          title: 'Actions',
          render: (item) => (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => handleView(item.id)}
                title="View"
              >
                <Eye />
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleEdit(item.id)}
                title="Edit"
              >
                <Pencil />
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(item.id)}
                title="Delete"
              >
                <Trash />
              </button>
            </div>
          )
        }
      ];
    }
  };

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{config.title}</h2>
          <div>
            <button
              className={`btn ${exhibitionType === 'domestic' ? 'btn-success' : exhibitionType === 'international' ? 'btn-info' : 'btn-primary'}`}
              onClick={() => navigate(config.addRoute)}
            >
              + Add {exhibitionType === 'about' ? 'FAQ' : 'Exhibition'}
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading {exhibitionType} exhibitions...
              </div>
            ) : exhibitions.length > 0 ? (
              <ReusableTable
                title={config.title}
                data={exhibitions}
                columns={getColumns()}
                initialEntriesPerPage={10}
                searchPlaceholder={`Search ${exhibitionType} exhibitions...`}
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No {exhibitionType} exhibitions found.</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate(config.addRoute)}
                >
                  + Add Your First {exhibitionType === 'about' ? 'FAQ' : 'Exhibition'}
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default ExhibitionTable;