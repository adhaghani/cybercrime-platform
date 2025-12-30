import jwt from 'jsonwebtoken';

export interface JwtPayload {
  accountId: number;
  email: string;
  accountType: string;
  role?: string;
}

export class JwtManager {
  private secret: string;
  private expiresIn: string;

  constructor(secret?: string, expiresIn?: string) {
    this.secret = secret || process.env.JWT_SECRET || 'default-secret-change-in-production';
    this.expiresIn = expiresIn || process.env.JWT_EXPIRES_IN || '7d';
  }

  /**
   * Generate JWT token
   */
  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload as object, this.secret, {
      expiresIn: this.expiresIn
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      console.error('JWT verification error:', error);
      return null;
    }
  }

  /**
   * Decode JWT token without verification
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  }
}
