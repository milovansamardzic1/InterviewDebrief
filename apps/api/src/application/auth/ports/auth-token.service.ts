export type AccessTokenPayload = {
  userId: string;
  email: string;
};

export interface AuthTokenService {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload | null>;
  getExpiresInSeconds(): number;
}
