import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const accessToken = req.headers.authorization;
  const decodeToken = jwt.decode(accessToken);
  const result = {
    userId: decodeToken['id'],
    email: decodeToken['email'],
  };

  return result;
});
