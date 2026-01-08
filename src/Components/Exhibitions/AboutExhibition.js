// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
// import { FiPlus, FiTrash2, FiUpload, FiSave } from 'react-icons/fi';
// import axios from 'axios';
// import './Exhibition.css';

// const AboutExhibition = () => {
//   const [mainImage, setMainImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [faqItems, setFaqItems] = useState([{ question: '', answer: '' }]);
//   const [loading, setLoading] = useState(false);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setMainImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddFaq = () => {
//     setFaqItems([...faqItems, { question: '', answer: '' }]);
//   };

//   const handleRemoveFaq = (index) => {
//     if (faqItems.length > 1) {
//       const newFaqItems = [...faqItems];
//       newFaqItems.splice(index, 1);
//       setFaqItems(newFaqItems);
//     }
//   };

//   const handleFaqChange = (index, field, value) => {
//     const newFaqItems = [...faqItems];
//     newFaqItems[index][field] = value;
//     setFaqItems(newFaqItems);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
    
//     if (mainImage) {
//       formData.append('mainImage', mainImage);
//     }
    
//     formData.append('faqItems', JSON.stringify(faqItems));

//     try {
//       const response = await axios.post('/api/exhibition/about', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       alert('About Exhibition saved successfully!');
//       console.log('Response:', response.data);
//     } catch (error) {
//       console.error('Error saving about exhibition:', error);
//       alert('Error saving data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="py-4">
//       <Row>
//         <Col>
//           <h2 className="mb-4">About Exhibition Management</h2>
//         </Col>
//       </Row>

//       <Form onSubmit={handleSubmit}>
//         <Row className="mb-4">
//           <Col md={6}>
//             <Card>
//               <Card.Header>
//                 <Card.Title>Main Image Upload</Card.Title>
//               </Card.Header>
//               <Card.Body>
//                 <Form.Group controlId="mainImage" className="mb-3">
//                   <Form.Label>Upload Exhibition Main Image</Form.Label>
//                   <div className="image-upload-container">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="form-control"
//                       id="imageInput"
//                     />
//                     <div className="upload-area mt-3">
//                       {imagePreview ? (
//                         <Image src={imagePreview} alt="Preview" fluid className="preview-image" />
//                       ) : (
//                         <div className="upload-placeholder">
//                           <FiUpload size={48} />
//                           <p>Click to upload or drag and drop</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </Form.Group>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={6}>
//             <Card className="h-100">
//               <Card.Header className="d-flex justify-content-between align-items-center">
//                 <Card.Title>Question & Answer Section</Card.Title>
//                 <Button variant="outline-primary" size="sm" onClick={handleAddFaq}>
//                   <FiPlus /> Add Q&A
//                 </Button>
//               </Card.Header>
//               <Card.Body className="faq-section">
//                 {faqItems.map((faq, index) => (
//                   <div key={index} className="faq-item mb-3 p-3 border rounded">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <h6>Q&A #{index + 1}</h6>
//                       {faqItems.length > 1 && (
//                         <Button 
//                           variant="outline-danger" 
//                           size="sm"
//                           onClick={() => handleRemoveFaq(index)}
//                         >
//                           <FiTrash2 />
//                         </Button>
//                       )}
//                     </div>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Question</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter question"
//                         value={faq.question}
//                         onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group>
//                       <Form.Label>Answer</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         placeholder="Enter answer"
//                         value={faq.answer}
//                         onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
//                         required
//                       />
//                     </Form.Group>
//                   </div>
//                 ))}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         <Row>
//           <Col className="text-end">
//             <Button 
//               variant="primary" 
//               type="submit" 
//               disabled={loading}
//               className="px-4"
//             >
//               <FiSave className="me-2" />
//               {loading ? 'Saving...' : 'Save About Exhibition'}
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Container>
//   );
// };

// export default AboutExhibition;