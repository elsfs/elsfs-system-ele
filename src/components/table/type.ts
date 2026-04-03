/** 表格行数据接口 */
export interface TableRow {
  /** 行数据的唯一标识，默认为 id */
  [rowKey: string]: any;
}

export interface TableColumn {
  /** 对应列的字段名 */
  prop: string;
  /** 显示的标题 */
  label: string;
  /** 自定义列模板的插槽名 */
  slot?: string;
  /** 对应列的宽度 */
  width?: number | string;
  /** 对齐方式 */
  align?: 'center' | 'left' | 'right';
  /** 列是否固定在左侧或者右侧 */
  fixed?: 'left' | 'right' | boolean;
  /** 对应列是否可以排序 */
  sortable?: boolean;
  /** 用来格式化内容 */
  formatter?: (row: TableRow, column: TableColumn) => string;
  /** 支持其他 el-table-column 的属性 */
  [key: string]: any;
  /** 自定义渲染函数 */
  render?: (scope: { index: number; row: TableRow }) => any;
}

export interface BasisTableProps {
  columns: any[];
  data: any[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  height?: number | string;
  showToolbar?: boolean; // 是否显示工具栏
}
