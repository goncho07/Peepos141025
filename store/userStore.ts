import { create } from 'zustand';
import { Student, Staff, ParentTutor, GenericUser } from '@/types';
import { students as initialStudents } from '@/data/students';
import { staff as initialStaff } from '@/data/users';
import { parents as initialParents } from '@/data/parents';

interface UserStoreState {
  students: Student[];
  staff: Staff[];
  parents: ParentTutor[];
  allUsers: GenericUser[];
  setAllUsers: (users: GenericUser[]) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  students: initialStudents,
  staff: initialStaff,
  parents: initialParents,
  allUsers: [...initialStudents, ...initialStaff, ...initialParents],
  setAllUsers: (newUsers) => {
    set({
      allUsers: newUsers,
      students: newUsers.filter((u): u is Student => 'studentCode' in u),
      staff: newUsers.filter((u): u is Staff => 'category' in u),
      parents: newUsers.filter((u): u is ParentTutor => 'relation' in u),
    });
  },
}));
