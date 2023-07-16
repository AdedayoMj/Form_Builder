import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Dropdown,
  Col,
  Form as BootstrapForm,
  Row,
} from 'react-bootstrap';
import { FieldProperties, ValidationType } from '../../../types';

interface TextFieldProps {
  onAddField: (properties: FieldProperties) => void;
  fieldType: string;
  fieldState: string;
  fieldForm?: FieldProperties;
  hasMultipleFields?: boolean;
  onRemoveField?: (value: boolean) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  onAddField,
  fieldType,
  fieldState,
  fieldForm,
  hasMultipleFields,
  onRemoveField,
}) => {
  const [selectedValidation, setSelectedValidation] = useState('');

  const initialValues: FieldProperties = {
    fieldId: fieldForm?.fieldId || '',
    labelName: fieldForm?.labelName || '',
    required: fieldForm?.required || false,
    fieldType: fieldType,
    validations: fieldForm?.validations || [],
  };

  const validationSchema = Yup.object().shape({
    labelName: Yup.string().required('Label name is required.'),
    validations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Validation name is required.'),
        value: Yup.string().test({
          name: 'requiredValidationValue',
          message: 'Validation value is required.',
          test: function (value) {
            const validationName = this.parent.name;
            const isValidationType = [
              'minLength',
              'maxLength',
              'regex',
            ].includes(validationName);
            return (
              !isValidationType || (isValidationType && value !== undefined)
            );
          },
        }),
      })
    ),
  });

  const handleValidationSelect = (
    eventKey: string,
    values: FieldProperties,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setSelectedValidation(eventKey);
    handleAddValidation(eventKey, values, setFieldValue);
  };

  const handleAddValidation = (
    eventKey: string,
    values: FieldProperties,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (eventKey !== '') {
      const newValidation = { name: eventKey, value: '' };
      setFieldValue('validations', [
        ...(values.validations ?? []),
        newValidation,
      ]);
      setSelectedValidation('');
    }
  };

  const handleRemoveValidation = (
    values: FieldProperties,
    setFieldValue: (field: string, value: any) => void,
    index: number
  ) => {
    const updatedValidations = [...(values.validations ?? [])];
    updatedValidations.splice(index, 1);
    setFieldValue('validations', updatedValidations);
  };

  const renderValidations = (
    values: FieldProperties,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const handleValidationChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      name: string
    ) => {
      const { value } = event.target;
      const updatedValidations =
        values.validations &&
        values.validations.map((validation: ValidationType) => {
          if (validation.name === name) {
            return { ...validation, value };
          }
          return validation;
        });
      setFieldValue('validations', updatedValidations);
    };

    return (
      values.validations &&
      values.validations.map((validation: ValidationType, index: number) => {
        const key = `${index}_${validation.name}`;
        return (
          <Row key={key} className="mt-2">
            <Col sm={3}>
              <label className="align-items-center">{validation.name}</label>
            </Col>
            <Col sm={6}>
              <Field
                type="text"
                name={`validations[${index}].value`}
                className="form-control"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleValidationChange(event, validation.name)
                }
              />
              <ErrorMessage
                name={`validations[${index}].value`}
                component="p"
                className="text-danger"
              />
            </Col>
            <Col sm={2}>
              <button
                type="button"
                onClick={() =>
                  handleRemoveValidation(values, setFieldValue, index)
                }
                className="btn btn-danger"
              >
                Remove
              </button>
            </Col>
          </Row>
        );
      })
    );
  };

  const handleSubmit = (values: FieldProperties) => {
    const fieldProperties: FieldProperties = {
      ...values,
      fieldId: fieldState === 'create' ? uuidv4() : fieldForm?.fieldId || '',
    };
    onAddField(fieldProperties);
  };

  const validationOptions = [
    { value: '', label: 'Add Validation Rules' },
    { value: 'minLength', label: 'Minimum Length' },
    { value: 'maxLength', label: 'Maximum Length' },
    { value: 'regex', label: 'Regex' },
  ];

  const handleRemoveField = (resetForm: () => void) => {
    resetForm();
    onRemoveField?.(true);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, resetForm }) => (
        <Form className="mt-3">
          {hasMultipleFields && <hr className="my-4" />}
          <Row className="mb-3">
            <Col sm={7}>
              <BootstrapForm.Group>
                <Row>
                  <Col sm={4}>
                    <BootstrapForm.Label>Label</BootstrapForm.Label>
                  </Col>
                  <Col sm={8}>
                    <Field
                      type="text"
                      id="labelName"
                      name="labelName"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="labelName"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                </Row>
              </BootstrapForm.Group>
            </Col>
            <Col sm={5}>
              <BootstrapForm.Group>
                <Row>
                  <Col>
                    <BootstrapForm.Label>Required</BootstrapForm.Label>
                  </Col>
                  <Col>
                    <Field
                      type="checkbox"
                      id="required"
                      name="required"
                      className="form-check-input"
                    />
                  </Col>
                </Row>
              </BootstrapForm.Group>
            </Col>
          </Row>
          <div>
            <Dropdown className="mb-3">
              <Dropdown.Toggle
                variant="secondary"
                id="validationDropdown"
                disabled={validationOptions
                  .slice(1)
                  .every(
                    (option) =>
                      values.validations &&
                      values.validations.some(
                        (v: any) => v.name === option.value
                      )
                  )}
              >
                {selectedValidation ? selectedValidation : 'Add Validation'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {validationOptions.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    eventKey={option.value}
                    onClick={() =>
                      handleValidationSelect(
                        option.value,
                        values,
                        setFieldValue
                      )
                    }
                    disabled={
                      values.validations &&
                      values.validations.some(
                        (v: any) => v.name === option.value
                      )
                    }
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {values.validations && values.validations?.length > 0 && (
            <div>
              <div className="fw-normal fs-6">Validations Rules</div>
              <hr className="my-2" />
            </div>
          )}
          <div>{renderValidations(values, setFieldValue)}</div>

          {fieldState === 'create' ? (
            <div className="d-flex justify-content-between">
              <Button className="mt-4" type="submit" variant="primary">
                Save Field
              </Button>
              <Button
                className="mt-4"
                type="button"
                variant="danger"
                onClick={() => handleRemoveField(resetForm)}
              >
                Remove Field
              </Button>
            </div>
          ) : (
            <Button className="mt-4" type="submit" variant="primary">
              Edit Field
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default TextField;
