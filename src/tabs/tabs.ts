import { Component, Input, Output, EventEmitter, OnInit, ContentChildren, QueryList, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core'
import { ElTabPane } from './tab-pane'

@Component({
    selector: 'el-tabs',
    template: `
    <div class="el-tabs" [ngClass]="tabClasses">
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
                [panes]="panes.toArray()"
            ></el-tab-nav>
        </div>
        <div *ngIf="tabPosition !== 'bottom'" class="el-tabs__content">
            <ng-content></ng-content>
        </div>
      </div>
    `,
})
export class ElTabs implements OnInit, AfterContentInit, OnChanges {
    @Input() type: string
    @Input('model') currentName: string
    @Input() closable: boolean
    @Input() addable: boolean
    @Input() editable: boolean
    @Input('tab-position') tabPosition: string = 'top'

    @Output('tab-click') tabClick: EventEmitter<string> = new EventEmitter()
    @Output('tab-remove') tabRemove: EventEmitter<string> = new EventEmitter()
    @Output('edit') edit: EventEmitter<{name: string | null, action: string}> = new EventEmitter()
    @Output('tab-add') tabAdd: EventEmitter<void> = new EventEmitter()
    @Output() modelChange: EventEmitter<string> = new EventEmitter()

    @ContentChildren(ElTabPane) panes: QueryList<ElTabPane>

    private counter: number = 0

    constructor() {
        console.log(this)
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.type, changes)
    }

    ngAfterContentInit(): void {
        this.autoSetCurrentName()
    }

    get tabClasses(): {} {
        return {
            ['el-tabs--' + this.tabPosition]: true,
            'el-tabs--card': this.type === 'card',
            'el-tabs--border-card': this.type === 'border-card'
        }
    }

    handleTabClick(tab: ElTabPane): void {
        if (tab.disabled) return;
        this.setCurrentName(tab.name);
        this.tabClick.emit(tab.name)
    }

    handleTabRemove(tab: ElTabPane): void {
        if (tab.disabled) return;
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

    autoSetCurrentName(): void {
        if (!this.panes.some(pane => pane.active)) {
            this.setCurrentName(this.panes.first.name)
        }
    }

    getRandomName(): string {
        return `@@random-${this.counter++}`
    }
}
