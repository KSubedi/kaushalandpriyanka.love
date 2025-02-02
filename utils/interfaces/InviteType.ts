export interface Invite {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  additional_guests?: number;
  events: {
    haldi: boolean;
    sangeet: boolean;
    wedding: boolean;
    reception: boolean;
  };
  created_at: string;
  response?: InviteResponse;
}

export interface InviteResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  inviteId: string;
  additional_guests: number;
  events: {
    haldi: boolean;
    sangeet: boolean;
    wedding: boolean;
    reception: boolean;
  };
  created_at: string;
  updated_at: string;
}
