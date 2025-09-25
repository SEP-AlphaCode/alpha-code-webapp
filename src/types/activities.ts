export type Activity = {
  createdDate: string;
  data: string;
  description: string;
  id: string;
  imageUrl: string;
  lastUpdate: string;
  musicId: string;
  musicName: string;
  name: string;
  organizationId: string;
  organizationName: string;
  status: number;
  statusText: string;
  type: string;
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