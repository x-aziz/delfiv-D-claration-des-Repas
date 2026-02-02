// 
export const EMPLOYEE_DATABASE = {
  // ==================== ADMIN USERS ====================
  admins: [
    {
      id: 'admin001',
      email: 'mousa.daoud@admin.com',
      name: 'موسى داود',
      nameEn: 'Mousa Daoud',
      role: 'admin',
      canAccessKitchen: true,
      canManageEmployees: true,
      canApproveForms: true
    },
    {
      id: 'admin002',
      email: 'ahmed.bahayou@admin.com',
      name: 'أحمد باحيو',
      nameEn: 'Ahmed Bahayou',
      role: 'admin',
      canAccessKitchen: true,
      canManageEmployees: true,
      canApproveForms: true
    }
  ],

  // ==================== ALL EMPLOYEES ====================
  employees: [
    {
      id: 'emp001',
      email: 'ibrahim.bahoun@delfiv.com',
      name: 'براهيم دادي بهون',
      nameEn: 'Ibrahim Dadi Bahoun',
      role: 'employee',
      residential: true,
      defaultLunch: true,
      defaultDinner: true,
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp002',
      email: 'omar.abdelrahman@delfiv.com',
      name: 'عمر عبد الرحمان',
      nameEn: 'Omar Abdelrahman',
      role: 'employee',
      residential: true,
      defaultLunch: true,
      defaultDinner: true,
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp003',
      email: 'abdelsalam.marahrah@delfiv.com',
      name: 'عبد السلام مرحرح',
      nameEn: 'Abdelsalam Marahrah',
      role: 'employee',
      residential: true,
      defaultLunch: true,
      defaultDinner: true,
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp004',
      email: 'salim.aina@delfiv.com',
      name: 'ساليم حبة عينة',
      nameEn: 'Salim Aina',
      role: 'employee',
      residential: true,
      defaultLunch: true,
      defaultDinner: true,
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp005',
      email: 'said.abdelaziz@delfiv.com',
      name: 'سعيد عبد العزيز',
      nameEn: 'Said Abdelaziz',
      role: 'employee',
      residential: true,
      defaultLunch: true,
      defaultDinner: true,
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp006',
      email: 'aissa.chekma@delfiv.com',
      name: 'عيسى شقمة',
      nameEn: 'AIssa Chekma',
      role: 'employee',
      residential: false, // Non-residential
      defaultLunch: true,
      defaultDinner: false, // Non-residential: lunch only
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp007',
      email: 'mounir.alouani@delfiv.com',
      name: 'منير علواني',
      nameEn: 'Mounir Alouani',
      role: 'employee',
      residential: true,
      defaultLunch: true,
      defaultDinner: true,
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp008',
      email: 'said.naaja@delfiv.com',
      name: 'سعيد نعجة',
      nameEn: 'Said Naaja',
      role: 'employee',
      residential: false, // Non-residential
      defaultLunch: true,
      defaultDinner: false, // Non-residential: lunch only
      duties: {
        dailyCleaning: true,
        kitchenDuties: true,
        bathroomCleaning: true
      }
    },
    {
      id: 'emp009',
      email: 'bahayou.ahmed@delfiv.com',
      name: 'بحيو حمد',
      nameEn: 'Bahayou Ahmed',
      role: 'employee',
      residential: false, // Non-residential
      defaultLunch: true,
      defaultDinner: false, // Non-residential: lunch only
      duties: {
        dailyCleaning: false,
        kitchenDuties: false,
        bathroomCleaning: false
      }
    },
    {
      id: 'emp010',
      email: 'mousa.daoud@delfiv.com',
      name: 'موسى داود',
      nameEn: 'Mousa Daoud',
      role: 'employee',
      residential: true,
      defaultLunch: true,
      defaultDinner: true,
      duties: {
        dailyCleaning: false,
        kitchenDuties: false,
        bathroomCleaning: false
      }
    },
    {
      id: 'emp011',
      email: 'hussein.yahya@delfiv.com',
      name: 'حسين يحي',
      nameEn: 'Hussein Yahya',
      role: 'employee',
      residential: false, // Non-residential
      defaultLunch: false, // Can declare not eating
      defaultDinner: false, // Non-residential: no dinner
      duties: {
        dailyCleaning: false,
        kitchenDuties: false,
        bathroomCleaning: false
      }
    },
    {
      id: 'emp012',
      email: 'salah.mousa@delfiv.com',
      name: 'صالح عمي موسى',
      nameEn: 'Salah Mousa',
      role: 'employee',
      residential: false, // Non-residential
      defaultLunch: false,
      defaultDinner: false, // Non-residential: lunch only
      duties: {
        dailyCleaning: false,
        kitchenDuties: false,
        bathroomCleaning: false
      }
    }
  ]
};

// Helper functions to get employee data
export const getEmployeeByEmail = (email) => {
  // Check admins first
  const admin = EMPLOYEE_DATABASE.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (admin) return admin;

  // Check employees
  const employee = EMPLOYEE_DATABASE.employees.find(e => e.email.toLowerCase() === email.toLowerCase());
  return employee || null;
};

export const getAllUsers = () => {
  return [...EMPLOYEE_DATABASE.admins, ...EMPLOYEE_DATABASE.employees];
};

export const getResidentialEmployees = () => {
  return EMPLOYEE_DATABASE.employees.filter(e => e.residential);
};

export const getNonResidentialEmployees = () => {
  return EMPLOYEE_DATABASE.employees.filter(e => !e.residential);
};

export const getEmployeesWithDailyCleaning = () => {
  return EMPLOYEE_DATABASE.employees.filter(e => e.duties.dailyCleaning);
};

export const getEmployeesWithBathroomCleaning = () => {
  return EMPLOYEE_DATABASE.employees.filter(e => e.duties.bathroomCleaning);
};

export const getDefaultLunchConsumers = () => {
  return EMPLOYEE_DATABASE.employees.filter(e => e.defaultLunch);
};

export const getDefaultDinnerConsumers = () => {
  return EMPLOYEE_DATABASE.employees.filter(e => e.defaultDinner);
};

export const isAdmin = (email) => {
  return EMPLOYEE_DATABASE.admins.some(a => a.email.toLowerCase() === email.toLowerCase());
};

export const isEmployee = (email) => {
  return EMPLOYEE_DATABASE.employees.some(e => e.email.toLowerCase() === email.toLowerCase());
};