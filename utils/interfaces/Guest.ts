export interface Guest {
  id: string;
  name: string;
  email: string;
  isAttending: boolean;
  isChild: boolean;
  attendingHaldi: boolean;
  attendingSangeet: boolean;
  attendingWedding: boolean;
  attendingReception: boolean;
  additionalGuests: number;
}
