import Vue from 'vue'
import VueRouter from 'vue-router'
import NewView from '../vue-components/newView.vue'
import ListView from '../vue-components/listView.vue'
import LoginView from '../vue-components/loginView.vue'
import SearchView from '../vue-components/newSearchView.vue'
import * as log from 'loglevel';
import {databaseService} from "./service/data/databaseService";
import {localStorageService} from "./service/data/localStorageService";
import {i18nService} from "./service/i18nService";

function init() {
    window.log = log;

    let routes = [
        {path: '/edit', component: NewView, name: 'edit', params: {newEntry: null}},
        {path: '/new', component: SearchView},
        {path: '/list', component: ListView},
        {path: '/login', component: LoginView},
        {path: '/edit/:id', component: NewView},
        {path: '*', redirect: '/list'}
    ];

    let router = new VueRouter({
        routes
    });

    router.beforeEach((to, from, next) => {
        if (!databaseService.isLoggedIn()) {
            let password = localStorageService.getPassword();
            let promise = null;
            if (password) {
                promise = databaseService.loginReadWrite(password, true);
            } else {
                promise = databaseService.loginReadonly();
            }
            promise.then(() => {
                next();
            });
        } else {
            next();
        }
    });

    Vue.directive('focus', {
        inserted: function (el) {
            el.focus()
        }
    });

    Vue.filter('translate', function (key) {
        return i18nService.translate(key);
    });

    Vue.use(VueRouter);
    let app = new Vue({
        router
    }).$mount('#app');
}
init();