import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldProperties, FormGenerator } from '../../types';

interface FormFieldsState {
  allForms: FormGenerator[];
}

const initialState: FormFieldsState = {
  allForms: [],
};

const formFieldsSlice = createSlice({
  name: 'formFields',
  initialState,
  reducers: {
    addFormField: (
      state,
      action: PayloadAction<{ formId: string; formFields: FieldProperties[] }>
    ) => {
      const { formId, formFields } = action.payload;
      const newForm = { formId: formId, forms: formFields };
      state.allForms.push(newForm);
    },
    removeForm: (state, action: PayloadAction<string>) => {
      const formId = action.payload;
      state.allForms = state.allForms.filter((form) => form.formId !== formId);
    },
    editForm: (
      state,
      action: PayloadAction<{ formId: string; forms: FieldProperties[] }>
    ) => {
      const { formId, forms } = action.payload;

      const formIndex = state.allForms.findIndex(
        (form) => form.formId === formId
      );
      if (formIndex !== -1) {
        state.allForms[formIndex].forms = forms;
      }
    },
    removeAllForms: (state) => {
      state.allForms = [];
    },
  },
});

export const { addFormField, removeForm, editForm, removeAllForms } =
  formFieldsSlice.actions;
export default formFieldsSlice.reducer;
