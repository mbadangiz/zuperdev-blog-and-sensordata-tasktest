export interface In_userProfile {
  firstname: string | null;
  lastname: string | null;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  location: {
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipCode: string | null;
  } | null;
}
