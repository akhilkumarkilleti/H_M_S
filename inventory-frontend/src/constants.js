export const CATEGORIES = ['ICU Equipment', 'Operation Theatre', 'Laboratory Equipment', 'Diagnostic Equipment', 'Patient-care Equipment', 'Emergency Equipment', 'General Hospital Equipment'];
export const STATUSES = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DAMAGED', 'LOST', 'RETIRED', 'DISPOSED'];
export const CONDITIONS = ['GOOD', 'FAIR', 'POOR'];
export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const label = (s) => s.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w[0] + w.slice(1).toLowerCase());
export const ROLES = ['ADMIN', 'INVENTORY_MANAGER', 'STORE_KEEPER', 'DOCTOR', 'NURSE_STAFF', 'MAINTENANCE_ENGINEER'];

export const canEditEquipment = (role) =>
  ['ADMIN', 'INVENTORY_MANAGER', 'STORE_KEEPER', 'MAINTENANCE_ENGINEER'].includes(role);
export const canDeleteEquipment = (role) => ['ADMIN', 'INVENTORY_MANAGER'].includes(role);

export const canManageCategories = (role) => ['ADMIN', 'INVENTORY_MANAGER'].includes(role);

// ---------- maintenance ----------
export const MAINT_TYPES = ['PREVENTIVE', 'CORRECTIVE', 'CALIBRATION', 'INSPECTION'];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
// everyone can report a repair; only these roles schedule / start / complete / cancel work
export const canManageMaintenance = (role) => ['ADMIN', 'INVENTORY_MANAGER', 'MAINTENANCE_ENGINEER'].includes(role);

// ---------- assignments ----------
// who can hand equipment out, take it back and move it between departments
export const canManageAssignments = (role) => ['ADMIN', 'INVENTORY_MANAGER', 'STORE_KEEPER'].includes(role);


// ---------- purchasing ----------
// prices and suppliers are visible to these roles only
export const canViewPurchasing = (role) => ['ADMIN', 'INVENTORY_MANAGER', 'STORE_KEEPER'].includes(role);
// create / place / cancel / close orders and manage suppliers (store keepers can still receive goods)
export const canBuy = (role) => ['ADMIN', 'INVENTORY_MANAGER'].includes(role);

// ---------- stock ----------
// add / edit items and record movements
export const canEditStock = (role) => ['ADMIN', 'INVENTORY_MANAGER', 'STORE_KEEPER'].includes(role);
// delete items
export const canDeleteStock = (role) => ['ADMIN', 'INVENTORY_MANAGER'].includes(role);