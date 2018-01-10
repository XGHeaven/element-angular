import { Component, Input } from '@angular/core'
import { ElTabs } from './tabs'
import { ElTabNav } from './tab-nav'
import { ElTabPane } from './tab-pane'

@Component({
  selector: 'el-tab-bar',
  template: `
  <div class="el-tabs__active-bar" [ngClass]="'is-' + rootTabs.tabPosition" [ngStyle]="barStyle"></div>
  `
})
export class ElTabBar {
  @Input() tabs: ElTabPane[] = []

  constructor(
    private rootTabs: ElTabs,
    private parent: ElTabNav,
  ) {

  }

  get barStyle(): {} {
    if (!this.parent.tabs) return {};
      const style: {[key: string]: any} = {};
      let offset = 0;
      let tabSize = 0;
      const sizeName = ['top', 'bottom'].indexOf(this.rootTabs.tabPosition) !== -1 ? 'width' : 'height';
      const sizeDir = sizeName === 'width' ? 'x' : 'y';
      const firstUpperCase = (str: string) => {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
      };
      const $tabs = this.parent.tabs.toArray().map(tab => tab.nativeElement)
      this.tabs.every((tab, index) => {
        const $el = $tabs[index];
        if (!$el) { return false; }
        if (!tab.active) {
          offset += $el[`client${firstUpperCase(sizeName)}`];
          return true;
        } else {
          tabSize = $el[`client${firstUpperCase(sizeName)}`];
          if (sizeName === 'width' && this.tabs.length > 1) {
            tabSize -= (index === 0 || index === this.tabs.length - 1) ? 20 : 40;
          }
          return false;
        }
      });
      if (sizeName === 'width' && offset !== 0) {
        offset += 20;
      }
      const transform = `translate${firstUpperCase(sizeDir)}(${offset}px)`;
      style[sizeName] = tabSize + 'px';
      style.transform = transform;
      style.msTransform = transform;
      style.webkitTransform = transform;
      return style;
  }
}
