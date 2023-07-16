import React from 'react';
import { FieldProperties, OptionType } from '../../types';
import { Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

interface FormPreviewProps {
  forms: FieldProperties[];
}

const FormPreview: React.FC<FormPreviewProps> = ({ forms }) => {
  const capitalizeFirstLetter = (text: string) => {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderField = (field: FieldProperties) => {
    const { fieldType, options, validations, required, multipleUploads } =
      field;
    const minValidation = validations?.find(
      (validation) => validation.name === 'minLength'
    );
    const maxValidation = validations?.find(
      (validation) => validation.name === 'maxLength'
    );
    const regexValidation = validations?.find(
      (validation) => validation.name === 'regex'
    );
    switch (fieldType) {
      case 'text':
        return (
          <FormControl
            type="text"
            min={minValidation?.value}
            max={maxValidation?.value}
            pattern={regexValidation?.value}
            required={required}
          />
        );
      case 'radio':
        return (
          <div>
            {options?.map((option: OptionType) => (
              <Form.Check
                key={option.name}
                type="radio"
                name={field.fieldId}
                value={option.name}
                label={option.name}
                required={required}
              />
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div>
            {options?.map((option: OptionType) => (
              <Form.Check
                key={option.name}
                type="checkbox"
                name={field.fieldId}
                value={option.name}
                label={option.name}
                required={required}
              />
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <Form.Select required={required}>
            {options?.map((option: OptionType) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </Form.Select>
        );
      case 'file':
        return (
          <FormControl
            type="file"
            required={required}
            multiple={multipleUploads}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mb-4" data-cy="preview-form">
      <Form>
        {forms.map((field: FieldProperties) => (
          <FormGroup key={field.fieldId} className="mb-3" data-cy="form-field">
            <FormLabel className="fw-bold" htmlFor={field.fieldId}>
              {capitalizeFirstLetter(field.labelName)}
            </FormLabel>
            {renderField(field)}
          </FormGroup>
        ))}
      </Form>
    </div>
  );
};

export default FormPreview;
