<template>
    <div class="wrapper">
        <h2>Erfasste Geräte</h2>
        <div class="row hide-mobile" style="font-weight: bold" aria-hidden="true">
            <span class="eight columns">Titel</span>
            <span class="four columns" style="text-align: center">Bewertung</span>
        </div>
        <ul>
            <li v-for="entry in entries" class="row">
                <div class="eight columns">
                    <div class="show-desktop" aria-hidden="true" v-if="isLoggedIn" >
                        <button title="Bearbeiten" @click="edit(entry)"><i class="fas fa-edit"></i></button>
                        <button title="Löschen" @click="remove(entry)"><i class="fas fa-trash-alt"/></button>
                    </div>
                    <label for="link" class="show-mobile" aria-hidden="false">Bezeichnung: </label>
                    <a id="link" target="_blank" aria-label="externer Link des Geräts auf geizhals.at" :href="'https://geizhals.at/' + entry.product.id">{{entry.product.label}}</a>
                </div>
                <div class="four columns">
                    <label class="show-mobile" aria-hidden="false" for="score">Bewertung: </label>
                    <div id="score" class="bewertung" aria-label="Bewertung" style="display: inline-block">{{Math.round(entry.score)}} %</div>
                </div>
                <div v-if="isLoggedIn" class="four columns show-mobile" aria-hidden="false">
                    <label for="btngroup" style="display: inline-block">Aktionen: </label>
                    <div id="btngroup" role="group" style="display: inline-block">
                        <button title="Bearbeiten" @click="edit(entry)"><i aria-hidden="true" class="fas fa-edit"></i><span style="display: none" aria-hidden="false">Eintrag bearbeiten</span></button>
                        <button title="Löschen" @click="remove(entry)"><i aria-hidden="true" class="fas fa-trash-alt"/><span style="display: none" aria-hidden="false">Eintrag löschen</span></button>
                    </div>
                </div>
            </li>
        </ul>
        <span v-if="entries && entries.length === 0">(keine erfassten Geräte)</span>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import $ from 'jquery';
    import {constants} from "../js/util/constants";
    import {databaseService} from "../js/service/data/databaseService";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                entries: null,
                isLoggedIn: databaseService.isLoggedInReadWrite()
            }
        },
        methods: {
            init() {
                dataService.getEntries().then(entries => {
                    thiz.entries = entries;
                })
            },
            edit(entry) {
                thiz.$router.push('/edit/' + entry.id);
            },
            remove(entry) {
                if (!confirm(`Wollen Sie den Eintrag "${entry.product.label}" wirklich löschen?`)) {
                    return;
                }
                dataService.remove(entry.id).then(() => {
                    thiz.init();
                });
            }
        },
        mounted() {
            thiz = this;
            thiz.init();
            $(document).on(constants.EVENT_DB_PULL_UPDATED, thiz.init);
        },
        beforeDestroy() {
            $(document).off(constants.EVENT_DB_PULL_UPDATED, thiz.init);
        },
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
    }

    button {
        padding: 0 0.5em;
        margin: 5px;
    }

    @media (max-width: 550px) {
        ul li {
            border: 1px solid gray;
        }
    }

    @media (min-width: 550px) {
        ul li .bewertung {
            text-align: center;
            width: 100%;
        }
    }
</style>