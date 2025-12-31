/**
 * 平滑滚动到指定位置
 * @param targetY 目标Y坐标
 * @param duration 动画时长（毫秒）
 * @returns Promise，滚动完成后 resolve
 */
export function smoothScrollTo(targetY: number, duration: number = 600): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, startY + distance * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(scroll);
  });
}

