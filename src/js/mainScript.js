import Vue from 'vue'
import VueRouter from 'vue-router'
import NewView from '../vue-components/newView.vue'
import ListView from '../vue-components/listView.vue'
import * as log from 'loglevel';
import {databaseService} from "./service/data/databaseService";
import {localStorageService} from "./service/data/localStorageService";

function init() {
    window.log = log;

    let routes = [
        {path: '/new', component: NewView},
        {path: '/list', component: ListView},
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

    Vue.use(VueRouter);
    let app = new Vue({
        router
    }).$mount('#app');
}
init();