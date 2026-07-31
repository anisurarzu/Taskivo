export type Organization = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  plan: 'free' | 'premium';
  premiumEnabled: boolean;
  premiumFreeAccess: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrgMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    avatarUrl?: string;
  };
};

export type Team = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  teamId: string;
  organizationId: string;
  userId: string;
  role: string;
  customRole?: string;
  roleLabel?: string;
  user: OrgMember['user'];
};

export type ChatMessage = {
  id: string;
  teamId: string;
  organizationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender?: { id: string; name: string; email: string; avatarUrl?: string };
};
