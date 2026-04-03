export interface FormConfig {
  labelWidth?: number | string;
  labelPosition?: 'left' | 'right' | 'top';
  size?: 'default' | 'large' | 'small';
  span?: number;
}

export interface FormItem {
  label: string;
  prop: string;
  component:
    | 'dept'
    | 'el-date-picker'
    | 'el-input'
    | 'el-input-number'
    | 'el-input-textarea'
    | 'el-radio-group'
    | 'el-select'
    | 'el-switch'
    | 'el-time-picker';
  componentProps?: {
    [key: string]: any;
    placeholder?: string;
  };
  rules?: any[];
  options?: Array<{
    label: string;
    value: any;
  }>;
  defaultValue?: any;
}
