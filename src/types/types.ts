export type UserProfile = {
  avatar?: string;
  bio?: string;
  firstname?: string;
  lastname?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
    state?: string;
    zipCode?: string;
  };
};

export type ProfilesFlated = Omit<UserProfile, "location"> & {
  address: string | null;
  city: string | null;
  country: string | null;
  state: string | null;
  zipCode: string | null;
};

export type deleteAws = { id?: number; url?: string };
