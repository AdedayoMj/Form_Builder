import React, { FC } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';

interface FormFieldsProps {
  formFields: any[];
  fieldType: string;
  onRemoveField: (fieldType: string) => void;
  onAddOption: (fieldType: string) => void;
  onOptionChange: (
    fieldType: string,
    optionIndex: number,
    optionValue: string
  ) => void;
}

const FormFields: FC<FormFieldsProps> = ({
  formFields,
  fieldType,
  onRemoveField,
  onAddOption,
  onOptionChange,
}) => {
  const renderField = (field: any) => {
    switch (field.fieldType) {
      case 'text':
        return <Form.Control type="text" />;
      case 'radio':
        return (
          <Form.Group>
            {field.options.map((option: string, index: number) => (
              <Form.Check
                key={index}
                type="radio"
                label={option}
                onChange={(e) =>
                  onOptionChange(field.fieldType, index, e.target.value)
                }
              />
            ))}
          </Form.Group>
        );
      case 'checkbox':
        return (
          <Form.Group>
            {field.options.map((option: string, index: number) => (
              <Form.Check
                key={index}
                type="checkbox"
                label={option}
                onChange={(e) =>
                  onOptionChange(field.fieldType, index, e.target.value)
                }
              />
            ))}
          </Form.Group>
        );
      case 'dropdown':
        return (
          <Form.Group>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Select an option
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {field.options.map((option: string, index: number) => (
                  <Dropdown.Item
                    key={index}
                    onSelect={() => onAddOption(field.fieldType)}
                  >
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        );
      // Add cases for other field types
      default:
        return null;
    }
  };

  return (
    <div>
      {renderField(fieldType)}
      <Button variant="danger" onClick={() => onRemoveField(fieldType)}>
        Remove Field
      </Button>
    </div>
  );
};

export default FormFields;
