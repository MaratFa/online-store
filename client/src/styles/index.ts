
// Export all global styles
import './globals.css';
import './variables.css';

// Export any style-related utilities
export const applyTheme = (theme: string): void => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const getCSSVariable = (variableName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName);
};
