import { FormGenerator } from 'src/types';

export const mockForms = [
  {
    fieldId: '1',
    labelName: 'First Name',
    fieldType: 'text',
    validations: [],
    required: true,
  },
  {
    fieldId: '2',
    labelName: 'Gender',
    fieldType: 'radio',
    options: [{ name: 'Male' }, { name: 'Female' }, { name: 'Other' }],
    required: true,
  },
  {
    fieldId: '3',
    labelName: 'Color',
    fieldType: 'dropdown',
    options: [{ name: 'Red' }, { name: 'Green' }, { name: 'Blue' }],
    required: true,
  },
];
export const mockGenData: FormGenerator = {
  formId: '1',
  formTitle: 'Personal Data',
  forms: mockForms,
};
