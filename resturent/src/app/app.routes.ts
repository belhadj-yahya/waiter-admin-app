import { Routes } from '@angular/router';
import { ItemsForOrder } from './items-for-order/items-for-order';
import { SeePlacedOrder } from './see-placed-order/see-placed-order';
import { MainPage } from './main-page/main-page';
import { EditOrder } from './edit-order/edit-order';
import { Login } from './login/login';
import { AdminSimplePage } from './admin-simple-page/admin-simple-page';

export const routes: Routes = [
    {path:"",component:MainPage},
    {path:"place_order",component:ItemsForOrder},
    {path:"see_order/:id",component:SeePlacedOrder},
    {path:"see_order",component:MainPage},
    {path:"edit_order",component:EditOrder},
    {path:"login",component:Login},
    {path:"admin_page",component:AdminSimplePage}
];
