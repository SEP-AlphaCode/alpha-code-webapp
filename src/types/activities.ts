export type Activity = {
  id: string;
  accountId: string;
  data: any; // Object containing activity and music_info
  name: string;
  status: number;
  type: string;
  createdDate: string;
  lastUpdate: string;
  statusText: string;
  robotModelId: string;
}

export type ActivitiesResponse = {
  data: Activity[];
  has_next: boolean;
  has_previous: boolean;
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}