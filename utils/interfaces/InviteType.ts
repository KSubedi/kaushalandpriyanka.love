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
    coloradoReception: boolean;
  };
  created_at: string;
  response?: InviteResponse;
  template_invite_id?: string;
  responses?: string[];
  is_template?: boolean;
  location?: "houston" | "colorado";
  template_name?: string;
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
    coloradoReception: boolean;
  };
  created_at: string;
  updated_at: string;
  welcome_email_sent?: boolean;
}
