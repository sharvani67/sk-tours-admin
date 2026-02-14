// CategoryTable.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Badge, Modal, Button } from 'react-bootstrap';
import { Pencil, Trash, PlusCircle } from 'react-bootstrap-icons';
import Navbar from '../../../Shared/Navbar/Navbar';
import { baseurl } from '../../../Api/Baseurl';
import ReusableTable from '../../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');

      const result = await response.json();
      
      // Log to see the actual data structure
      console.log('Fetched categories:', result);

      // Sort categories alphabetically
      const sortedCategories = result.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Error fetching categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show Delete Modal
  const handleDeleteClick = (category) => {
    console.log('Category to delete:', category); // Log to see the structure
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };
const confirmDelete = async () => {
  if (!categoryToDelete) return;

  setDeleteLoading(true);
  try {
    const deleteUrl = `${baseurl}/api/venodorcategory/${categoryToDelete.id}`;
    console.log('Delete URL:', deleteUrl);
    console.log('Making DELETE request for ID:', categoryToDelete.id);
    
    const response = await fetch(
      deleteUrl,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);

    // Log response headers
    console.log('Response headers:', [...response.headers.entries()]);

    const result = await response.json();
    console.log('Delete response data:', result);

    if (response.ok) {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      await fetchCategories();
      
      setSuccessMessage(result.message || 'Category deleted successfully');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } else {
      // Handle error response
      const errorMessage = result.error || result.message || 'Failed to delete category';
      alert(`Delete failed: ${errorMessage}`);
      console.error('Delete failed details:', result);
    }
  } catch (err) {
    console.error('Error in delete operation:', err);
    alert(`Network error: ${err.message}`);
  } finally {
    setDeleteLoading(false);
  }
};

  // Edit Category
  const handleEdit = (categoryId) => {
    navigate(`/vendor-category/${categoryId}`);
  };

  // Table Columns
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No.',
      render: (item, index) => (
        <Badge bg="secondary" pill>
          {index + 1}
        </Badge>
      ),
      style: { width: '80px', textAlign: 'center' }
    },
    {
      key: 'name',
      title: 'Category Name',
      render: (item) => <div className="fw-bold mb-0">{item.name || "N/A"}</div>,
      style: { width: '300px' }
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => {
        // Get the correct ID for edit
        const itemId = item.id || item.category_id || item.ID;
        
        return (
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-primary p-1"
              onClick={() => handleEdit(itemId)}
              title="Edit category"
            >
              <Pencil size={14} />
            </button>

            <button
              className="btn btn-sm btn-outline-danger p-1"
              onClick={() => handleDeleteClick(item)}
              title="Delete category"
            >
              <Trash size={14} />
            </button>
          </div>
        );
      },
      style: { width: '100px', textAlign: 'left' }
    }
  ];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Vendor Categories</h2>
            <p className="text-muted mb-0">Manage your vendor categories</p>
          </div>
          <div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate('/vendor-category')}
            >
              <PlusCircle size={18} /> Add New Category
            </button>
          </div>
        </div>

        {successMessage && (
          <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccessMessage('')}>
            <Alert.Heading>Success!</Alert.Heading>
            <p>{successMessage}</p>
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
            <Alert.Heading>Error!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" role="status" className="me-2" />
                <span>Loading categories...</span>
              </div>
            ) : (
              <ReusableTable
                title="Categories List"
                data={categories}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by category name..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
                entriesOptions={[5, 10, 25, 50, 100]}
              />
            )}
          </Card.Body>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {categoryToDelete && (
              <p>
                Are you sure you want to delete <strong>{categoryToDelete.name}</strong>?
                <br />
                <small className="text-muted">This action cannot be undone.</small>
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowDeleteModal(false);
                setCategoryToDelete(null);
              }} 
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete} 
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
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

export default CategoryTable;