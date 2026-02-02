// Vacation Management Service
// Handles employee vacation declarations and status

const VACATION_KEY = 'delfiv_vacations';

export const vacationService = {
  // Get all vacations
  getAllVacations() {
    try {
      const data = localStorage.getItem(VACATION_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading vacations:', error);
      return [];
    }
  },

  // Declare vacation
  declareVacation(employeeId, startDate, endDate, reason = '') {
    const vacations = this.getAllVacations();
    
    const newVacation = {
      id: Date.now().toString(),
      employeeId,
      startDate,
      endDate,
      reason,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    vacations.push(newVacation);
    localStorage.setItem(VACATION_KEY, JSON.stringify(vacations));
    
    return newVacation;
  },

  // End vacation (return from vacation)
  endVacation(vacationId) {
    const vacations = this.getAllVacations();
    const index = vacations.findIndex(v => v.id === vacationId);
    
    if (index !== -1) {
      vacations[index].status = 'completed';
      vacations[index].endedAt = new Date().toISOString();
      localStorage.setItem(VACATION_KEY, JSON.stringify(vacations));
      return vacations[index];
    }
    
    return null;
  },

  // Check if employee is on vacation
  isEmployeeOnVacation(employeeId) {
    const vacations = this.getAllVacations();
    const today = new Date().toISOString().split('T')[0];
    
    return vacations.some(v => 
      v.employeeId === employeeId &&
      v.status === 'active' &&
      v.startDate <= today &&
      v.endDate >= today
    );
  },

  // Get employee's active vacation
  getActiveVacation(employeeId) {
    const vacations = this.getAllVacations();
    const today = new Date().toISOString().split('T')[0];
    
    return vacations.find(v => 
      v.employeeId === employeeId &&
      v.status === 'active' &&
      v.startDate <= today &&
      v.endDate >= today
    );
  },

  // Get employee's vacation history
  getEmployeeVacations(employeeId) {
    const vacations = this.getAllVacations();
    return vacations.filter(v => v.employeeId === employeeId);
  },

  // Delete vacation
  deleteVacation(vacationId) {
    const vacations = this.getAllVacations();
    const filtered = vacations.filter(v => v.id !== vacationId);
    localStorage.setItem(VACATION_KEY, JSON.stringify(filtered));
    return true;
  }
};