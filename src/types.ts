interface ValidationType {
  name: string;
  value: any;
}

interface OptionType {
  name: string;
}

interface FieldProperties {
  fieldId: string;
  fieldType: string;
  labelName: string;
  required: boolean;
  validations?: ValidationType[];
  options?: OptionType[];
  multipleUploads?: boolean;
}

interface FormGenerator {
  forms: FieldProperties[];
  formId: string;
  formTitle: string;
}

export type { FieldProperties, FormGenerator, OptionType, ValidationType };
