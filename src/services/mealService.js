// Meal Service
// Handles automatic meal declarations and counting

import { getDefaultLunchConsumers, getDefaultDinnerConsumers, getEmployeeByEmail } from './employeeDatabase';
import { vacationService } from './vacationService';
import { authService } from './authService';

export const mealService = {
  // Get tomorrow's date
  getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  },

  // Get today's date
  getTodayDate() {
    return new Date().toISOString().split('T')[0];
  },

  // Initialize default meal declarations for tomorrow
  // This should be called daily at 22:00 (10 PM)
  initializeDefaultMeals(date) {
    const lunchConsumers = getDefaultLunchConsumers();
    const dinnerConsumers = getDefaultDinnerConsumers();

    const declarations = [];

    // Create declarations for all default consumers
    const allEmployees = new Set([
      ...lunchConsumers.map(e => e.id),
      ...dinnerConsumers.map(e => e.id)
    ]);

    allEmployees.forEach(employeeId => {
      const employee = [...lunchConsumers, ...dinnerConsumers].find(e => e.id === employeeId);
      
      if (!employee) return;

      // Skip if employee is on vacation
      if (vacationService.isEmployeeOnVacation(employeeId)) {
        return;
      }

      const declaration = {
        id: `default_${employeeId}_${date}`,
        employeeId: employee.id,
        name: employee.name,
        date: date,
        lunch: employee.defaultLunch,
        dinner: employee.defaultDinner,
        type: 'delfiv-meal',
        isDefault: true, // Mark as default declaration
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      declarations.push(declaration);
    });

    return declarations;
  },

  // Get meal counts for a specific date
  getMealCounts(date, declarations) {
    const filtered = declarations.filter(d => d.date === date);
    
    const lunchCount = filtered.filter(d => d.lunch === true).length;
    const dinnerCount = filtered.filter(d => d.dinner === true).length;

    return {
      lunch: lunchCount,
      dinner: dinnerCount
    };
  },

  // Check if employee has already declared for a date
  hasEmployeeDeclared(employeeId, date, declarations) {
    return declarations.some(d => 
      d.employeeId === employeeId && 
      d.date === date
    );
  },

  // Update or create meal declaration for current user
  declareMeal(employeeId, date, lunch, dinner) {
    // This will be saved through the existing storage.saveDeclaration()
    // Just return the formatted declaration
    const currentUser = authService.getCurrentUser();
    
    return {
      employeeId: employeeId,
      name: currentUser.name,
      date: date,
      lunch: lunch,
      dinner: dinner,
      type: 'delfiv-meal',
      isDefault: false
    };
  },

  // Get meal declaration for employee on specific date
  getEmployeeMealDeclaration(employeeId, date, declarations) {
    return declarations.find(d => 
      d.employeeId === employeeId && 
      d.date === date
    );
  },

  // Check if employee can have dinner (residential only)
  canEmployeeHaveDinner(employeeId) {
    const currentUser = authService.getCurrentUser();
    return currentUser && currentUser.residential;
  }
};