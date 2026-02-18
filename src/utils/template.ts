// 模板克隆工具函数

/**
 * 从 HTML template 克隆节点
 * @param templateId template 元素的 ID
 * @returns 克隆的 HTMLElement
 * @throws {Error} 当 template 不存在时
 * @throws {Error} 当 template.content 为空时
 * @throws {Error} 当克隆结果不是 HTMLElement 时
 */
export function cloneTemplate<T extends HTMLElement = HTMLElement>(templateId: string): T {
  const template = document.getElementById(templateId) as HTMLTemplateElement;
  if (!template) {
    throw new Error(`Template with id "${templateId}" not found in DOM`);
  }
  
  if (!template.content) {
    throw new Error(`Template "${templateId}" has no content`);
  }
  
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const element = clone.firstElementChild;
  
  if (!element) {
    throw new Error(`Template "${templateId}" content is empty`);
  }
  
  if (!(element instanceof HTMLElement)) {
    throw new Error(`First child of template "${templateId}" is not an HTMLElement`);
  }
  
  return element as T;
}

/**
 * 查询元素（必须存在）
 * @throws {Error} 当元素不存在时
 */
export function query<T extends Element = Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found in DOM`);
  }
  return element;
}

/**
 * 查询所有元素（必须至少有一个）
 * @throws {Error} 当没有找到任何元素时
 */
export function queryAll<T extends Element = Element>(selector: string): NodeListOf<T> {
  const elements = document.querySelectorAll<T>(selector);
  if (elements.length === 0) {
    throw new Error(`No elements found with selector "${selector}"`);
  }
  return elements;
}

/**
 * 在指定元素内查询（必须存在）
 * @throws {Error} 当元素不存在时
 */
export function queryIn<T extends Element = Element>(
  parent: Element,
  selector: string
): T {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found in parent ${parent.tagName}`);
  }
  return element;
}

/**
 * 添加事件监听
 */
export function addEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void
): void {
  element.addEventListener(event, handler as EventListener);
}

/**
 * 移除事件监听
 */
export function removeEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void
): void {
  element.removeEventListener(event, handler as EventListener);
}

/**
 * 设置样式
 */
export function setStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
  Object.assign(element.style, styles);
}

