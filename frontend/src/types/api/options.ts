export interface OptionValue {
  value_id: number;
  value_name: string;
}

export interface OptionGroup {
  option_id: number;
  option_name: string;
  values: OptionValue[];
}

export interface OptionResponse {
  options: OptionGroup[];
}
