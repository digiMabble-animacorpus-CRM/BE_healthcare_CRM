export interface AppointmentStats {
  total: number;
  completed: number;
  cancellations: number;
  pending?: number;
}

export interface DistributionItem {
  id: number;
  name: string;
  count: number;
  percentage: number;
}

export interface AppointmentDistribution {
  totalAppointments: number;
  distribution: DistributionItem[];
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: string;
  doctor: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
  };
  patient?: {
    id: string;
    name: string;
  };
}
