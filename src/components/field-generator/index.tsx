import React, { FC, useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import TextField from './components/TextField';
import { FieldProperties } from '../../types';
import SavedFields from './components/SavedFields';
import FieldWithOptions from './components/FieldWithOptions';
import UploadField from './components/UploadField';

interface GeneratorProps {
  fieldTypes: string[];
  formFields: FieldProperties[];
  onAddField: (fielproperties: FieldProperties) => void;
  onUpdate: (updatedField: FieldProperties) => void;
  onDelete: (fieldId: string) => void;
  onDisableButton: (value: boolean) => void;
}

const FormGenerator: FC<GeneratorProps> = ({
  fieldTypes,
  onAddField,
  formFields,
  onUpdate,
  onDelete,
  onDisableButton,
}) => {
  const [selectedFieldType, setSelectedFieldType] = useState<string>('');
  const [disabledFieldTypeSelect, setDisbaledFieldTypeSelect] =
    useState<boolean>(false);
  const [hasMultipleFields, setHasMultipleFields] = useState<boolean>(false);

  useEffect(() => {
    setHasMultipleFields(formFields.length > 0);
  }, [formFields]);

  const canShowSavedFields = formFields.length > 0;
  const handleAddField = (properties: FieldProperties) => {
    onAddField(properties);
    setDisbaledFieldTypeSelect(false);
    setSelectedFieldType('');
    onDisableButton(false);
  };

  const handleDeleteField = (fieldType: string) => {
    onDelete(fieldType);
  };
  const handleUpdateField = (updatedField: FieldProperties) => {
    onUpdate(updatedField);
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
      <Dropdown className="mb-4">
        <Dropdown.Toggle
          variant="primary"
          id="dropdown-field-types"
          disabled={disabledFieldTypeSelect}
        >
          Add field type
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
