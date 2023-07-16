import React, { FC } from 'react';
import { FormGenerator } from '../../types';

interface JsonSchemaProps {
  formGen: FormGenerator | null;
}

const JsonSchemaView: FC<JsonSchemaProps> = ({ formGen }) => {
  if (!formGen) {
    return <div> No json preview</div>;
  }
  return (
    <div>
      <pre>
        <code>{JSON.stringify({ formGen }, null, 2)}</code>
      </pre>
    </div>
  );
};

export default JsonSchemaView;
