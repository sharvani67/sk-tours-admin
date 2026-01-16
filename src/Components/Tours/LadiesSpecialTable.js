import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Modal, Button } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash } from 'react-bootstrap-icons';

const LadiesSpecialTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/tours`);
      const result = await response.json();

      // Filter tours where tour_type is "Ladies Special" (case-insensitive check)
      const filteredTours = result.filter(tour => 
        tour.tour_type && tour.tour_type.toLowerCase() === "ladiesspecial" && tour.is_international === 0
      );

      // Add serial numbers to the filtered data
      const toursWithSerialNo = filteredTours.map((item, index) => ({
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
    navigate(`/ladies-special-tour-details/${tourId}`);
  };

  // Handle edit tour
  const handleEditTour = (tourId) => {
    // Navigate to edit page with tour ID
    navigate(`/edit-ladies-special-tour/${tourId}`);
  };

  // Handle delete tour - show confirmation modal
  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setShowDeleteModal(true);
  };

  // Confirm and delete tour
  const handleConfirmDelete = async () => {
    if (!tourToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`${baseurl}/api/tours/bulk/${tourToDelete.tour_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the tour from state
        setTours(prevTours => prevTours.filter(tour => tour.tour_id !== tourToDelete.tour_id));
        
        // Show success message
        setError('Ladies Special tour deleted successfully!');
        
        // Close modal
        setShowDeleteModal(false);
        setTourToDelete(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setError(''), 3000);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to delete Ladies Special tour');
      }
    } catch (err) {
      console.error('Error deleting Ladies Special tour:', err);
      setError('Error deleting Ladies Special tour. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTourToDelete(null);
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
    // {
    //   key: 'is_international',
    //   title: 'International?',
    //   render: (item) => item.is_international ? "Yes" : "No",
    //   style: { textAlign: "center" }
    // },
    // {
    //   key: 'created_at',
    //   title: 'Created At',
    //   render: (item) =>
    //     item.created_at
    //       ? new Date(item.created_at).toLocaleDateString('en-US')
    //       : 'N/A'
    // },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleViewTour(item.tour_id)}
            title="View Tour Details"
          >
            <Eye size={16} />
          </button>
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => handleEditTour(item.tour_id)}
            title="Edit Tour"
          >
            <Pencil size={16} />
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => handleDeleteClick(item)}
            title="Delete Tour"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '140px' }
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
          <h2 className="mb-0">Ladies Special Tours</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success"
              onClick={() => navigate('/add-ladies-special-tour')}
            >
              + Add Ladies Special Tour
            </button>
          </div>
        </div>

        {error && (
          <Alert variant={error.includes('successfully') ? 'success' : 'danger'} className="mb-4">
            {error}
          </Alert>
        )}

        <Card>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="me-2" />
                Loading Ladies Special tours...
              </div>
            ) : (
              <ReusableTable
                title="Ladies Special Tours"
                data={tableData}
                columns={columns}
                initialEntriesPerPage={15}
                searchPlaceholder="Search Ladies Special tours..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            )}
          </Card.Body>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete the Ladies Special tour "<strong>{tourToDelete?.title}</strong>" (Tour Code: {tourToDelete?.tour_code})?
            </p>
            <p className="text-danger">
              <strong>Warning:</strong> This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Navbar>
  );
};

export default LadiesSpecialTours;