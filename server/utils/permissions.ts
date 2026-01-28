// 引入访问控制库
const accesscontrol = require('accesscontrol');
// 创建一个访问控制实例
const ac = new accesscontrol();
// 用户可以读取自己的个人信息并更新自己的个人信息
ac.grant('user').readOwn('profile').updateOwn('profile');
ac.grant('user').createOwn('article').readOwn('article').updateOwn('article').deleteOwn('article')
// 管理员可以读取任何用户的个人信息并更新任何用户的个人信息
ac.grant('admin').extend('user').readAny('profile').updateAny('profile').deleteAny('profile');
ac.grant('admin').extend('user').createAny('article').deleteAny('article')
// 导出访问控制实例
export default ac;