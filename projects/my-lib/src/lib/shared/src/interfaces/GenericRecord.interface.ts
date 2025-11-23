/**
 * Interface for a generic record, useful for type safety.
 * You might want to define more specific interfaces for each module (e.g., User, Product).
 */
export interface NzGenericRecord {
  id?: number; // Optional ID for records, especially for creation
  [key: string]: any; // Allow any other properties
}
