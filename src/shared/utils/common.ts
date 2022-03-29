// 公共函数方法
/**
 * 方法pre=next视图不刷新
 * 解决数组直接赋值不刷新视图
 * @param pre 修改前的值
 * @param next 修改后数组
 */
export function commonAssignArray(pre: Array<any>, next: Array<any>) {
  pre.splice(0, pre.length);
  pre.push(...next);
}
