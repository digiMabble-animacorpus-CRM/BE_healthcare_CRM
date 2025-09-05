export class BranchSummaryDto {
  branch_id: number;
  branch_name: string;
  therapists_count: number;
  patients_count: number;          // distinct patients seen at that branch (all time)
  appointments_count: number;      // appointments in the current month
}
