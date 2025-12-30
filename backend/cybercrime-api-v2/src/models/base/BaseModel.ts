/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class BaseModel {
  protected _data: Record<string, any>;

  constructor(data: Record<string, any>) {
    this._data = { ...data };
    this.validate();
  }

  /**
   * Override in child classes to define validation rules
   */
  protected abstract validate(): void;

  /**
   * Get property value
   */
  protected get<T>(key: string): T {
    return this._data[key] as T;
  }

  /**
   * Set property value
   */
  protected set(key: string, value: any): void {
    this._data[key] = value;
  }

  /**
   * Check if property exists
   */
  protected has(key: string): boolean {
    return key in this._data && this._data[key] !== undefined && this._data[key] !== null;
  }

  /**
   * Convert to plain object (for API responses)
   */
  toJSON(): Record<string, any> {
    return { ...this._data };
  }

  /**
   * Convert to database format (can be overridden)
   */
  toDatabase(): Record<string, any> {
    return this.toJSON();
  }
}
