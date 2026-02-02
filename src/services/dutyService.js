// Duty Rotation Service
// Handles automatic rotation of cleaning duties

import { getEmployeesWithDailyCleaning, getEmployeesWithBathroomCleaning } from './employeeDatabase';
import { vacationService } from './vacationService';

const DUTY_KEY = 'delfiv_duties';
const ROTATION_KEY = 'delfiv_rotation_state';

export const dutyService = {
  // Get all duties
  getAllDuties() {
    try {
      const data = localStorage.getItem(DUTY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading duties:', error);
      return [];
    }
  },

  // Get rotation state
  getRotationState() {
    try {
      const data = localStorage.getItem(ROTATION_KEY);
      return data ? JSON.parse(data) : {
        dailyCleaningIndex: 0,
        bathroomCleaningIndex: 0,
        lastDailyRotation: null,
        lastBathroomRotation: null
      };
    } catch (error) {
      return {
        dailyCleaningIndex: 0,
        bathroomCleaningIndex: 0,
        lastDailyRotation: null,
        lastBathroomRotation: null
      };
    }
  },

  // Save rotation state
  saveRotationState(state) {
    localStorage.setItem(ROTATION_KEY, JSON.stringify(state));
  },

  // Get available employees (not on vacation)
  getAvailableEmployees(employeeList) {
    return employeeList.filter(emp => !vacationService.isEmployeeOnVacation(emp.id));
  },

  // Assign daily cleaning duty
  assignDailyCleaningDuty() {
    const employees = getEmployeesWithDailyCleaning();
    const availableEmployees = this.getAvailableEmployees(employees);
    
    if (availableEmployees.length === 0) {
      console.warn('No available employees for daily cleaning');
      return null;
    }

    const state = this.getRotationState();
    const today = new Date().toISOString().split('T')[0];

    // Check if already assigned today
    const existingDuty = this.getDutyForDate(today, 'daily-cleaning');
    if (existingDuty) {
      return existingDuty;
    }

    // Get next employee in rotation
    let index = state.dailyCleaningIndex % availableEmployees.length;
    const assignedEmployee = availableEmployees[index];

    // Create duty
    const duty = {
      id: Date.now().toString(),
      type: 'daily-cleaning',
      employeeId: assignedEmployee.id,
      employeeName: assignedEmployee.name,
      date: today,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save duty
    const duties = this.getAllDuties();
    duties.push(duty);
    localStorage.setItem(DUTY_KEY, JSON.stringify(duties));

    // Update rotation state
    state.dailyCleaningIndex = (index + 1) % availableEmployees.length;
    state.lastDailyRotation = today;
    this.saveRotationState(state);

    return duty;
  },

  // Assign bathroom cleaning duty (every Tuesday, every 15 days)
  assignBathroomCleaningDuty() {
    const employees = getEmployeesWithBathroomCleaning();
    const availableEmployees = this.getAvailableEmployees(employees);
    
    if (availableEmployees.length === 0) {
      console.warn('No available employees for bathroom cleaning');
      return null;
    }

    const state = this.getRotationState();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Check if it's Tuesday (2 = Tuesday in getDay())
    if (today.getDay() !== 2) {
      return null; // Not Tuesday
    }

    // Check if bathroom cleaning is due (every 15 days)
    if (state.lastBathroomRotation) {
      const lastDate = new Date(state.lastBathroomRotation);
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 15) {
        return null; // Not yet time for bathroom cleaning
      }
    }

    // Check if already assigned today
    const existingDuty = this.getDutyForDate(todayStr, 'bathroom-cleaning');
    if (existingDuty) {
      return existingDuty;
    }

    // Get next employee in rotation
    let index = state.bathroomCleaningIndex % availableEmployees.length;
    const assignedEmployee = availableEmployees[index];

    // Create duty
    const duty = {
      id: Date.now().toString(),
      type: 'bathroom-cleaning',
      employeeId: assignedEmployee.id,
      employeeName: assignedEmployee.name,
      date: todayStr,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save duty
    const duties = this.getAllDuties();
    duties.push(duty);
    localStorage.setItem(DUTY_KEY, JSON.stringify(duties));

    // Update rotation state
    state.bathroomCleaningIndex = (index + 1) % availableEmployees.length;
    state.lastBathroomRotation = todayStr;
    this.saveRotationState(state);

    return duty;
  },

  // Assign kitchen duties
  assignKitchenDuty(employeeId, dutyType) {
    const today = new Date().toISOString().split('T')[0];

    const duty = {
      id: Date.now().toString(),
      type: dutyType, // 'wash-dishes', 'buy-bread', 'clean-kitchen-floor'
      employeeId,
      date: today,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const duties = this.getAllDuties();
    duties.push(duty);
    localStorage.setItem(DUTY_KEY, JSON.stringify(duties));

    return duty;
  },

  // Get duty for specific date and type
  getDutyForDate(date, type) {
    const duties = this.getAllDuties();
    return duties.find(d => d.date === date && d.type === type);
  },

  // Get employee's duties
  getEmployeeDuties(employeeId) {
    const duties = this.getAllDuties();
    return duties.filter(d => d.employeeId === employeeId);
  },

  // Get employee's duties for today
  getEmployeeTodayDuties(employeeId) {
    const today = new Date().toISOString().split('T')[0];
    const duties = this.getAllDuties();
    return duties.filter(d => d.employeeId === employeeId && d.date === today);
  },

  // Mark duty as completed
  completeDuty(dutyId) {
    const duties = this.getAllDuties();
    const index = duties.findIndex(d => d.id === dutyId);
    
    if (index !== -1) {
      duties[index].status = 'completed';
      duties[index].completedAt = new Date().toISOString();
      localStorage.setItem(DUTY_KEY, JSON.stringify(duties));
      return duties[index];
    }
    
    return null;
  },

  // Initialize daily duties (call this daily)
  initializeDailyDuties() {
    const dailyDuty = this.assignDailyCleaningDuty();
    const bathroomDuty = this.assignBathroomCleaningDuty();
    
    return {
      dailyDuty,
      bathroomDuty
    };
  }
};