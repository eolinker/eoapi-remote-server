export default class Page<T> {
  records: Array<T>;

  pageNumber: number;

  pageSize: number;

  pageCount: number;

  total: number;

  constructor(
    pageNumber: number,
    pageSize: number,
    total: number,
    records: Array<T>,
  ) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.total = total;
    this.records = records;
    this.pageCount = Math.ceil(total / pageSize);
  }
}
