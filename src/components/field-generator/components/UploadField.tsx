import React from 'react';
import { FieldProperties } from '../../../types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, Form as BootstrapForm, Row } from 'react-bootstrap';

interface UploadFieldProps {
  onAddField: (properties: FieldProperties) => void;
  fieldType: string;
  fieldState: string;
  fieldForm?: FieldProperties;
  onRemoveField?: (value: boolean) => void;
  hasMultipleFields?: boolean;
}

const UploadField: React.FC<UploadFieldProps> = ({
  onAddField,
  fieldType,
  fieldState,
  fieldForm,
  onRemoveField,
  hasMultipleFields,
}) => {
  const initialValues: FieldProperties = {
    fieldId: fieldForm?.fieldId || '',
    labelName: fieldForm?.labelName || '',
    required: fieldForm?.required || false,
    fieldType: fieldType,
    multipleUploads: fieldForm?.multipleUploads || false,
  };

  const validationSchema = Yup.object().shape({
    labelName: Yup.string().required('Label name is required.'),
  });

  const handleSubmit = (values: any) => {
    const fieldProperties = {
      ...values,
      fieldId: fieldState === 'create' ? uuidv4() : fieldForm?.fieldId,
    };
    onAddField(fieldProperties);
  };

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
      {({ resetForm }) => (
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
          <Row className="mb-3">
            <Col sm={5}>
              <BootstrapForm.Group>
                <Row>
                  <Col>
                    <BootstrapForm.Label>Multiple Uploads</BootstrapForm.Label>
                  </Col>
                  <Col>
                    <Field
                      type="checkbox"
                      id="multipleUploads"
                      name="multipleUploads"
                      className="form-check-input"
                    />
                  </Col>
                </Row>
              </BootstrapForm.Group>
            </Col>
          </Row>
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

export default UploadField;
