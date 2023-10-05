/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Model, Aggregate, Query as MongooseQuery } from "mongoose";

interface QueryOptions {
  filterField?: string;
  filterValue?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  page?: string;
  limit?: string;
  unwindField?: string;
  projectFields?: string;
}

export class ApiFeatures<T extends Document> {
  query: MongooseQuery<Array<T | any>, T> | Aggregate<Array<T | any>>;

  constructor(
    query: Model<T, {}> | MongooseQuery<Array<T | any>, T>,
    options: QueryOptions
  ) {
    if (this.isModel(query)) {
      this.query = (query as Model<T>).aggregate();
    } else {
      this.query = query;
    }

    this.filter(options.filterField, options.filterValue);
    this.sort(options.sortField, options.sortOrder);
    this.limitFields(options.fields);
    this.paginate(options.page, options.limit);

    if (options.unwindField) {
      this.unwind(options.unwindField);
    }

    if (options.projectFields) {
      this.project(options.projectFields);
    }
  }

  private isModel(arg: any): arg is Model<T> {
    return arg instanceof Model;
  }

  filter(field?: string, value?: string): ApiFeatures<T> {
    if (field && value) {
      (this.query as Aggregate<Array<T | any>>).match({ [field]: value });
    }
    return this;
  }

  sort(field?: string, order?: "asc" | "desc"): ApiFeatures<T> {
    if (field && order) {
      (this.query as Aggregate<Array<T | any>>).sort({
        [field]: order === "desc" ? -1 : 1,
      });
    }
    return this;
  }

  limitFields(fields?: string): ApiFeatures<T> {
    if (fields) {
      const fieldArray = fields.split(",").map((field) => field.trim());
      (this.query as Aggregate<Array<T | any>>).project(
        fieldArray.reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
      );
    }
    return this;
  }

  paginate(page?: string, limit?: string): ApiFeatures<T> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNumber - 1) * limitNumber;
    (this.query as MongooseQuery<Array<T | any>, T>)
      .skip(skip)
      .limit(limitNumber);
    return this;
  }

  unwind(field: string): ApiFeatures<T> {
    if (field) {
      (this.query as Aggregate<Array<T | any>>).unwind(field);
    }
    return this;
  }

  project(fields?: string): ApiFeatures<T> {
    if (fields) {
      const fieldArray = fields.split(",").map((field) => field.trim());
      const projection: Record<string, number> = {};

      // Include specified fields in the projection
      fieldArray.forEach((field) => {
        projection[field] = 1;
      });

      // Include virtual properties in the projection
      const model = (this.query as any)._model;
      if (model) {
        model.schema.eachPath((path: string) => {
          if (model.schema.virtuals[path]) {
            projection[path] = 1;
          }
        });
      }

      (this.query as Aggregate<Array<T | any>>).project(projection);
    }
    return this;
  }

  async execute(): Promise<Array<T | any>> {
    return (this.query as MongooseQuery<Array<T | any>, T>).exec();
  }
}
