export interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  population: string;
  seatsCount: number;
  presidentName: string;
  activeIssuesCount: number;
  resolvedIssuesCount: number;
  upcomingMeetingDate: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: 'cleaning' | 'roads' | 'violations' | 'lighting' | 'environment' | 'others';
  districtId: string;
  districtName: string;
  description: string;
  citizenName: string;
  date: string;
  status: 'under_review' | 'in_progress' | 'resolved';
  votes: number;
  userVoted?: boolean;
  officialResponse?: {
    responderName: string;
    responderRole: string;
    text: string;
    date: string;
  };
}

export interface CouncilDecision {
  id: string;
  title: string;
  date: string;
  districtId: string;
  districtName: string;
  summary: string;
  details: string;
  category: 'budget' | 'services' | 'planning' | 'social';
}

export interface CouncilMeeting {
  id: string;
  title: string;
  date: string;
  districtId: string;
  districtName: string;
  agenda: string[];
  summary: string;
  attendeesCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isDraftingTemplate?: boolean;
}
