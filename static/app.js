const Loading = {template: '<loading-view></loading-view>'}
const Homepage = {template: '<homepage-view></homepage-view>'}
const Restaurant = {template: '<restaurant-view></restaurant-view>'}
const Cart = {template: '<cart-view></cart-view>'}
const Checkout = {template: '<checkout-view></checkout-view>'}
const Orders = {template: '<orders-view></orders-view>'}
const ManagerRestaurant = {template: '<manager-restaurant-view></manager-restaurant-view>'}
const ManagerOrders = {template: '<manager-orders-view></manager-orders-view>'}

const routes = [
    {path: '/', name: 'loading', component: Loading},
    {path: '/homepage', name: 'homepage', component: Homepage},
    {path: '/logout', name: 'logout', component: Homepage},
    {path: '/homepage/loggedIn', name: 'homepageUser', component: Homepage},
    {path: '/restaurant/:id', name: 'restaurant', component: Restaurant},
    {path: '/cart', name: 'cart', component: Cart},
    {path: '/checkout', name: 'checkout', component: Checkout},
    {path: '/orders', name: 'orders', component: Orders},
    {path: '/manager-restaurant', name: 'managerRestaurant', component: ManagerRestaurant},
    {path: '/manager-orders', name: 'managerOrders', component: ManagerOrders}
]

const router = new VueRouter({
    mode: 'hash',
    routes: routes
})

var app = new Vue({
    router,
    el: "#app"
})