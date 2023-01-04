// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ExtractJwt, Strategy } from 'passport-local';
// import { UserRepositoty } from '../auth.repository';
// import * as dotenv from 'dotenv';
// import { User } from '../entities/user.entity';

// dotenv.config();

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: UserRepositoty,
//   ) {
//     super({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         secretOrKey: configService.get('JWT_SECRET'),
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       }),
//     });
//   }

//   async validate(payload) {
//     const { email } = payload;
//     const user: User = await this.userRepository.findOneBy({ email });

//     if (!user) {
//       throw new UnauthorizedException();
//     }

//     return user;
//   }
// }
