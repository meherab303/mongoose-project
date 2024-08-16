import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }

  partialSearch(searchTermField: string[]) {
    const searchTerm = this?.query?.searchTerm || "";
    if (searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: searchTermField.map((field) => {
          const orExpressions = {
            [field]: {
              $regex: searchTerm,
              $options: "i",
            },
          } as FilterQuery<T>;
          return orExpressions;
        }),
      });
    }
    return this;
  }
  queryFilter() {
    const copyBaseQuery = { ...this?.query };
    const excludeField = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeField.forEach((elem) => delete copyBaseQuery[elem]);
    this.queryModel = this.queryModel.find(copyBaseQuery as FilterQuery<T>);
    return this;
  }
  querySorting() {
    const sort =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.queryModel = this.queryModel.sort(sort);
    return this;
  }
  paginated() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 1;
    const skip = (page - 1) * limit;
    this.queryModel = this.queryModel.skip(skip).limit(limit);
    return this;
  }
  fieldLimiting() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.queryModel = this.queryModel.select(fields);
    return this;
  }
  async countTotal() {
    const totalQuery = this.queryModel.getFilter();
    const totalDocuments =
      await this.queryModel.model.countDocuments(totalQuery);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 1;
    const totalPage = Math.ceil(totalDocuments / limit);
    return {
      page,
      limit,
      totalDocuments,
      totalPage,
    };
  }
}
export default QueryBuilder;
