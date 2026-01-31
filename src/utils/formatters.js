/**
 * Professional Weather Utility Functions
 * These handle data transformation for the UI.
 */

// Converts Celsius to Fahrenheit if the user wants to toggle units
export const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9) / 5 + 32);
};

// Formats the current date for the dashboard header
export const getFormattedDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

// Simple logger to track API pulse in the console
export const logWeatherUpdate = (city, temp) => {
  console.log(`[Pulse System] Update received for ${city}: ${temp}°C`);
};