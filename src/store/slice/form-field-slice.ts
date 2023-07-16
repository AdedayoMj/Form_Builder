import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldProperties, FormGenerator } from '../../types';

interface FormFieldsState {
  allForms: FormGenerator[];
  loading: boolean;
}

const initialState: FormFieldsState = {
  allForms: [],
  loading: false,
};

const formFieldsSlice = createSlice({
  name: 'formFields',
  initialState,
  reducers: {
    addFormField: (
      state,
      action: PayloadAction<{
        formId: string;
        formTitle: string;
        formFields: FieldProperties[];
      }>
    ) => {
      state.loading = true;
      try {
        const { formId, formTitle, formFields } = action.payload;
        const newForm = {
          formId: formId,
          formTitle: formTitle,
          forms: formFields,
        };
        state.allForms.push(newForm);
      } catch (error) {
        console.error('Adding form:', error);
      } finally {
        state.loading = false;
      }
    },
    removeForm: (state, action: PayloadAction<string>) => {
      state.loading = true;
      try {
        const formId = action.payload;
        state.allForms = state.allForms.filter(
          (form) => form.formId !== formId
        );
      } catch (error) {
        console.error('Removing form:', error);
      } finally {
        state.loading = false;
      }
    },
    editForm: (
      state,
      action: PayloadAction<{
        formId: string;
        formTitle: string;
        forms: FieldProperties[];
      }>
    ) => {
      state.loading = true;
      try {
        const { formId, forms, formTitle } = action.payload;
        console.log(formTitle);

        const formIndex = state.allForms.findIndex(
          (form) => form.formId === formId
        );
        if (formIndex !== -1) {
          state.allForms[formIndex].forms = forms;
          state.allForms[formIndex].formTitle = formTitle;
        }
      } catch (error) {
        console.error('Editing form:', error);
      } finally {
        state.loading = false;
      }
    },
    removeAllForms: (state) => {
      state.loading = true;
      try {
        state.allForms = [];
      } catch (error) {
        console.error('Removing all forms:', error);
      } finally {
        state.loading = false;
      }
    },
  },
});

export const { addFormField, removeForm, editForm, removeAllForms } =
  formFieldsSlice.actions;
export default formFieldsSlice.reducer;
