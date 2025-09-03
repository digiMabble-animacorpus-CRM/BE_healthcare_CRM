import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { TeamMember, TeamMemberRole } from 'src/modules/team-member/entities/team-member.entity';

@Injectable()
export class BranchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: TeamMember = request.user;
    const branchId = request.body.branch_id || request.params.branchId;

    console.log('BranchGuard -> User Role:', user?.role);
  console.log('BranchGuard -> Branch to check:', branchId);
  console.log('BranchGuard -> User Primary Branch:', user?.primary_branch);
  console.log('BranchGuard -> User Assigned Branches:', user?.branches);
  
    if (!branchId) return true; // some routes may not need branch check

    // Super Admin bypass
    if (user.role === TeamMemberRole.SUPER_ADMIN) return true;

    // Branch check: primary or assigned branches
    if (user.primary_branch?.branch_id === branchId) return true;
    if (user.branches?.some(b => b.branch_id === branchId)) return true;

    throw new ForbiddenException('Access to this branch is denied');
  }
}
