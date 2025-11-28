import React from 'react';
import { Card, Row, Col, Image, Badge, Button } from 'react-bootstrap';
import { Trash, Pencil, Plus } from 'react-bootstrap-icons';
import './Images.css'; // Create this CSS file

const Images = ({ images, onDeleteImage, onEditImage, onAddImage }) => {
  return (
    <div className="tab-pane-content">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Tour Images ({images.length})</h4>
          <Button
            variant="primary"
            size="sm"
            className="add-image-btn"
            onClick={onAddImage}
          >
            <Plus size={16} className="me-1" />
            Add Image
          </Button>
        </Card.Header>
        <Card.Body>
          {images.length > 0 ? (
            <Row>
              {images.map((image) => (
                <Col md={4} key={image.image_id} className="mb-4">
                  <div className="image-container position-relative">
                    <Image
                      src={image.url}
                      alt={image.caption || `Tour Image`}
                      fluid
                      thumbnail
                      className="tour-image"
                    />
                    <div className="image-overlay">
                      <div className="action-buttons">
                        <Button
                          variant="warning"
                          size="sm"
                          className="edit-btn me-1"
                          onClick={() => onEditImage(image)}
                          title="Edit Image"
                        >
                          <Pencil size={12} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="delete-btn"
                          onClick={() => onDeleteImage(image.image_id)}
                          title="Delete Image"
                        >
                          <Trash size={12} />
                        </Button>
                      </div>
                    </div>
                    {image.caption && <p className="text-center mt-2 mb-1">{image.caption}</p>}
                    {image.is_cover && (
                      <Badge bg="primary" className="cover-badge">Cover Image</Badge>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-3">No images available for this tour.</p>
              <Button
                variant="outline-primary"
                onClick={onAddImage}
              >
                <Plus size={16} className="me-1" />
                Add First Image
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Images;