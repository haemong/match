import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export class UserRepositoty extends Repository<User> {}
