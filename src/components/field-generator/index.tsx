import React, { FC, useEffect, useState } from 'react';
import { Dropdown, Row, Form } from 'react-bootstrap';
import TextField from './components/TextField';

import { FieldProperties } from '../../types';
import SavedFields from './components/SavedFields';
import FieldWithOptions from './components/FieldWithOptions';
import UploadField from './components/UploadField';

interface GeneratorProps {
  fieldTypes: string[];
  formFields: FieldProperties[];
  formTitle: string;
  onAddField: (fielproperties: FieldProperties, formTitle: string) => void;
  onUpdate: (updatedField: FieldProperties, formTitle: string) => void;
  onFormTitleChange: (newFormTitle: string) => void;
  onDelete: (fieldId: string) => void;
  onDisableButton: (value: boolean) => void;
}

const FormGenerator: FC<GeneratorProps> = ({
  fieldTypes,
  onAddField,
  formFields,
  formTitle,
  onUpdate,
  onDelete,
  onDisableButton,
  onFormTitleChange,
}) => {
  const [selectedFieldType, setSelectedFieldType] = useState<string>('');

  const [isFormNameValid, setIsFormNameValid] = useState<boolean>(true);
  const [disabledFieldTypeSelect, setDisbaledFieldTypeSelect] =
    useState<boolean>(true);
  const [hasMultipleFields, setHasMultipleFields] = useState<boolean>(false);

  const handleFormTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    onFormTitleChange(title);
    setIsFormNameValid(title.length > 0);
    setDisbaledFieldTypeSelect(title.length === 0);
    if (hasMultipleFields && title.length > 0) onDisableButton(false);
  };

  useEffect(() => {
    setHasMultipleFields(formFields.length > 0);
  }, [formFields]);

  const canShowSavedFields = formFields.length > 0;
  const handleAddField = (properties: FieldProperties) => {
    onAddField(properties, formTitle);
    setDisbaledFieldTypeSelect(false);
    setSelectedFieldType('');
    if (formTitle.length === 0) {
      onDisableButton(true);
    } else {
      onDisableButton(false);
    }
  };

  const handleDeleteField = (fieldType: string) => {
    onDelete(fieldType);
  };
  const handleUpdateField = (updatedField: FieldProperties) => {
    onUpdate(updatedField, formTitle);
  };

  const handleFieldTypeChange = (fieldType: string) => {
    setDisbaledFieldTypeSelect(true);
    setSelectedFieldType(fieldType);
    onDisableButton(true);
  };

  const renderSavedFields = () => {
    return formFields.map((field, index) => (
      <React.Fragment key={`saved_${field.fieldId}`}>
        <SavedFields
          fieldProperties={field}
          onUpdateField={handleUpdateField}
          onDeleteField={handleDeleteField}
        />
        {index !== formFields.length - 1 && <hr className="my-4" />}
      </React.Fragment>
    ));
  };

  const renderFieldTypeComponents = () => {
    switch (selectedFieldType) {
      case 'text':
        return (
          <React.Fragment>
            <TextField
              onAddField={handleAddField}
              fieldType={selectedFieldType}
              fieldState="create"
              hasMultipleFields={hasMultipleFields}
              onRemoveField={handleRemoveField}
            />
          </React.Fragment>
        );
      case 'checkbox':
      case 'dropdown':
      case 'radio':
        return (
          <React.Fragment>
            <FieldWithOptions
              onAddField={handleAddField}
              fieldType={selectedFieldType}
              fieldState="create"
              hasMultipleFields={hasMultipleFields}
              onRemoveField={handleRemoveField}
            />
          </React.Fragment>
        );

      case 'file':
        return (
          <React.Fragment>
            <UploadField
              onAddField={handleAddField}
              fieldType={selectedFieldType}
              fieldState="create"
              hasMultipleFields={hasMultipleFields}
              onRemoveField={handleRemoveField}
            />
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  const handleRemoveField = (value: boolean) => {
    if (formFields.length > 0) {
      onDisableButton(!value);
    } else {
      onDisableButton(value);
    }

    setDisbaledFieldTypeSelect(false);
    setSelectedFieldType('');
  };

  return (
    <div>
      <Row>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Form Title</Form.Label>
          <Form.Control
            type="text"
            value={formTitle}
            onChange={handleFormTitleChange}
            isInvalid={!isFormNameValid}
          />
          {!isFormNameValid && (
            <Form.Control.Feedback type="invalid">
              Form title is required.
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Row>
      <Dropdown className="mb-4">
        <Dropdown.Toggle
          variant="primary"
          id="dropdown-field-types"
          disabled={disabledFieldTypeSelect}
        >
          Add field
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {fieldTypes.map((fieldType) => (
            <Dropdown.Item
              key={fieldType}
              onClick={() => handleFieldTypeChange(fieldType)}
            >
              {fieldType}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {canShowSavedFields && renderSavedFields()}
      {renderFieldTypeComponents()}
    </div>
  );
};

export default FormGenerator;
