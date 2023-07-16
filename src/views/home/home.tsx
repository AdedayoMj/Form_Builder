import React, { FC, useState } from 'react';
import { Button, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import FormBuilderWizard from '../../components/form-builder-wizzard/index.tsx';
import JsonSchemaView from '../json-schema/json-schema';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FieldProperties, FormGenerator } from '../../types';
import FormPreview from '../preview/preview';
import { removeAllForms, removeForm } from '../../store/slice/form-field-slice';
import LoadingWave from '../../components/loading/index';

const HomePage: FC = () => {
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const allForms = useSelector((state: RootState) => state.forms.allForms);
  const loading = useSelector((state: RootState) => state.forms.loading);
  const [selectedForm, setSelectedForm] = useState<FieldProperties[]>([]);
  const [selectedJsonPreview, setSelectedJsonPreview] =
    useState<FormGenerator | null>(null);
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
    resetStates();
  };

  const handleSaveForm = () => {
    setShowFormBuilder(false);
  };

  const handlePreviewClick = (forms: FieldProperties[]) => {
    setSelectedForm(forms);
    setShowPreviewModal(true);
  };

  const handleJsonClick = (formGen: FormGenerator) => {
    setSelectedJsonPreview(formGen);
    setShowJsonModal(true);
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
    resetStates();
    setShowJsonModal(false);
  };

  const handleClosePreviewModal = () => {
    resetStates();
    setShowPreviewModal(false);
  };

  const handleCloseDeleteModal = () => {
    resetStates();
    setDeleteDialogModal(false);
  };
  const resetStates = () => {
    setSelectedForm([]);
    setSelectedJsonPreview(null);
    setSelectedFormGenerator(null);
  };

  return (
    <>
      <div className="container ">
        {loading && <LoadingWave />}

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
          <ListGroup data-cy="form-list">
            {allForms.map((formGenerator: FormGenerator) => (
              <ListGroupItem
                key={formGenerator.formId}
                data-cy={`form-item-${formGenerator.formId}`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span> {formGenerator.formTitle}</span>
                  <div>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleJsonClick(formGenerator)}
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
                      data-cy={`delete-form-${formGenerator.formId}`}
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
              <JsonSchemaView formGen={selectedJsonPreview} />
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
    </>
  );
};

export default HomePage;
