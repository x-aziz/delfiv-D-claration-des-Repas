const STORAGE_KEY = 'delfi_declarations';

// ⚠️ YOUR GOOGLE APPS SCRIPT URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxYUzlwhoxDNjkneCABhjDg1WcVtA7i_sMRGL0vrKPRFvNql1enCnl-y9kQT8nIrPH1lg/exec';

export const storage = {
  // Keep localStorage as backup
  getDeclarations() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from storage:', error);
      return [];
    }
  },

  // Save to BOTH localStorage AND Google Sheets
  async saveDeclaration(declaration) {
    try {
      // Save to localStorage first (instant)
      const declarations = this.getDeclarations();
      const newDeclaration = {
        ...declaration,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      declarations.push(newDeclaration);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(declarations));

      // Save to Google Sheets (background)
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDeclaration)
        });
        console.log('✅ Saved to Google Sheets');
      } catch (sheetError) {
        console.error('❌ Google Sheets failed, but localStorage saved:', sheetError);
      }

      return newDeclaration;
    } catch (error) {
      console.error('Error saving declaration:', error);
      throw error;
    }
  },

  // Load from Google Sheets
  async loadFromGoogleSheets() {
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      const data = await response.json();
      
      console.log('📥 Data from Google Sheets:', data);
      
      // Clean and validate data from Google Sheets
      const cleanedData = data
        .filter(item => {
          // Skip invalid or empty rows
          if (!item || typeof item !== 'object') return false;
          // Skip header row if it exists
          if (item.id === 'id' || item.timestamp === 'timestamp') return false;
          // Skip rows without id
          if (!item.id) return false;
          return true;
        })
        .map(item => {
          // Determine if this is a meal declaration or expense declaration
          const isMealDeclaration = (item.name && item.name !== '') && 
                                    (item.lunch !== '' || item.dinner !== '');
          const isExpenseDeclaration = (item.recipientName && item.recipientName !== '');
          
          if (isMealDeclaration) {
            // Meal declaration - only include meal-related fields
            return {
              id: item.id || Date.now().toString() + Math.random(),
              timestamp: item.timestamp || new Date().toISOString(),
              status: item.status || 'pending',
              name: item.name || '',
              lunch: item.lunch === 'true' || item.lunch === true || item.lunch === 'TRUE',
              dinner: item.dinner === 'true' || item.dinner === true || item.dinner === 'TRUE',
              date: item.date || '',
              type: 'delfiv-meal'
            };
          } else if (isExpenseDeclaration) {
            // Expense declaration - only include expense-related fields
            return {
              id: item.id || Date.now().toString() + Math.random(),
              timestamp: item.timestamp || new Date().toISOString(),
              status: item.status || 'pending',
              recipientName: item.recipientName || '',
              horn: item.horn && item.horn !== '' ? parseInt(item.horn) : '',
              chocolate: item.chocolate && item.chocolate !== '' ? parseInt(item.chocolate) : '',
              break: item.break && item.break !== '' ? parseInt(item.break) : '',
              group: item.group || '',
              type: 'expense'
            };
          } else {
            // Unknown type - include all fields
            return {
              id: item.id || Date.now().toString() + Math.random(),
              timestamp: item.timestamp || new Date().toISOString(),
              status: item.status || 'pending',
              name: item.name || '',
              recipientName: item.recipientName || '',
              horn: item.horn && item.horn !== '' ? parseInt(item.horn) : '',
              chocolate: item.chocolate && item.chocolate !== '' ? parseInt(item.chocolate) : '',
              break: item.break && item.break !== '' ? parseInt(item.break) : '',
              group: item.group || '',
              lunch: item.lunch === 'true' || item.lunch === true || item.lunch === 'TRUE',
              dinner: item.dinner === 'true' || item.dinner === true || item.dinner === 'TRUE',
              date: item.date || '',
              type: item.type || ''
            };
          }
        });
      
      console.log('✅ Cleaned data:', cleanedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData));
      return cleanedData;
    } catch (error) {
      console.error('❌ Error loading from Google Sheets:', error);
      throw error;
    }
  },

  updateDeclaration(id, updates) {
    try {
      const declarations = this.getDeclarations();
      const index = declarations.findIndex(d => d.id === id);
      if (index !== -1) {
        declarations[index] = { ...declarations[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(declarations));
        return declarations[index];
      }
      return null;
    } catch (error) {
      console.error('Error updating declaration:', error);
      throw error;
    }
  },

  deleteDeclaration(id) {
    try {
      const declarations = this.getDeclarations();
      const filtered = declarations.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting declaration:', error);
      throw error;
    }
  },

  getDeclarationsByDate(date) {
    const declarations = this.getDeclarations();
    return declarations.filter(d => d.date === date);
  },

  cleanOldDeclarations() {
    try {
      const declarations = this.getDeclarations();
      const today = new Date().toISOString().split('T')[0];
      const current = declarations.filter(d => d.date >= today);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (error) {
      console.error('Error cleaning old declarations:', error);
    }
  },

  getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  },

  formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  },

  isBeforeDeadline() {
    const now = new Date();
    const hours = now.getHours();
    return hours < 22;
  },

  getStatistics() {
    const declarations = this.getDeclarations();
    
    // Filter only expense declarations (not meal declarations)
    const expenseDeclarations = declarations.filter(d => 
      d.recipientName && !d.hasOwnProperty('lunch')
    );
    
    return {
      total: expenseDeclarations.length,
      pending: expenseDeclarations.filter(d => d.status === 'pending').length,
      approved: expenseDeclarations.filter(d => d.status === 'approved').length,
      rejected: expenseDeclarations.filter(d => d.status === 'rejected').length,
      totalHorn: expenseDeclarations.reduce((sum, d) => sum + (parseInt(d.horn) || 0), 0),
      totalChocolate: expenseDeclarations.reduce((sum, d) => sum + (parseInt(d.chocolate) || 0), 0),
      totalBreak: expenseDeclarations.reduce((sum, d) => sum + (parseInt(d.break) || 0), 0),
      totalLunch: declarations.filter(d => d.lunch === true).length,
      totalDinner: declarations.filter(d => d.dinner === true).length,
    };
  },

  // ========== EXPORT/IMPORT FUNCTIONS ==========
  
  exportToJSON() {
    try {
      const declarations = this.getDeclarations();
      const dataStr = JSON.stringify(declarations, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `delfi-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  },

  importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            resolve({ success: true, count: data.length });
          } else {
            reject(new Error('Invalid JSON format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  },

  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};

const THEME_KEY = 'delfi_theme';

export const themeStorage = {
  getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme() {
    const current = this.getTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }
};