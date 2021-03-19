import Vue from 'vue'
import VueRouter from 'vue-router'
import NewView from '../vue-components/newView.vue'
import ListView from '../vue-components/listView.vue'
import LoginView from '../vue-components/loginView.vue'
import SearchView from '../vue-components/newSearchView.vue'
import ShowView from "../vue-components/showView.vue"
import InfoView from "../vue-components/infoView.vue";
import DiscussionView from "../vue-components/discussionView.vue";
import DiscussionSingleView from "../vue-components/discussionSingleView.vue";
import * as log from 'loglevel';
import {databaseService} from "./service/data/databaseService";
import {localStorageService} from "./service/data/localStorageService";
import {i18nService} from "./service/i18nService";
import VueMain from "../vue-components/vue-main.vue";

function init() {
    window.log = log;

    let routes = [
        {path: '/edit', component: NewView, name: 'edit', params: {newEntry: null}},
        {path: '/new', component: SearchView},
        {path: '/list', component: ListView},
        {path: '/login', component: LoginView},
        {path: '/edit/:id', component: NewView},
        {path: '/view/:id', component: ShowView},
        {path: '/view/product/:productid', component: ShowView},
        {path: '/info', component: InfoView},
        {path: '/discussion', component: DiscussionView},
        {path: '/discussion/:questionid', component: DiscussionSingleView},
        {path: '*', redirect: '/info'}
    ];

    let router = new VueRouter({
        routes: routes,
        scrollBehavior (to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return { x: 0, y: 0 }
            }
        }
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
        router: router,
        data: function () {
            return {
                linkList: [
                    {name: 'Startseite', to: '/info'},
                    {name: 'Geräte', to: '/list'},
                    {name: 'Neu', to: '/new'},
                    {name: 'Diskussion', to: '/discussion'},
                    {name: 'Login', to: '/login'},
                ]
            }
        },
        components: {VueMain}
    }).$mount('#app');
    initMatomoAnalytics();
}
init();

function initMatomoAnalytics() {
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["setDoNotTrack", true]);
    _paq.push(["disableCookies"]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
        var u="//analytics.wbt.wien/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '4']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();
}