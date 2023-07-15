import React, { FC } from 'react';
import { Dropdown } from 'react-bootstrap';

interface FieldSelectorProps {
  onSelectField: (fieldType: string) => void;
  fieldTypes: string[];
}

const FieldSelector: FC<FieldSelectorProps> = ({
  onSelectField,
  fieldTypes,
}) => {
  const handleFieldSelection = (fieldType: string) => {
    onSelectField(fieldType);
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-field-types">
          Select a field type
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {fieldTypes.map((fieldType) => (
            <Dropdown.Item
              key={fieldType}
              onClick={() => handleFieldSelection(fieldType)}
            >
              {fieldType}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default FieldSelector;
