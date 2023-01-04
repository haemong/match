import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const CheckUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const accessToken = req.headers.authorization;
  const decodeToken = jwt.decode(accessToken);

  if (!accessToken) {
    return accessToken;
  }

  const result = {
    id: decodeToken['id'],
    email: decodeToken['email'],
  };

  return result;
});
