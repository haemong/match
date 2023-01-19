import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const accessToken = req.headers.authorization;
  const decodeToken = jwt.decode(accessToken);

  if (!decodeToken) {
    throw new HttpException('Invalid Token', 404);
  }

  const result = {
    id: decodeToken['id'],
    email: decodeToken['email'],
  };

  return result;
});
