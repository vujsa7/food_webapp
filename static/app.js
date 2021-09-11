const Loading = {template: '<loading-view></loading-view>'}
const Homepage = {template: '<homepage-view></homepage-view>'}
const HomepageLogout = {template: '<homepage-view></homepage-view>'}
const HomepageLoggedIn = {template: '<homepage-view></homepage-view>'}
const Restaurant = {template: '<restaurant-view></restaurant-view>'}
const Cart = {template: '<cart-view></cart-view>'}
const Checkout = {template: '<checkout-view></checkout-view>'}
const Orders = {template: '<orders-view></orders-view>'}
const ManagerRestaurant = {template: '<manager-restaurant-view></manager-restaurant-view>'}
const ManagerOrders = {template: '<manager-orders-view></manager-orders-view>'}
const ManagerCustomers = {template: '<manager-customers-view></manager-customers-view>'}
const AdministratorCustomers = {template: '<administrator-customers-view></administrator-customers-view>'}
const EditProfile = {template: '<edit-profile-view></edit-profile-view>'}
const DeliverOrders = {template: '<deliver-orders-view></deliver-orders-view>'}

const routes = [
    {path: '/', name: 'loading', component: Loading},
    {path: '/homepage', name: 'homepage', component: Homepage},
    {path: '/logout', name: 'logout', component: HomepageLogout},
    {path: '/homepage/loggedIn', name: 'homepageUser', component: HomepageLoggedIn},
    {path: '/restaurant/:id', name: 'restaurant', component: Restaurant},
    {path: '/cart', name: 'cart', component: Cart},
    {path: '/checkout', name: 'checkout', component: Checkout},
    {path: '/orders', name: 'orders', component: Orders},
    {path: '/manager-restaurant', name: 'managerRestaurant', component: ManagerRestaurant},
    {path: '/manager-orders', name: 'managerOrders', component: ManagerOrders},
    {path: '/manager-customers', name: 'managerCustomers', component: ManagerCustomers},
    {path: '/administrator-customers', name: 'administratorCustomers', component: AdministratorCustomers},
    {path: '/edit-profile', name: 'editProfile', component: EditProfile},
    {path: '/deliver-orders', name: 'deliverOrders', component: DeliverOrders},
]

const router = new VueRouter({
    mode: 'hash',
    routes: routes
})

var app = new Vue({
    router,
    el: "#app"
})