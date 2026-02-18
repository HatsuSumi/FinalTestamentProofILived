// 动画工具函数

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 平滑滚动到元素
export function smoothScrollTo(element: HTMLElement, offset: number = 0): void {
  if (!element) {
    throw new Error('smoothScrollTo: element is required');
  }
  
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// RAF 动画循环
export function animate(
  duration: number,
  callback: (progress: number) => void,
  easing: (t: number) => number = easeInOutCubic
): void {
  if (typeof duration !== 'number' || duration <= 0) {
    throw new Error('animate: duration must be a positive number');
  }
  if (typeof callback !== 'function') {
    throw new Error('animate: callback must be a function');
  }
  
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    callback(easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

