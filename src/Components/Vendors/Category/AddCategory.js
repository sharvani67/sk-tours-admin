// AddCategory.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../Shared/Navbar/Navbar';
import { baseurl } from '../../../Api/Baseurl';

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get category ID from URL if editing
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: ''
  });

  // Fetch category data if in edit mode
  useEffect(() => {
    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      setFetching(true);
      setError('');
      const response = await fetch(`${baseurl}/api/categories/${id}`);
      const result = await response.json();

      if (response.ok) {
        setIsEditMode(true);
        setFormData({
          name: result.name || ''
        });
      } else {
        setError(result.message || 'Failed to fetch category data');
        setTimeout(() => navigate('/categories'), 2000);
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setError('Error loading category data. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleBack = () => navigate('/category-table');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const url = isEditMode 
        ? `${baseurl}/api/categories/${id}`
        : `${baseurl}/api/categories/add-category`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim()
        })
      });

      const result = await response.json();

      if (response.ok) {
        const message = isEditMode 
          ? "Category updated successfully!" 
          : "Category added successfully!";
        
        setSuccess(message);

        // Redirect after success
        setTimeout(() => {
          navigate('/category-table');
        }, 1500);
      } else {
        setError(result.message || result.error || 
          (isEditMode ? "Failed to update category" : "Failed to add category"));
      }
    } catch (err) {
      console.error("Save category error:", err);
      setError(`Error ${isEditMode ? 'updating' : 'adding'} category. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{isEditMode ? 'Edit Category' : 'Add New Category'}</h2>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Body>
            {fetching ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" role="status" className="me-2" />
                <span>Loading category data...</span>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Category Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter category name (e.g., Electronics, Furniture)"
                        required
                        disabled={loading || fetching}
                        isInvalid={!!error}
                        autoFocus
                      />
                      <Form.Text className="text-muted">
                        Category name must be unique
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleBack} 
                    disabled={loading}
                    size="md"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant={isEditMode ? "warning" : "primary"} 
                    disabled={loading}
                    size="md"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        {isEditMode ? 'Updating...' : 'Saving...'}
                      </>
                    ) : isEditMode ? 'Update Category' : 'Add Category'}
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Navbar>
  );
};

export default AddCategory;