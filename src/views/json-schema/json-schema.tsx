import { FC } from 'react';
import { FieldProperties } from '../../types';

interface JsonSchemaProps {
  forms: FieldProperties[];
}

const JsonSchemaView: FC<JsonSchemaProps> = ({ forms }) => {
  return (
    <div>
      <pre>
        <code>{JSON.stringify({ forms }, null, 2)}</code>
      </pre>
    </div>
  );
};

export default JsonSchemaView;
