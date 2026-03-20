export class NoticesState {
  private static readonly STORAGE_KEY = 'final-testament-proof-i-lived-settings';

  // Get notices collapse state from localStorage
  static isExpanded(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return true;
    try {
      const settings = JSON.parse(saved) as Record<string, any>;
      return settings.noticesExpanded !== false;
    } catch {
      return true;
    }
  }

  // Save notices collapse state to localStorage
  static setExpanded(expanded: boolean): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    let settings: Record<string, any> = {};
    if (saved) {
      try {
        settings = JSON.parse(saved);
      } catch {
        settings = {};
      }
    }
    settings.noticesExpanded = expanded;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  // Toggle and return new state
  static toggle(): boolean {
    const newState = !this.isExpanded();
    this.setExpanded(newState);
    return newState;
  }
}
