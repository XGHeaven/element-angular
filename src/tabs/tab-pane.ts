import { Component, Input, Host, OnInit, OnDestroy } from '@angular/core'
import { ElTabs } from './tabs'
import { TabPane } from './tab.interface'

@Component({
  selector: 'el-tab-pane',
  template: `
    <div
      class="el-tab-pane"
      *ngIf="active"
      role="tabpanel"
      [id]="'pane-' + paneName"
      [attr.aria-hidden]="!active"
      [attr.aria-labelledby]="'tab-' + paneName"
    >
    <ng-content></ng-content>
    </div>
  `,
})
export class ElTabPane implements OnInit, OnDestroy, TabPane {
  @Input() label: string
  @Input() labelContent: Function
  @Input() name: string
  @Input() closable: boolean
  @Input() disabled: boolean
  index: string = ''

  constructor(
    @Host() private parent: ElTabs,
  ) {

  }

  ngOnInit(): void {
    this.parent.addPanes(this);
  }

  ngOnDestroy(): void {
    this.parent.removePanes(this)
  }

  get isClosable(): boolean {
    return this.closable || this.parent.closable;
  }

  get active(): boolean {
    return this.parent.currentName === (this.name || this.index);
  }

  get paneName(): string {
    return this.name || this.index;
  }
}
