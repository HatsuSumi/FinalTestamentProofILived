import type { Component } from '../types';
import { cloneTemplate, queryIn, addEvent } from '../utils/template';

export class SupportSidebar implements Component {
  element: HTMLElement;

  constructor() {
    this.element = this.render();
  }

  render(): HTMLElement {
    const sidebar = cloneTemplate<HTMLElement>('support-sidebar-template');

    // 二维码容器
    const qrcodeContainer = queryIn<HTMLElement>(sidebar, '.qrcode-container');

    // 微信二维码
    const wechatItem = this.createQRCodeItem(
      '微信',
      '/assets/qrcodes/wechat.png',
      '微信赞助二维码'
    );

    // 支付宝二维码
    const alipayItem = this.createQRCodeItem(
      '支付宝',
      '/assets/qrcodes/alipay.png',
      '支付宝赞助二维码'
    );

    qrcodeContainer.appendChild(wechatItem);
    qrcodeContainer.appendChild(alipayItem);

    return sidebar;
  }

  private createQRCodeItem(label: string, imageSrc: string, alt: string): HTMLElement {
    const item = cloneTemplate<HTMLElement>('qrcode-item-template');

    const labelEl = queryIn<HTMLElement>(item, '.qrcode-label');
    labelEl.textContent = label;

    const img = queryIn<HTMLImageElement>(item, '.qrcode-image');
    img.src = imageSrc;
    img.alt = alt;

    return item;
  }
}

