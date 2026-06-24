export type AuthUserRecord = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthUserWithPasswordRecord = AuthUserRecord & {
  passwordHash: string;
};

export interface UserRepository {
  findByEmail(email: string): Promise<AuthUserWithPasswordRecord | null>;
  findById(id: string): Promise<AuthUserRecord | null>;
  create(input: {
    email: string;
    name: string | null;
    passwordHash: string;
  }): Promise<AuthUserRecord>;
}
