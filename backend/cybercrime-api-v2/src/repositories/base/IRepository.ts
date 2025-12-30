export interface IRepository<T> {
  findById(id: string | number): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string | number, entity: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  exists(id: string | number): Promise<boolean>;
}
