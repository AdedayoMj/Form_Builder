import React, { FC, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FieldProperties, FormGenerator } from '../../types';
import { useDispatch } from 'react-redux';
import { addFormField, editForm } from '../../store/slice/form-field-slice';
import { v4 as uuidv4 } from 'uuid';
import { default as FormWizzard } from '../field-generator';

interface FormBuilderWizardProps {
  onClose: () => void;
  onSave: () => void;
  onShow: boolean;
  formsGen?: FormGenerator | null;
}

const FormBuilderWizard: FC<FormBuilderWizardProps> = ({
  onClose,
  onSave,
  onShow,
  formsGen,
}) => {
  const [formFields, setFormFields] = useState<FieldProperties[]>([]);
  const [disableSaveButton, setSetDisableSaveButton] = useState(true);

  const dispatch = useDispatch();
  const fieldTypes = ['text', 'radio', 'checkbox', 'dropdown', 'file'];

  const handleAddField = (fieldProperties: FieldProperties) => {
    setFormFields((prevFields) => [...prevFields, fieldProperties]);
  };

  const handleSaveForms = () => {
    const formId = formsGen ? formsGen.formId : uuidv4();
    console.log(formFields);

    console.log(formId);

    if (formsGen) {
      // Update existing form
      dispatch(editForm({ formId: formId, forms: formFields }));
    } else {
      // Add new form
      dispatch(addFormField({ formId, formFields: formFields }));
    }
    onSave();
  };

  const handleDeleteField = (fieldId: string) => {
    setFormFields((prevFields) =>
      prevFields.filter((field) => field.fieldId !== fieldId)
    );
  };

  const handleUpdateField = (updatedField: FieldProperties) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.fieldId === updatedField.fieldId ? updatedField : field
      )
    );
  };

  const EnableSaveButon = (value: boolean) => {
    setSetDisableSaveButton(value);
  };

  useEffect(() => {
    if (formsGen?.forms) {
      setFormFields(formsGen.forms);
      setSetDisableSaveButton(false);
    }
  }, [formsGen?.forms]);

  return (
    <Modal show={onShow} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Form Generator</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <FormWizzard
            fieldTypes={fieldTypes}
            onAddField={handleAddField}
            formFields={formFields}
            onDelete={handleDeleteField}
            onUpdate={handleUpdateField}
            onDisableButton={EnableSaveButon}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSaveForms}
          disabled={disableSaveButton}
        >
          {formsGen ? 'Edit Form' : 'Save Form'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormBuilderWizard;
