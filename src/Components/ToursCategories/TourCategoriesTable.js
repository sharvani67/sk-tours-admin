import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Add this import
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';

const TourCategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Add this

  const fetchTourCategories = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${baseurl}/api/categories/all-tours`);
      const result = await response.json();
      
      if (result && Array.isArray(result)) {
        setCategories(result);
      } else {
        setError('Failed to fetch tour categories');
      }
    } catch (err) {
      console.error('Error fetching tour categories:', err);
      setError('Error fetching tour categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourCategories();
  }, []);

  const handleAddCategory = () => {
    navigate('/add-category');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Define columns for the reusable table based on your actual table fields
  const columns = [
    {
      key: 'category_id',
      title: 'ID',
      style: { fontWeight: 'bold', width: '80px' }
    },
    {
      key: 'name',
      title: 'Category Name',
      style: { fontWeight: '600' }
    },
    {
      key: 'description',
      title: 'Description',
      render: (item) => item.description || "No description"
    },
    {
      key: 'target_audience',
      title: 'Target Audience',
      render: (item) => item.target_audience || "Not specified"
    },
    {
      key: 'created_at',
      title: 'Created At',
      render: (item) => formatDate(item.created_at),
      style: { width: '180px' }
    },
    {
      key: 'updated_at',
      title: 'Updated At',
      render: (item) => formatDate(item.updated_at),
      style: { width: '180px' }
    }
  ];

  // Transform the data to handle null/undefined values using correct field names
  const tableData = categories.map(category => ({
    ...category,
    name: category.name || "Unnamed Category",
    description: category.description || "No description available",
    target_audience: category.target_audience || "Not specified",
    created_at: category.created_at || null,
    updated_at: category.updated_at || null
  }));

  return (
    <Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Tour Categories</h2>
          <div>
            <Button 
              variant="success"
              onClick={handleAddCategory}
              className="me-2"
            >
              Add Tour Categories
            </Button>
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
                Loading Tour Categories...
              </div>
            ) : (
              <ReusableTable
                title="Tour Categories"
                data={tableData}
                columns={columns}
                initialEntriesPerPage={5}
                searchPlaceholder="Search categories..."
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

export default TourCategoriesTable;