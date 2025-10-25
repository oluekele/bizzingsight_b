import { SetMetadata } from '@nestjs/common/decorators';
import { UserRole } from '../entities/user.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
