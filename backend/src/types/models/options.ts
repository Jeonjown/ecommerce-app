export interface OptionGroup {
  option_id: number;
  option_name: string;
  values: {
    value_id: number;
    value_name: string;
  }[];
}
