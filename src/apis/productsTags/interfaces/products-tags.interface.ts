export interface IProductServiceFindByNames {
  tagNames: string[];
}

export interface IProductsTagsServiceBulkInsert {
  names: {
    name: string;
  }[];
}
