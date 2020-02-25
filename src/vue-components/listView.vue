<template>
    <div>
        <h2>Erfasste Geräte</h2>
        <h3>Tabelle als Liste (ul)</h3>
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
                    <label class="show-mobile" aria-hidden="true">Bezeichnung: </label>
                    <a target="_blank" aria-label="Bezeichnung" :href="'https://geizhals.at/' + entry.product.id">{{entry.product.label}}</a>
                </div>
                <div class="four columns">
                    <label class="show-mobile" aria-hidden="true">Bewertung: </label>
                    <div class="bewertung" aria-label="Bewertung" style="display: inline-block">{{Math.round(entry.score)}} %</div>
                </div>
                <div v-if="isLoggedIn" class="four columns show-mobile" aria-hidden="false">
                    <label style="display: inline-block">Aktionen: </label>
                    <button title="Bearbeiten" @click="edit(entry)"><i class="fas fa-edit"></i></button>
                    <button title="Löschen" @click="remove(entry)"><i class="fas fa-trash-alt"/></button>
                </div>
            </li>
        </ul>

        <h3>Tabelle mit HTML-Table</h3>
        <table class="u-full-width">
            <tr class="row">
                <th class="eight columns" scope="col">Gerätebezeichnung</th>
                <th class="three columns" scope="col">Gesamtbewertung</th>
            </tr>
            <tr v-for="entry in entries" class="row">
                <td class="eight columns">{{entry.product.label}}</td>
                <td class="three columns" style="text-align: center;">{{Math.round(entry.score)}} %</td>
            </tr>
        </table>
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