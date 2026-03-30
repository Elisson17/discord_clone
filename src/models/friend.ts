export interface FriendProp {
  id: number;
  username: string;
  discriminator: string;
  avatar_url: string;
  status: number;
  custom_status: string;
  bio: string;
}

export interface PendingOutgoingProp {
  friendship_id: number;
  since: string;
  user: {
    id: number;
    username: string;
    discriminator: string;
    avatar_url: string;
    status: number;
  };
}

export interface PendingIncomingProp {
  friendship_id: number;
  since: string;
  user: {
    id: number;
    username: string;
    discriminator: string;
    avatar_url: string;
    status: number;
  };
}

export interface BlockedProp {
  friendship_id: number;
  user: {
    id: number;
    username: string;
    discriminator: string;
    avatar_url: string;
  }
}

export interface FriendProps {
  friends: FriendProp[];
  pending_outgoing: PendingOutgoingProp[];
  pending_incoming: PendingIncomingProp[];
  blocked: BlockedProp[];
}
