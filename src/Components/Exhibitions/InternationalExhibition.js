// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button, Card, Table, Modal, Badge } from 'react-bootstrap';
// import { FiPlus, FiEdit, FiTrash2, FiEye, FiSave, FiGlobe } from 'react-icons/fi';
// import axios from 'axios';
// import './Exhibition.css';

// const internationalProducts = [
//   "ATM", "Gulf Food", "Air Conditioners", "Tourism",
//   "Hospitality", "Paints", "Toys", "Rubber & Plastic",
//   "Pharmaceutical", "Steel", "Building Material", "Electronics"
// ];

// const countries = [
//   "Dubai", "United Kingdom", "Spain", "Germany", "China"
// ];

// const InternationalExhibition = () => {
//   const [selectedProduct, setSelectedProduct] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [exhibitions, setExhibitions] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingExhibition, setEditingExhibition] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState('');

//   const [formData, setFormData] = useState({
//     productType: '',
//     country: '',
//     code: `INTE${String(exhibitions.length + 1).padStart(5, '0')}`,
//     title: '',
//     description: '',
//     city: '',
//     startDate: '',
//     endDate: '',
//     venue: '',
//     organizer: '',
//     contactEmail: '',
//     contactPhone: '',
//     website: '',
//     image: null
//   });

//   useEffect(() => {
//     fetchExhibitions();
//   }, []);

//   const fetchExhibitions = async () => {
//     try {
//       const response = await axios.get('/api/exhibition/international');
//       setExhibitions(response.data);
//     } catch (error) {
//       console.error('Error fetching exhibitions:', error);
//     }
//   };

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//     setFormData(prev => ({ ...prev, productType: product }));
//   };

//   const handleCountrySelect = (country) => {
//     setSelectedCountry(country);
//     setFormData(prev => ({ ...prev, country }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'image' && files[0]) {
//       const file = files[0];
//       setFormData(prev => ({ ...prev, [name]: file }));
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const submitData = new FormData();
//     Object.keys(formData).forEach(key => {
//       if (formData[key] !== null) {
//         submitData.append(key, formData[key]);
//       }
//     });

//     try {
//       if (editingExhibition) {
//         await axios.put(`/api/exhibition/international/${editingExhibition.id}`, submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       } else {
//         await axios.post('/api/exhibition/international', submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }
      
//       alert('International Exhibition saved successfully!');
//       resetForm();
//       fetchExhibitions();
//       setShowModal(false);
//     } catch (error) {
//       console.error('Error saving exhibition:', error);
//       alert('Error saving exhibition. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       productType: '',
//       country: '',
//       code: `INTE${String(exhibitions.length + 1).padStart(5, '0')}`,
//       title: '',
//       description: '',
//       city: '',
//       startDate: '',
//       endDate: '',
//       venue: '',
//       organizer: '',
//       contactEmail: '',
//       contactPhone: '',
//       website: '',
//       image: null
//     });
//     setImagePreview('');
//     setSelectedProduct('');
//     setSelectedCountry('');
//     setEditingExhibition(null);
//   };

//   const handleEdit = (exhibition) => {
//     setEditingExhibition(exhibition);
//     setFormData({
//       productType: exhibition.productType,
//       country: exhibition.country,
//       code: exhibition.code,
//       title: exhibition.title,
//       description: exhibition.description,
//       city: exhibition.city,
//       startDate: exhibition.startDate,
//       endDate: exhibition.endDate,
//       venue: exhibition.venue,
//       organizer: exhibition.organizer,
//       contactEmail: exhibition.contactEmail,
//       contactPhone: exhibition.contactPhone,
//       website: exhibition.website,
//       image: null
//     });
//     setSelectedProduct(exhibition.productType);
//     setSelectedCountry(exhibition.country);
//     setImagePreview(exhibition.imageUrl || '');
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this exhibition?')) {
//       try {
//         await axios.delete(`/api/exhibition/international/${id}`);
//         fetchExhibitions();
//         alert('Exhibition deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting exhibition:', error);
//         alert('Error deleting exhibition.');
//       }
//     }
//   };

//   return (
//     <Container className="py-4">
//       <Row>
//         <Col>
//           <h2 className="mb-4">International Exhibition Management</h2>
//           <p className="text-muted">Code Format: INTE00001 onwards</p>
//         </Col>
//         <Col className="text-end">
//           <Button variant="primary" onClick={() => setShowModal(true)}>
//             <FiPlus /> Add New Exhibition
//           </Button>
//         </Col>
//       </Row>

//       <Row className="mb-4">
//         <Col md={6}>
//           <Card className="mb-3">
//             <Card.Header>
//               <Card.Title>Select Country</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <div className="country-grid">
//                 {countries.map((country, index) => (
//                   <div
//                     key={index}
//                     className={`country-item ${selectedCountry === country ? 'selected' : ''}`}
//                     onClick={() => handleCountrySelect(country)}
//                   >
//                     <FiGlobe className="me-2" />
//                     {country}
//                   </div>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6}>
//           <Card>
//             <Card.Header>
//               <Card.Title>Select Product Category</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <div className="product-grid">
//                 {internationalProducts.map((product, index) => (
//                   <div
//                     key={index}
//                     className={`product-item ${selectedProduct === product ? 'selected' : ''}`}
//                     onClick={() => handleProductSelect(product)}
//                   >
//                     {product}
//                   </div>
//                 ))}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row>
//         <Col>
//           <Card>
//             <Card.Header>
//               <Card.Title>Existing International Exhibitions</Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <Table striped hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Code</th>
//                     <th>Country</th>
//                     <th>Product</th>
//                     <th>Title</th>
//                     <th>City</th>
//                     <th>Dates</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {exhibitions.map((exhibition, index) => (
//                     <tr key={index}>
//                       <td><Badge bg="info">{exhibition.code}</Badge></td>
//                       <td>{exhibition.country}</td>
//                       <td>{exhibition.productType}</td>
//                       <td>{exhibition.title}</td>
//                       <td>{exhibition.city}</td>
//                       <td>{exhibition.startDate} to {exhibition.endDate}</td>
//                       <td>
//                         <Button variant="outline-info" size="sm" className="me-2">
//                           <FiEye />
//                         </Button>
//                         <Button 
//                           variant="outline-warning" 
//                           size="sm" 
//                           className="me-2"
//                           onClick={() => handleEdit(exhibition)}
//                         >
//                           <FiEdit />
//                         </Button>
//                         <Button 
//                           variant="outline-danger" 
//                           size="sm"
//                           onClick={() => handleDelete(exhibition.id)}
//                         >
//                           <FiTrash2 />
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Add/Edit Modal */}
//       <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{editingExhibition ? 'Edit Exhibition' : 'Add New Exhibition'}</Modal.Title>
//         </Modal.Header>
//         <Form onSubmit={handleSubmit}>
//           <Modal.Body>
//             <Row>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Code</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="code"
//                     value={formData.code}
//                     readOnly
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Country</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="country"
//                     value={formData.country}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Product Type</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="productType"
//                     value={formData.productType}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>City</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Venue</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="venue"
//                     value={formData.venue}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Start Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>End Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Organizer</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="organizer"
//                     value={formData.organizer}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Website</Form.Label>
//                   <Form.Control
//                     type="url"
//                     name="website"
//                     value={formData.website}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Contact Phone</Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="contactPhone"
//                     value={formData.contactPhone}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Contact Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="contactEmail"
//                     value={formData.contactEmail}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Exhibition Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 accept="image/*"
//                 name="image"
//                 onChange={handleInputChange}
//               />
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px' }} />
//                 </div>
//               )}
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit" disabled={loading}>
//               <FiSave className="me-2" />
//               {loading ? 'Saving...' : editingExhibition ? 'Update' : 'Save'}
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>
//     </Container>
//   );
// };

// export default InternationalExhibition;