export type StaffDto = {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string | null;
};

export const toStaffDto = (staff: StaffDto): StaffDto => ({
  id: staff.id,
  name: staff.name,
  role: staff.role,
  email: staff.email,
  phone: staff.phone ?? null
});
