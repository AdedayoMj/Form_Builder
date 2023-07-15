import React from 'react';
import { FieldProperties } from '../../../types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form as BootstrapForm, Row } from 'react-bootstrap';

interface CheckboxFieldProps {
  onAddField: (properties: FieldProperties) => void;
  fieldType: string;
  fieldState: string;
  fieldForm?: FieldProperties;
  hasMultipleFields?: boolean;
  onRemoveField?: (value: boolean) => void;
}

const FieldWithOptions: React.FC<CheckboxFieldProps> = ({
  onAddField,
  fieldType,
  fieldState,
  fieldForm,
  hasMultipleFields,
  onRemoveField,
}) => {
  const initialValues: FieldProperties = {
    fieldId: fieldForm?.fieldId || '',
    labelName: fieldForm?.labelName || '',
    required: fieldForm?.required || false,
    fieldType: fieldType,
    options: fieldForm?.options || [{ name: '' }],
  };
  const validationSchema = Yup.object().shape({
    labelName: Yup.string().required('Label name is required.'),
    options: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required('Option name is required.'),
        })
      )
      .min(1, 'At least one option is required.'),
  });

  const handleSubmit = (values: any) => {
    const fieldProperties = {
      ...values,
      fieldId: fieldState === 'create' ? uuidv4() : fieldForm?.fieldId,
    };
    onAddField(fieldProperties);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, resetForm }) => {
        const handleAddOption = () => {
          const updatedOptions = (values.options || []).concat({ name: '' });
          setFieldValue('options', updatedOptions);
        };

        const handleOptionChange = (
          index: number,
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          if (values.options) {
            const updatedOptions = [...values.options];
            updatedOptions[index].name = event.target.value;
            setFieldValue('options', updatedOptions);
          }
        };

        const handleRemoveOption = (index: number) => {
          if (values.options && values.options.length > 1) {
            const updatedOptions = [...values.options];
            updatedOptions.splice(index, 1);
            setFieldValue('options', updatedOptions);
          }
        };

        const handleRemoveField = (resetForm: () => void) => {
          resetForm();
          onRemoveField?.(true);
        };

        return (
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
            <div className="mt-3 mb-4">
              <div>
                <div className="fw-normal fs-6">Field Options</div>
                <hr className="my-2" />
              </div>
              {values.options &&
                values.options.map((option: any, index: number) => (
                  <Row key={index} className="mt-2">
                    <Col sm={3}>
                      <label className="align-items-center">Label</label>
                    </Col>
                    <Col sm={6}>
                      <Field
                        type="text"
                        name={`options[${index}].name`}
                        className="form-control"
                        value={option.name}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => handleOptionChange(index, event)}
                      />

                      <ErrorMessage
                        name={`options[${index}].name`}
                        component="p"
                        className="text-danger"
                      />
                    </Col>
                    <Col sm={3}>
                      {values.options && values.options.length > 1 && (
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveOption(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
              <Button
                variant="secondary"
                className="mt-2"
                onClick={handleAddOption}
              >
                Add Options
              </Button>
            </div>
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
        );
      }}
    </Formik>
  );
};

export default FieldWithOptions;
