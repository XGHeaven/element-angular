import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, Host, ViewChild } from '@angular/core'
import { ElTabs } from './tabs'
import { ElTabPane } from './tab-pane'

function noop(): void {}
const firstUpperCase = (str: string) => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

@Component({
  selector: 'el-tab-nav',
  template: `
  <div [ngClass]="['el-tabs__nav-wrap', scrollable ? 'is-scrollable' : '', 'is-' + this.parent.tabPosition]">

    <ng-container *ngIf="scrollable">
      <span [ngClass]="['el-tabs__nav-prev', scrollable.prev ? '' : 'is-disabled']" (click)="scrollPrev($event)"><i class="el-icon-arrow-left"></i></span>,
      <span [ngClass]="['el-tabs__nav-next', scrollable.next ? '' : 'is-disabled']" (click)="scrollNext($event)"><i class="el-icon-arrow-right"></i></span>
    </ng-container>

    <div class="el-tabs__nav-scroll" #navScroll>
      <div class="el-tabs__nav" #nav [style]="navStyle" role="tablist" (keydown)="changeTab($event)">
        <el-tab-bar *ngIf="!type" [tabs]="panes"></el-tab-bar>
        <div
          *ngFor="let pane of panes"
          class="el-tabs__item"
          [ngClass]="paneClasses(pane)"
          [id]="'tab-' + pane.name"
          role="tab"
          [attr.aria-controls]="'pane-' + pane.name"
          [attr.aria-selected]="pane.active"
          #tabs
          [tabindex]="tabindex"
          (blur)="removeFocus()"
          (focus)="setFocus()"
          (click)="removeFocus(); tabClick.emit(pane)"
        >
          <ng-container *ngIf="pane.labelTpl">
            <ng-template [ngTemplateOutlet]="pane.labelTpl"></ng-template>
          </ng-container>
          <ng-container *ngIf="!pane.labelTpl">
            {{pane.label}}
          </ng-container>
          <span *ngIf="pane.isClosable || editable" class="el-icon-close" (click)="tabRemove.emit(pane)"></span>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class ElTabNav {
  @Input() panes: ElTabPane[]
  @Input() currentName: string
  @Input() editable: boolean
  @Input() type: string

  @Output('tab-click') tabClick: EventEmitter<ElTabPane> = new EventEmitter()
  @Output('tab-remove') tabRemove: EventEmitter<ElTabPane> = new EventEmitter()

  @ViewChildren('tabs') tabs: QueryList<ElementRef>
  @ViewChild('navScroll') navScroll: ElementRef
  @ViewChild('nav') nav: ElementRef

  private scrollable: false | {prev?: number, next?: boolean} = false
  private navOffset: number = 0
  private isFocus: boolean = false

  constructor(
    private parent: ElTabs,
    private el: ElementRef,
  ) {
  }

  get navStyle(): {} {
    const dir = ['top', 'bottom'].indexOf(this.parent.tabPosition) !== -1 ? 'X' : 'Y';
    return {
      transform: `translate${dir}(-${this.navOffset}px)`
    };
  }

  get sizeName(): 'width' | 'height' {
    return ['top', 'bottom'].indexOf(this.parent.tabPosition) !== -1 ? 'width' : 'height';
  }

  paneClasses(pane: ElTabPane): {} {
    const closable = pane.isClosable || this.editable
    return {
      ['is-' + this.parent.tabPosition]: true,
      'is-active': pane.active,
      'is-disabled': pane.disabled,
      'is-closable': closable,
      'is-focus': this.isFocus
    }
  }

  scrollPrev(): void {
    const containerSize = this.navScroll.nativeElement[`offset${firstUpperCase(this.sizeName)}`];
    const currentOffset = this.navOffset;
    if (!currentOffset) return;
    const newOffset = currentOffset > containerSize
      ? currentOffset - containerSize
      : 0;
    this.navOffset = newOffset;
  }
  scrollNext(): void {
    const navSize = this.nav.nativeElement[`offset${firstUpperCase(this.sizeName)}`];
    const containerSize = this.navScroll.nativeElement[`offset${firstUpperCase(this.sizeName)}`];
    const currentOffset = this.navOffset;
    if (navSize - currentOffset <= containerSize) return;
    const newOffset = navSize - currentOffset > containerSize * 2
      ? currentOffset + containerSize
      : (navSize - containerSize);
    this.navOffset = newOffset;
  }

  scrollToActiveTab(): void {
    if (!this.scrollable) return;
    const nav = this.nav.nativeElement;
    const activeTab = this.el.nativeElement.querySelector('.is-active');
    const navScroll = this.navScroll.nativeElement;
    const activeTabBounding = activeTab.getBoundingClientRect();
    const navScrollBounding = navScroll.getBoundingClientRect();
    const navBounding = nav.getBoundingClientRect();
    const currentOffset = this.navOffset;
    let newOffset = currentOffset;
    if (activeTabBounding.left < navScrollBounding.left) {
      newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
    }
    if (activeTabBounding.right > navScrollBounding.right) {
      newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
    }
    if (navBounding.right < navScrollBounding.right) {
      newOffset = nav.offsetWidth - navScrollBounding.width;
    }
    this.navOffset = Math.max(newOffset, 0);
  }
  update(): void {
    if (!this.nav) return;
    const sizeName = this.sizeName;
    const navSize = this.nav.nativeElement[`offset${firstUpperCase(sizeName)}`];
    const containerSize = this.navScroll.nativeElement[`offset${firstUpperCase(sizeName)}`];
    const currentOffset = this.navOffset;
    if (containerSize < navSize) {
      const currentOffset = this.navOffset;
      this.scrollable = this.scrollable || {};
      this.scrollable.prev = currentOffset;
      this.scrollable.next = currentOffset + containerSize < navSize;
      if (navSize - currentOffset < containerSize) {
        this.navOffset = navSize - containerSize;
      }
    } else {
      this.scrollable = false;
      if (currentOffset > 0) {
        this.navOffset = 0;
      }
    }
  }
  changeTab(e: any): void {
    const keyCode = e.keyCode;
    let nextIndex;
    let currentIndex, tabList;
    if ([37, 38, 39, 40].indexOf(keyCode) !== -1) { // 左右上下键更换tab
      tabList = e.currentTarget.querySelectorAll('[role=tab]');
      currentIndex = Array.prototype.indexOf.call(tabList, e.target);
    } else {
      return;
    }
    if (keyCode === 37 || keyCode === 38) { // left
      if (currentIndex === 0) { // first
        nextIndex = tabList.length - 1;
      } else {
        nextIndex = currentIndex - 1;
      }
    } else { // right
      if (currentIndex < tabList.length - 1) { // not last
        nextIndex = currentIndex + 1;
      } else {
        nextIndex = 0;
      }
    }
    tabList[nextIndex].focus(); // 改变焦点元素
    tabList[nextIndex].click(); // 选中下一个tab
  }

  setFocus(): void {
    this.isFocus = true;
  }

  removeFocus(): void {
    this.isFocus = false;
  }
}
