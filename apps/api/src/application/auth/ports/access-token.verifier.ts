export interface AccessTokenVerifier {
  verify(accessToken: string): Promise<{ userId: string } | null>;
}
