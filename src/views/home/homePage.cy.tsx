import React from 'react';
import { mount } from 'cypress/react18';
import HomePage from './home';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

describe('HomePage', () => {
  beforeEach(() => {
    mount(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
  });
  it('renders without errors', () => {
    cy.get('.container').should('exist');
  });

  it('displays the "Add Form" button', () => {
    cy.contains('Add Form').should('be.visible');
  });

  it('opens the form builder wizard on "Add Form" button click', () => {
    cy.contains('Add Form').click();
    cy.get('[data-cy="form-wizzard"]').should('be.visible');
  });

  it('displays the list of forms', () => {
    cy.get('[data-cy="form-list"]').should('exist');
  });
});
