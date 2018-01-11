import { Component, ViewEncapsulation } from '@angular/core'
import code from './code'

@Component({
  selector: 'ex-tabs',
  templateUrl: './tabs.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ExTabsComponent {
  private code: string[] = code
  private page: any = {
    previous: { name: 'Nav-menu 导航菜单', link: '/nav/menu' },
    next: { name: 'Breadcrumb 面包屑', link: '/nav/breadcrumb' },
  }

  private exClass: any = class {
    private activeName: string = 'first'
    private tabPosition: string = 'top'
  }
  
}
