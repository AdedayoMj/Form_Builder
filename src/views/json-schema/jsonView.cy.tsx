import React from 'react';
import { mount } from 'cypress/react18';
import JsonSchemaView from './json-schema';
import { mockGenData } from 'src/Utils/utils';

describe('JsonSchemaView', () => {
  it('renders the JSON schema view with the form generator data', () => {
    mount(<JsonSchemaView formGen={mockGenData} />);

    cy.contains(JSON.stringify({ formGen: mockGenData }, null, 2)).should(
      'exist'
    );
  });

  it('renders the "No json preview" message when formGen is null', () => {
    mount(<JsonSchemaView formGen={null} />);

    // Assert that the "No json preview" message is displayed
    cy.contains('div', 'No json preview').should('exist');
  });
});
