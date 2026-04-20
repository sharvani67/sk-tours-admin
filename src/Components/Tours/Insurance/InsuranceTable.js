import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Eye, Pencil, Trash } from 'react-bootstrap-icons';
import Navbar from '../../../Shared/Navbar/Navbar';
import { baseurl } from '../../../Api/Baseurl';
import ReusableTable from '../../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';

const InsuranceTable = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Insurance Applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(''); 

      const response = await fetch(`${baseurl}/insurance`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Sort by created_at in descending order (newest first)
        const sortedApplications = result.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

        setApplications(sortedApplications);
        setFilteredApplications(sortedApplications);
      } else {
        setError('Failed to fetch insurance applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Error fetching applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (insuranceId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    // ✅ 1. Remove from frontend immediately
    const updatedApplications = applications.filter(app => app.insurance_id !== insuranceId);
    setApplications(updatedApplications);
    setFilteredApplications(updatedApplications);

    try {
      // ✅ 2. Delete from backend
      const response = await fetch(`${baseurl}/api/insurance/insurance/${insuranceId}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!result.success) {
        alert("Failed to delete from database");
        fetchApplications(); // restore correct data if failed
      }

    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting");
      // restore data if API fails
      fetchApplications();
    }
  };

  const handleEdit = (insuranceId) => {
    navigate(`/insuranceform/${insuranceId}`);
  };

  // const handleView = (insuranceId) => {
  //   navigate(`/viewInsurance/${insuranceId}`);
  // };

  // Columns for ReusableTable based on insurance data structure
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => index + 1,
      style: { fontWeight: 'bold', textAlign: 'center', width: '60px' }
    },
    {
      key: 'insurance_id',
      title: 'Insurance ID',
      render: (item) => item.insurance_id || "N/A",
      style: { fontWeight: 'bold' }
    },
    {
      key: 'name',
      title: 'Full Name',
      render: (item) => {
        const fullName = [item.first_name, item.middle_name, item.last_name]
          .filter(Boolean)
          .join(' ');
        return fullName || "N/A";
      }
    },
    {
      key: 'sex',
      title: 'Gender',
      render: (item) => item.sex || "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'age',
      title: 'Age',
      render: (item) => item.age || "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'cell_no',
      title: 'Mobile',
      render: (item) => item.cell_no || "N/A"
    },
    {
      key: 'purpose_of_travel',
      title: 'Purpose',
      render: (item) => item.purpose_of_travel || "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'date_of_travel',
      title: 'Travel Date',
      render: (item) => item.date_of_travel ? new Date(item.date_of_travel).toLocaleDateString() : "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'sum_insured',
      title: 'Sum Insured',
      render: (item) => item.sum_insured || "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'created_at',
      title: 'Applied On',
      render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleView(item.insurance_id)}
            title="View"
          >
            <Eye />
          </button> */}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(item.insurance_id)}
            title="Edit"
          >
            <Pencil />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.insurance_id)}
            title="Delete"
          >
            <Trash />
          </button>
        </div>
      ),
      style: { textAlign: 'center', minWidth: '140px' }
    }
  ];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Insurance Applications</h2>
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
                Loading applications...
              </div>
            ) : (
              <ReusableTable
                title="Insurance Applications List"
                data={filteredApplications}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by name, insurance ID, mobile..."
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

export default InsuranceTable;