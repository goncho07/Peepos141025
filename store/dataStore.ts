import { create } from 'zustand';
import { ActivityLog, CalendarEvent } from '@/types';
import { activityLogs as initialActivityLogs } from '@/data/activityLogs';
import { mockEvents as initialEvents } from '@/data/events';
import { gradesAndSections } from '@/data/grades';

interface DataStoreState {
  activityLogs: ActivityLog[];
  events: CalendarEvent[];
  gradesAndSections: typeof gradesAndSections;
}

export const useDataStore = create<DataStoreState>(() => ({
  activityLogs: initialActivityLogs,
  events: initialEvents,
  gradesAndSections: gradesAndSections,
}));
