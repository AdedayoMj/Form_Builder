import React from 'react';
import FormPreview from './preview';
import { mount } from 'cypress/react18';
import { mockForms } from 'src/Utils/utils';

describe('FormPreview', () => {
  beforeEach(() => {
    mount(<FormPreview forms={mockForms} />);
  });

  it('renders the form preview with the correct number of fields', () => {
    cy.get('[data-cy="preview-form"]').within(() => {
      cy.get('[data-cy="form-field"]').should('have.length', mockForms.length);
    });
  });

  it('renders the correct labels for each field', () => {
    cy.get('[data-cy="preview-form"]').within(() => {
      mockForms.forEach((field) => {
        cy.contains('label', field.labelName).should('exist');
      });
    });
  });
  it('renders the correct input elements for each field type', () => {
    cy.get('[data-cy="preview-form"]').within(() => {
      mockForms.forEach((field) => {
        let inputSelector;

        switch (field.fieldType) {
          case 'text':
            inputSelector = 'input[type="text"]';
            break;
          case 'radio':
            inputSelector = 'input[type="radio"]';
            break;
          case 'checkbox':
            inputSelector = 'input[type="checkbox"]';
            break;
          case 'file':
            inputSelector = 'input[type="file"]';
            break;
          default:
            break;
        }

        if (inputSelector) {
          cy.get(inputSelector).should('exist');
        }
      });
    });
  });

  it('renders the correct options for radio and dropdown fields', () => {
    cy.get('[data-cy="preview-form"]').within(() => {
      const radioField = mockForms.find((field) => field.fieldType === 'radio');
      const dropdownField = mockForms.find(
        (field) => field.fieldType === 'dropdown'
      );

      if (radioField?.options) {
        radioField.options.forEach((option) => {
          cy.get(
            'input[type="radio"][name="' +
              radioField.fieldId +
              '"][value="' +
              option.name +
              '"]'
          ).should('exist');
        });
      }

      if (dropdownField?.options) {
        dropdownField.options.forEach((option) => {
          cy.contains('option', option.name).should('exist');
        });
      }
    });
  });
});
