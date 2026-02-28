import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner, Button } from 'react-bootstrap';
import Navbar from '../../Shared/Navbar/Navbar';
import { baseurl } from '../../Api/Baseurl';
import ReusableTable from '../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash, Eye } from 'react-bootstrap-icons';

const MicEnquiryForm = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch MICE Enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${baseurl}/api/mice/enquiry-form`);
      const result = await response.json();

      // Sort enquiries by id in descending order (newest first)
      const sortedEnquiries = Array.isArray(result) 
        ? result.sort((a, b) => b.id - a.id)
        : [];

      // Add serial numbers
      const enquiriesWithSerialNo = sortedEnquiries.map((item, index) => ({
        ...item,
        serial_no: index + 1
      }));

      setEnquiries(sortedEnquiries);
      setFilteredEnquiries(enquiriesWithSerialNo);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError('Error fetching enquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Handle Delete Enquiry
  const handleDelete = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }

    try {
      const response = await fetch(`${baseurl}/api/mice/enquiry/${enquiryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Enquiry deleted successfully');
        fetchEnquiries(); // Refresh the list
      } else {
        alert(result.message || result.error || 'Failed to delete enquiry');
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
      alert('Error deleting enquiry. Please try again.');
    }
  };

  // Handle View - Navigate to view details page
  const handleView = (enquiryId) => {
    navigate(`/view-enquiry/${enquiryId}`);
  };

  // Handle Edit - Navigate to edit form
  const handleEdit = (enquiryId) => {
    navigate(`/edit-enquiry/${enquiryId}`);
  };

  // Define table columns for MICE Enquiries
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => {
        if (item.serial_no) return item.serial_no;
        if (index !== undefined) return index + 1;
        return 'N/A';
      },
      style: { fontWeight: 'bold', textAlign: 'center', width: '60px' }
    },
    {
      key: 'id',
      title: 'ID',
      render: (item) => item.id || "N/A",
      style: { textAlign: 'center', width: '70px' }
    },
    {
      key: 'company_name',
      title: 'Company Name',
      render: (item) => item.company_name || "N/A",
      style: { minWidth: '150px' }
    },
    {
      key: 'reference_no',
      title: 'Reference No',
      render: (item) => item.reference_no || "N/A",
      style: { textAlign: 'center', width: '120px' }
    },
    {
      key: 'contact_person',
      title: 'Contact Person',
      render: (item) => item.contact_person || "N/A",
      style: { minWidth: '130px' }
    },
    {
      key: 'cell_no',
      title: 'Cell No',
      render: (item) => item.cell_no || "N/A",
      style: { width: '120px' }
    },
    {
      key: 'email',
      title: 'Email',
      render: (item) => item.email || "N/A",
      style: { minWidth: '180px' }
    },
    {
      key: 'city',
      title: 'City',
      render: (item) => item.city || "N/A",
      style: { width: '100px' }
    },
    {
      key: 'pin_code',
      title: 'Pin Code',
      render: (item) => item.pin_code || "N/A",
      style: { textAlign: 'center', width: '90px' }
    },
    {
      key: 'state',
      title: 'State',
      render: (item) => item.state || "N/A",
      style: { width: '100px' }
    },
    {
      key: 'country',
      title: 'Country',
      render: (item) => item.country || "N/A",
      style: { width: '100px' }
    },
    {
      key: 'people_rooms',
      title: 'People/Rooms',
      render: (item) => `${item.num_people || 0} / ${item.num_rooms || 0}`,
      style: { textAlign: 'center', width: '100px' }
    },
    {
      key: 'room_details',
      title: 'Room Details',
      render: (item) => (
        <div>
          <small>S: {item.single_room || 0} | D: {item.double_room || 0}</small>
          <br />
          <small>T: {item.triple_room || 0} | Su: {item.suite_room || 0}</small>
        </div>
      ),
      style: { textAlign: 'center', width: '100px' }
    },
    {
      key: 'city_type',
      title: 'City Type',
      render: (item) => {
        if (item.city_type === 'one') return 'One City';
        if (item.city_type === 'multiple') return 'Multiple Cities';
        return '—';
      },
      style: { textAlign: 'center', width: '100px' }
    },
    {
      key: 'city_name',
      title: 'City Name(s)',
      render: (item) => item.city_name || "—",
      style: { minWidth: '120px' }
    },
    {
      key: 'domestic_destination',
      title: 'Domestic Destination',
      render: (item) => item.domestic_destination || "—",
      style: { minWidth: '150px' }
    },
    {
      key: 'international_destination',
      title: 'International Destination',
      render: (item) => item.international_destination || "—",
      style: { minWidth: '150px' }
    },
    {
      key: 'hotel_category',
      title: 'Hotel Category',
      render: (item) => item.hotel_category || "—",
      style: { textAlign: 'center', width: '100px' }
    },
    {
      key: 'budget',
      title: 'Budget',
      render: (item) => item.budget || "—",
      style: { width: '100px' }
    },
    {
      key: 'common_inclusion',
      title: 'Common Inclusion',
      render: (item) => {
        const text = item.common_inclusion || "—";
        return text.length > 30 ? text.substring(0, 30) + '...' : text;
      },
      style: { minWidth: '150px' }
    },
    // {
    //   key: 'created_at',
    //   title: 'Created At',
    //   render: (item) => {
    //     if (!item.created_at) return 'N/A';
        
    //     try {
    //       const date = new Date(item.created_at);
    //       if (isNaN(date.getTime())) {
    //         return 'Invalid Date';
    //       }
    //       return date.toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit'
    //       });
    //     } catch (error) {
    //       return 'Invalid Date';
    //     }
    //   },
    //   style: { minWidth: '140px' }
    // },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleView(item.id)}
            title="View Details"
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
      ),
      style: { textAlign: 'center', minWidth: '130px' }
    }
  ];

  return (

      <Container fluid className="px-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">MICE Enquiries</h2>
       
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
                Loading MICE enquiries...
              </div>
            ) : (
              <ReusableTable
                title="MICE Enquiries List"
                data={filteredEnquiries}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by company, contact, email, reference..."
                showSearch={true}
                showEntriesSelector={true}
                showPagination={true}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
  
  );
};

export default MicEnquiryForm;