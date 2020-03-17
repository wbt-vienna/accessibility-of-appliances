<template>
    <div style="margin-top: 2em">
        <div v-if="loggedIn">
            <span>Bereits eingeloggt!</span>
            <button @click="logout()">Ausloggen</button>
        </div>

        <div v-if="!loggedIn">
            <label for="passwordField">Passwort: </label>
            <input id="passwordField" type="password" v-model="password"/>
            <div style="margin-top: 1.5em">
                <input id="inSavePassword" type="checkbox" v-model="savePassword"/>
                <label style="display: inline-block" for="inSavePassword">Passwort speichern und in Zukunft automatisch einloggen</label>
            </div>
            <button @click="login">Login</button>
            <span v-if="wrongPassword">Falsches Passwort!</span>
        </div>
        <span style="position: absolute; bottom: 2em; left: 1em">Zuletzt aktualisiert: 17.03.2020 b</span>
    </div>
</template>

<script>
    import {databaseService} from "../js/service/data/databaseService";

    let fromRoute = null;
    let thiz = null;
    export default {
        data() {
            return {
                password: '',
                wrongPassword: false,
                savePassword: false,
                loggedIn: databaseService.isLoggedInReadWrite(),
                databaseService: databaseService
            }
        },
        methods: {
            login() {
                thiz.wrongPassword = false;
                databaseService.loginReadWrite(this.password, this.savePassword).then(() => {
                    thiz.$router.push(fromRoute);
                }).catch(() => {
                    thiz.wrongPassword = true;
                });
            },
            logout() {
                databaseService.loginReadonly().then(() => {
                    thiz.loggedIn = false;
                });
            }
        },
        mounted() {
            thiz = this;
        },
        beforeRouteEnter (to, from, next) {
            fromRoute = from.path;
            next();
        },
    }
</script>

<style scoped>
</style>