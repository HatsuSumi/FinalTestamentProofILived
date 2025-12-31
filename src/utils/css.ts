/**
 * 从CSS变量读取动画时长
 * @param variableName CSS变量名（如 '--transition-base'）
 * @returns 时长（毫秒）
 */
export function getCSSTransitionDuration(variableName: string): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  return parseInt(value); // 提取数字部分（如 "300ms ease" -> 300）
}

