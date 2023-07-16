import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { FieldProperties } from '../../../types';
import { useState } from 'react';
import TextField from './TextField';
import FieldWithOptions from './FieldWithOptions';
import UploadField from './UploadField';

interface SavedFieldProps {
  fieldProperties: FieldProperties;
  onDeleteField: (fieldId: string) => void;
  onUpdateField: (properties: FieldProperties) => void;
}

const SavedFields: React.FC<SavedFieldProps> = ({
  fieldProperties,
  onDeleteField,
  onUpdateField,
}) => {
  const [isEdit, setIsEditField] = useState(false);

  const handleUpdateField = (properties: FieldProperties) => {
    setIsEditField(false);
    onUpdateField(properties);
  };

  const handleDelete = () => {
    onDeleteField(fieldProperties.fieldId);
  };

  const renderFieldComponent = () => {
    switch (fieldProperties.fieldType) {
      case 'text':
        return (
          <TextField
            fieldType={fieldProperties.fieldType}
            onAddField={handleUpdateField}
            fieldState="edit"
            fieldForm={fieldProperties}
          />
        );
      case 'checkbox':
      case 'dropdown':
      case 'radio':
        return (
          <FieldWithOptions
            fieldType={fieldProperties.fieldType}
            onAddField={handleUpdateField}
            fieldState="edit"
            fieldForm={fieldProperties}
          />
        );

      case 'file':
        return (
          <UploadField
            fieldType={fieldProperties.fieldType}
            onAddField={handleUpdateField}
            fieldState="edit"
            fieldForm={fieldProperties}
          />
        );
      default:
        return null;
    }
  };

  if (isEdit) return renderFieldComponent();
  else
    return (
      <div className="mb-2">
        <Row>
          <Col sm={5}>
            <div>Name: {fieldProperties.labelName}</div>
          </Col>
          <Col sm={3}>
            <div>Type: {fieldProperties.fieldType}</div>
          </Col>
          <Col sm={4}>
            <div className="d-flex justify-content-evenly">
              <Button variant="success" onClick={() => setIsEditField(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
};

export default SavedFields;
