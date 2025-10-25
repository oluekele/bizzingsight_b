import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';
import { Injectable } from '@nestjs/common/decorators';
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true; // Allow access if no roles specified
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && requiredRoles.includes(user.role);
  }
}
