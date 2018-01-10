import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { TabPane } from './tab.interface'

@Component({
    selector: 'el-tabs',
    template: `
    <div class="el-tabs" [class]="'el-tabs--' + tabPosition" [ngClass]="{
        'el-tabs--card': type === 'card',
        'el-tabs--border-card': type === 'border-card'
    }">
        <div *ngIf="tabPosition === 'bottom'" class="el-tabs__content">
            <ng-content></ng-content>
        </div>
        <div [ngClass]="['el-tabs__header', 'is-' + tabPosition]">
            <span
                *ngIf="editable || addable"
                class="el-tabs__new-tab"
                (click)="handleTabAdd()"
                tabindex="0"
            >
                <i class="el-icon-plus"></i>
            </span>
            <el-tab-nav
                [currentName]="currentName"
                (tab-click)="handleTabClick($event)"
                (tab-remove)="handleTabRemove($event)"
                [editable]="editable"
                [type]="type"
                [panes]="panes"
            ></el-tab-nav>
        </div>
        <div *ngIf="tabPosition !== 'bottom'" class="el-tabs__content">
            <ng-content></ng-content>
        </div>
      </div>
    `,
})
export class ElTabs implements OnInit {
    @Input() type: string
    @Input() model: string
    @Input() closable: boolean
    @Input() addable: boolean
    @Input() editable: boolean
    @Input() tabPosition: string = 'top'

    @Output('tab-click') tabClick: EventEmitter<TabPane> = new EventEmitter()
    @Output('tab-remove') tabRemove: EventEmitter<string> = new EventEmitter()
    @Output('edit') edit: EventEmitter<{name: string | null, action: string}> = new EventEmitter()
    @Output('tab-add') tabAdd: EventEmitter<void> = new EventEmitter()
    @Output() modelChange: EventEmitter<string> = new EventEmitter()

    currentName: string
    panes: TabPane[] = []

    constructor() {
    }

    ngOnInit(): void {
        this.currentName = this.model
    }

    handleTabClick({pane: tab}: any): void {
        if (tab.disabled) return;
        this.setCurrentName(tab.name);
        this.tabClick.emit(tab)
    }

    handleTabRemove({pane: tab, event: e}: any): void {
        if (tab.disabled) return;
        e.stopPropagation();
        this.edit.emit({
            name: tab.name,
            action: 'remove'
        })
        this.tabRemove.emit(tab.name)
    }

    handleTabAdd(): void {
        this.edit.emit({
            name: null,
            action: 'add'
        })
        this.tabAdd.emit()
    }

    setCurrentName(value: string): void {
        this.currentName = value;
        this.modelChange.emit(value)
    }

    addPanes(item: TabPane): void {
        // const index = this.$slots.default.filter(item => {
        //   return item.elm.nodeType === 1 && /\bel-tab-pane\b/.test(item.elm.className);
        // }).indexOf(item.$vnode);
        // this.panes.splice(index, 0, item);
        this.panes.push(item)
    }

    removePanes(item: TabPane): void {
        const panes = this.panes;
        const index = panes.indexOf(item);
        if (index > -1) {
            panes.splice(index, 1);
        }
    }
}
