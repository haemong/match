import { JwtPayload } from 'jsonwebtoken';

export interface Payload extends JwtPayload {
  userId: number;
}
