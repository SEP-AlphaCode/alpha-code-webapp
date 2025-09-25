// src/types/robot.ts

export type RobotActionCategory = "action" | "dance" | "funny";

export interface RobotAction {
  id: string;
  imageUrl: string | null;
  createdDate?: string;
  lastUpdate: string;
  name: string;
  code: string;
  commands: string[]; 
  description: string | null;
  duration: number; // đơn vị ms
  status: number;
  canInterrupt: boolean;
  statusText: string;
  category: RobotActionCategory;
}

export interface RobotActionResponse {
  data: RobotAction[];
  page: number;
  total_count: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}