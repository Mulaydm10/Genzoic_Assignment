// Market Pulse app doesn't need user storage
// This is a placeholder storage interface for future use

export interface IStorage {
  // Placeholder for future storage needs
}

export class MemStorage implements IStorage {
  constructor() {
    // Placeholder implementation
  }
}

export const storage = new MemStorage();
