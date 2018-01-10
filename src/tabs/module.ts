import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ElTabs } from './tabs'
import { ElTabPane } from './tab-pane'
import { ElTabNav } from './tab-nav'
import { ElTabBar } from './tab-bar'

@NgModule({
    declarations: [
        ElTabs,
        ElTabPane,
        ElTabNav,
        ElTabBar,
    ],
    exports: [ElTabs, ElTabPane],
    imports: [CommonModule],
    entryComponents: [ElTabs],
})
export class ElTabsModule {
    static forRoot(): ModuleWithProviders {
        return { ngModule: ElTabsModule, providers: [] }
    }
}
