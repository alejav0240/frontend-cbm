export interface MappedResource {
  id: string;
  title: string;
  type: string;
  category: string;
}

export interface MappedSubscale {
  id: string;
  name: string;
  maxScore: number;
}

export interface MappedScaleValue {
  id: string;
  label: string;
  value: number;
}

export interface MappedScale {
  id: string;
  name: string;
  description: string | null;
  type: string;
  subscales: MappedSubscale[];
  values: MappedScaleValue[];
}

export interface MappedFormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export interface MappedFormTemplate {
  id: string;
  name: string;
  description: string | null;
  fields: MappedFormField[];
}
