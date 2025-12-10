import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'react-bootstrap-icons';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/tours`);
      const result = await response.json();

      // Add serial numbers to the data like in the visa appointments example
      const toursWithSerialNo = result.map((item, index) => ({
        ...item,
        serial_no: index + 1
      }));
      setTours(toursWithSerialNo);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Error fetching tours. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Handle view tour details
  const handleViewTour = (tourId) => {
    navigate(`/tour-details/${tourId}`);
  };

  // Columns for ReusableTable
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => {
        // Multiple fallback methods to ensure serial number is displayed
        if (item.serial_no) return item.serial_no;
        if (index !== undefined) return index + 1;
        return 'N/A';
      },
      style: { fontWeight: 'bold', textAlign: 'center', width: '80px' }
    },
    {
      key: 'tour_code',
      title: 'Tour Code',
      render: (item) => item.tour_code || 'N/A'
    },
    {
      key: 'title',
      title: 'Tour Title',
      render: (item) => item.title || 'N/A'
    },
    // {
    //   key: 'category_name',
    //   title: 'Category',
    //   render: (item) => item.category_name || 'N/A'
    // },
    {
      key: 'primary_destination_name',
      title: 'Primary Destination',
      render: (item) => item.primary_destination_name || 'N/A'
    },
    {
      key: 'duration_days',
      title: 'Days',
      render: (item) => item.duration_days || 'N/A',
      style: { textAlign: 'center' }
    },
    {
      key: 'base_price_adult',
      title: 'Price (₹)',
      render: (item) => item.base_price_adult ? `₹${item.base_price_adult}` : 'N/A',
      style: { textAlign: 'right' }
    },
    {
      key: 'overview',
      title: 'Overview',
      render: (item) => {
        const overview = item.overview || '';
        return overview.length > 50 ? `${overview.substring(0, 50)}...` : overview || '—';
      }
    },
    {
      key: 'is_international',
      title: 'International?',
      render: (item) => item.is_international ? "Yes" : "No",
      style: { textAlign: "center" }
    },
    {
      key: 'created_at',
      title: 'Created At',
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString('en-US')
          : 'N/A'
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleViewTour(item.tour_id)}
            title="View Tour Details"
          >
            <Eye size={16} />
          </button>
        </div>
      ),
      style: { textAlign: 'center' }
    }
  ];

  // Transform the data to handle null/undefined values
  const tableData = tours.map(tour => ({
    ...tour,
    title: tour.title || "N/A",
    category_name: tour.category_name || "N/A",
    primary_destination_name: tour.primary_destination_name || "N/A",
    duration_days: tour.duration_days || "N/A",
    base_price_adult: tour.base_price_adult || 0,
    overview: tour.overview || "",
    is_international: tour.is_international || false,
    created_at: tour.created_at || ""
  }));

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Tours</h2>
          <div className="d-flex gap-2">
            {/* <button 
              className="btn btn-primary"
              onClick={fetchTours}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button> */}
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-tour')}
            >
              + Add Tour
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
                Loading tours...
              </div>
            ) : (
              <ReusableTable
                title="Tours"
                data={tableData}
                columns={columns}
                initialEntriesPerPage={5}
                searchPlaceholder="Search tours..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default Tours;