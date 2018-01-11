import { Component, Input, Host, OnInit, OnDestroy, AfterViewInit, forwardRef, Inject, TemplateRef, ContentChild } from '@angular/core'
import { ElTabs } from './tabs'

@Component({
  selector: 'el-tab-pane',
  template: `
    <div
      class="el-tab-pane"
      [hidden]="!active"
      role="tabpanel"
      [id]="'pane-' + paneName"
      [attr.aria-hidden]="!active"
      [attr.aria-labelledby]="'tab-' + paneName"
    >
    <ng-content></ng-content>
    </div>
  `,
})
export class ElTabPane implements OnInit, OnDestroy, AfterViewInit {
  @Input() label: string
  @Input() labelContent: Function
  @Input() name: string = this.parent.getRandomName()
  @Input() closable: boolean
  @Input() disabled: boolean

  @ContentChild('label') labelTpl: TemplateRef<HTMLElement>

  constructor(
    @Inject(forwardRef(() => ElTabs)) @Host() private parent: ElTabs,
  ) {
    console.log(this)
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.parent.addPanes(this);
  }

  ngOnDestroy(): void {
  }

  get isClosable(): boolean {
    return this.closable || this.parent.closable;
  }

  get active(): boolean {
    return this.parent.currentName === this.name;
  }
}
