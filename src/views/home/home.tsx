import React, { FC, useState } from 'react';
import { Button, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import FormBuilderWizard from '../../components/form-builder-wizzard/index.tsx';
import JsonSchemaView from '../json-schema/json-schema';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';
import { FieldProperties, FormGenerator } from '../../types';
import FormPreview from '../preview/preview';
import { removeAllForms, removeForm } from '../../store/slice/form-field-slice';

const HomePage: FC = () => {
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const allForms = useSelector((state: RootState) => state.forms.allForms);
  const [selectedForm, setSelectedForm] = useState<FieldProperties[]>([]);
  const [selectedFormGenerator, setSelectedFormGenerator] =
    useState<FormGenerator | null>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteDialogModal, setDeleteDialogModal] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const dispatch = useDispatch();

  const isFormInStorage = allForms.length > 0;

  const handleRemoveAllForms = () => {
    if (isFormInStorage) {
      setIsDeleteAll(true);
      setDeleteDialogModal(true);
    }
  };

  const handleAddForm = () => {
    setShowFormBuilder(true);
  };

  const handleCloseFormBuilder = () => {
    setShowFormBuilder(false);
    setSelectedForm([]);
  };

  const handleSaveForm = () => {
    setShowFormBuilder(false);
  };

  const handleFormClick = (forms: FieldProperties[]) => {
    setSelectedForm(forms);
    setShowJsonModal(true);
  };

  const handlePreviewClick = (forms: FieldProperties[]) => {
    setSelectedForm(forms);
    setShowPreviewModal(true);
  };

  const handleEditForms = (formGenerator: FormGenerator) => {
    setSelectedFormGenerator(formGenerator);
    setShowFormBuilder(true);
  };
  const handleDeleteForm = (formGenerator: FormGenerator) => {
    setSelectedFormGenerator(formGenerator);
    setDeleteDialogModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFormGenerator && !isDeleteAll) {
      dispatch(removeForm(selectedFormGenerator.formId));
      setSelectedFormGenerator(null);
      setDeleteDialogModal(false);
    }

    if (isDeleteAll && isFormInStorage) {
      setDeleteDialogModal(false);
      setIsDeleteAll(false);
      dispatch(removeAllForms());
    }
  };
  const handleCloseJsonModal = () => {
    setSelectedForm([]);
    setShowJsonModal(false);
  };

  const handleClosePreviewModal = () => {
    setSelectedForm([]);
    setShowPreviewModal(false);
  };

  const handleCloseDeleteModal = () => {
    setSelectedFormGenerator(null);
    setDeleteDialogModal(false);
  };

  return (
    <div className="container ">
      <div className="d-flex justify-content-between align-items-center">
        <Button className="mt-4" onClick={handleAddForm}>
          Add Form
        </Button>
        <Button
          className="mt-4"
          onClick={handleRemoveAllForms}
          disabled={!isFormInStorage}
        >
          Delete All
        </Button>
      </div>

      {showFormBuilder && (
        <FormBuilderWizard
          onClose={handleCloseFormBuilder}
          onSave={handleSaveForm}
          onShow={showFormBuilder}
          formsGen={selectedFormGenerator}
        />
      )}
      <div className="mt-4">
        <h3>All Forms</h3>
        <ListGroup>
          {allForms.map((formGenerator: FormGenerator) => (
            <ListGroupItem key={formGenerator.formId}>
              <div className="d-flex justify-content-between align-items-center">
                <span>Form ID: {formGenerator.formId}</span>
                <div>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => handleFormClick(formGenerator.forms)}
                  >
                    View JSON
                  </Button>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => handlePreviewClick(formGenerator.forms)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="dark"
                    className="me-2"
                    onClick={() => handleEditForms(formGenerator)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteForm(formGenerator)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
      {showJsonModal && (
        <Modal show={showJsonModal} onHide={handleCloseJsonModal}>
          <Modal.Header closeButton>
            <Modal.Title>JSON Format</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <JsonSchemaView forms={selectedForm} />
          </Modal.Body>
        </Modal>
      )}
      {showPreviewModal && (
        <Modal show={showPreviewModal} onHide={handleClosePreviewModal}>
          <Modal.Header closeButton>
            <Modal.Title>Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormPreview forms={selectedForm} />
          </Modal.Body>
        </Modal>
      )}
      {showDeleteDialogModal && (
        <Modal show={showDeleteDialogModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton />
          <Modal.Body>
            <div className="container">
              {isDeleteAll ? (
                <div>Do you want to delete all forms?</div>
              ) : (
                <div>
                  Are you sure you want to delete form with ID:{' '}
                  <strong>{selectedFormGenerator?.formId}</strong>?
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Confirm
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
