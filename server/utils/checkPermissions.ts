import ac from './permissions.ts';

import type { NextFunction, Request, Response } from 'express';

type AuthedUser = {
  id?: number | string;
  roleName?: string;
  permissions?: string[] | null;
};

type AuthedRequest = Request & { user?: AuthedUser };

/**
 * RBAC 权限校验中间件
 * - 依赖 `passport-jwt` 把用户信息挂载到 `req.user`
 * - 优先使用 accesscontrol（`permissions.ts`）基于 roleName 判定
 * - 可选兜底：如果 DB 里有 `permissions: string[]`，则支持字符串权限匹配
 */
// resource资源名称
// action 是对这个资源的操作，比如 readOwn、updateAny 这些
export const checkPermissions = (resource: string, action: string) => {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: '未登录，请先登录' });
    }

    const roleName = req.user.roleName || 'user';
    console.log(roleName, 'roleName');

    // accesscontrol: ac.can(role)[action](resource).granted
    const roleAbility = ac.can(roleName) as any;
    const actionFn = roleAbility?.[action];
    if (typeof actionFn !== 'function') {
      return res.status(500).json({
        message: `权限配置错误：未知 action "${action}"`,
      });
    }
    console.log(roleAbility, 111);
    console.log(actionFn, 222);
    console.log(action, 3333);

    // // 必须绑定上下文，否则 accesscontrol 内部的 this 为 undefined
    const permission = actionFn.call(roleAbility, resource);
    // const permission = ac.can(roleName).action(resource);
    // 可选兜底：基于数据库里保存的 permissions 字符串列表
    const perms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    const allow =
      perms.includes(`${action}:${resource}`) ||
      perms.includes(`${resource}:${action}`) ||
      perms.includes(action) ||
      perms.includes('*');

    if (permission?.granted || allow) {
      return next();
    }

    return res.status(403).json({ message: '没有权限' });
  };
};