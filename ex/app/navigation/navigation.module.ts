import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NavRoutingModule } from './navigation.routing'
import { ElModule } from '../../../src/element-angular.module'

import { ExNavigationMainComponent } from './main/main.component'
import { ExMenuComponent } from './menu/menu.component'
import { ExStepsComponent } from './steps/steps.component'
import { ExSharedModule } from '../shared/module'
import { ExDropdownComponent } from './dropdown/dropdown.component'
import { ExBreadcrumbComponent } from './breadcrumb/breadcrumb.component'
import { ExTabsComponent } from './tabs/tabs.component'

@NgModule({
  declarations: [
    ExNavigationMainComponent,
    ExMenuComponent,
    ExStepsComponent,
    ExDropdownComponent,
    ExBreadcrumbComponent,
    ExTabsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NavRoutingModule,
    ElModule,
    ExSharedModule,
  ],
  exports: [ExNavigationMainComponent],
  providers: [],
})
export class NavigationModule {
}
