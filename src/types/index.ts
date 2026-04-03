export interface TableParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

export interface PostItem {
  createAt: string;
  updateAt: string;
  createBy: string;
  updateBy: string;
  deleteFlag: string;
  postId: string;
  postCode: string;
  postName: string;
  postRank: string;
  status: string;
  orderNo: number;
  remark: string;
}

export interface ApiResponse<T> {
  result: {
    current: number;
    pages: number;
    records: T[];
    size: number;
    total: number;
  };
  code?: number;
  message?: string;
}
