import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Eye, Pencil, Trash } from 'react-bootstrap-icons';
import Navbar from '../../../Shared/Navbar/Navbar';
import { baseurl } from '../../../Api/Baseurl';
import ReusableTable from '../../../Shared/TableLayout/DataTable';
import { useNavigate } from 'react-router-dom';

const PassportApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Passport Applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(''); 

      const response = await fetch(`${baseurl}/api/passport/passport`);
      const result = await response.json();
      
      // Sort by created_at in descending order (newest first)
      const sortedApplications = result.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      setApplications(sortedApplications);
      setFilteredApplications(sortedApplications);
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
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this application?")) {
    return;
  }

  // ✅ 1. Remove from frontend immediately
  const updatedApplications = applications.filter(app => app.id !== id);
  setApplications(updatedApplications);
  setFilteredApplications(updatedApplications);

  try {
    // ✅ 2. Delete from backend
    const response = await fetch(`${baseurl}/api/passport/passportform/${id}`, {
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
  const handleEdit = (passportId) => {
    navigate(`/addPassport/${passportId}`);
  };


  // Columns for ReusableTable based on the provided data structure
  const columns = [
    {
      key: 'serial_no',
      title: 'S.No',
      render: (item, index) => index + 1,
      style: { fontWeight: 'bold', textAlign: 'center', width: '60px' }
    },
    {
      key: 'name',
      title: 'Full Name',
      render: (item) => {
        const fullName = [item.name, item.middle_name, item.surname]
          .filter(Boolean)
          .join(' ');
        return fullName || "N/A";
      }
    },
    {
      key: 'applicant_for',
      title: 'Applicant For',
      render: (item) => item.applicant_for || "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'application_type',
      title: 'Type',
      render: (item) => item.application_type || "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'dob',
      title: 'Date of Birth',
      render: (item) => item.dob ? new Date(item.dob).toLocaleDateString() : "N/A",
      style: { textAlign: "center" }
    },
    {
      key: 'cell_no',
      title: 'Mobile',
      render: (item) => item.cell_no || "N/A"
    },
    {
      key: 'email',
      title: 'Email',
      render: (item) => item.email || "N/A"
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
      style: { textAlign: 'center', minWidth: '120px' }
    }
  ];

  return (
    <Navbar>
      <Container fluid className="px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Passport Applications</h2>
          <div>
         
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
                Loading applications...
              </div>
            ) : (
              <ReusableTable
                title="Passport Applications List"
                data={filteredApplications}
                columns={columns}
                initialEntriesPerPage={10}
                searchPlaceholder="Search by name, email, mobile..."
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

export default PassportApplications;