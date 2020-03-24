<template>
    <div class="wrapper">
        <h2>Erfasste Geräte</h2>
        <h3>Filter</h3>
        <div class="row">
            <p>Info: Filterkriterien (Freitextsuche oder Kategorie) werden bei Änderung sofort übernommen und die Liste der Geräte an die Filterkriterien angepasst.</p>
        </div>
        <div class="row">
            <label for="inText" class="three columns">Freitextsuche</label>
            <input id="inText" type="search" class="seven columns" style="height: 1.5em;" v-model="filterOptions.text" @input="filterChanged()"/>
        </div>
        <div class="row">
            <label for="category" class="three columns">Kategorie</label>
            <select id="category" type="search" class="seven columns" @change="filterChanged()" v-model="filterOptions.category">
                <option selected value="">alle Kategorien</option>
                <option v-for="categoryId in Object.keys(categories)" :value="categoryId">{{categories[categoryId]}}</option>
                <option selected value="UNCONFIRMED">nicht verifizierte Einträge</option>
            </select>
        </div>
        <div class="row">
            <label for="scoreType" class="three columns">Anzuzeigende Bewertung für Zielgruppe</label>
            <select id="scoreType" type="search" class="seven columns" @change="filterChanged()" v-model="filterOptions.scoreType">
                <option selected value="">Gesamtbewertung</option>
                <option v-for="targetGroupId in constants.TARGETGROUPS" :value="targetGroupId">{{targetGroupId | translate}}</option>
            </select>
        </div>

        <h3>Liste der Einträge</h3>
        <div class="row hide-mobile" style="font-weight: bold" aria-hidden="true">
            <span class="six columns">Titel</span>
            <span class="three columns">Bewertung</span>
            <span v-if="isLoggedIn || (filteredEntries && filteredEntries.filter(e => e.pendingConfirmation).length > 0)" class="three columns">Aktionen</span>
        </div>
        <span class="only-screenreader">Die Links in der Liste führen zum Produkt auf geizhals.at und werden in einem neuen Tab geöffnet.</span>
        <span class="only-screenreader">Die Liste ist absteigend nach Bewertung sortiert, beste Bewertung zuerst.</span>
        <span class="only-screenreader" aria-live="assertive" v-if="filteredEntries">{{filteredEntries.length}} angezeigte Einträge</span>
        <ul>
            <li v-for="entry in filteredEntries" class="row">
                <div class="six columns">
                    <i v-if="entry.pendingConfirmation" class="fas fa-question-circle" title="nicht verifizierter Eintrag eines anonymen Users"></i>
                    <label for="link" class="show-mobile" aria-hidden="true">Bezeichnung: </label>
                    <label for="link" class="only-screenreader">Bezeichnung</label>
                    <a id="link" target="_blank" title="externer Link des Geräts auf geizhals.at in neuem Tab" :href="'https://geizhals.at/' + entry.product.id">{{entry.product.label}}</a>
                </div>
                <div class="three columns">
                    <label class="show-mobile" aria-hidden="true" for="score">Bewertung: </label>
                    <label for="score" class="only-screenreader">{{filterOptions.scoreType ? ('Bewertung für ' + $options.filters.translate(filterOptions.scoreType)) : 'Gesamtbewertung'}}</label>
                    <div id="score" class="bewertung" style="display: inline-block; text-align: left">{{filterOptions.scoreType ? Math.round(entry.scoresByGroup[filterOptions.scoreType]) : Math.round(entry.score)}} %</div>
                </div>
                <div v-if="isLoggedIn || entry.pendingConfirmation || !isLoggedIn" class="three columns">
                    <label class="show-mobile" aria-hidden="true" for="btngroup">Aktionen: </label>
                    <label for="btngroup" class="only-screenreader">Aktionen</label>
                    <div id="btngroup" role="group" style="display: inline-block">
                        <button v-if="isLoggedIn || entry.pendingConfirmation" title="Bearbeiten" @click="edit(entry)"><i aria-hidden="true" class="fas fa-edit"></i></button>
                        <button v-if="isLoggedIn || entry.pendingConfirmation" title="Löschen" @click="remove(entry)"><i aria-hidden="true" class="fas fa-trash-alt"/></button>
                        <button title="Eintrag ansehen" @click="route(entry)"><i aria-hidden="true" class="fas fa-eye"/></button>
                        <button v-if="isLoggedIn && entry.pendingConfirmation" title="Eintrag verifizieren" @click="verify(entry)"><i aria-hidden="true" class="fas fa-check"></i></button>
                    </div>
                </div>
            </li>
        </ul>
        <span v-if="entries && filteredEntries && filteredEntries.length === 0">(keine Geräte gefunden)</span>
        <div class="row" v-if="isLoggedIn">
            <button @click="recalculateAll()">Alle Einträge neu berechnen</button>
            <span v-if="recalculateDone === false" aria-live="assertive">Einträge werden neu berechnet...</span>
            <span v-if="recalculateDone === true" aria-live="assertive">Einträge sind neu berechnet und gespeichert!</span>
        </div>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import $ from 'jquery';
    import {constants} from "../js/util/constants";
    import {util} from "../js/util/util";
    import {databaseService} from "../js/service/data/databaseService";
    import {entryUtil} from "../js/util/entryUtil";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                entries: null,
                filteredEntries: null,
                filterOptions: {
                    category: "",
                    text: "",
                    scoreType: ""
                },
                recalculateDone: undefined,
                categories: {},
                isLoggedIn: databaseService.isLoggedInReadWrite(),
                constants: constants
            }
        },
        methods: {
            init() {
                dataService.getEntries().then(entries => {
                    thiz.entries = entries;
                    thiz.entries.forEach(e => {
                        thiz.categories[e.category.id] = e.category.label;
                    });
                    thiz.filterChanged(0);
                })
            },
            edit(entry) {
                thiz.$router.push('/edit/' + entry.id);
            },
            route(entry){
               thiz.$router.push('/view/' + entry.id)
            },

            remove(entry) {
                if (!confirm(`Wollen Sie den Eintrag "${entry.product.label}" wirklich löschen?`)) {
                    return;
                }
                dataService.remove(entry.id).then(() => {
                    thiz.init();
                });
            },
            verify(entry) {
                entry.pendingConfirmation = false;
                dataService.saveEntry(entry);
            },
            recalculateAll() {
                if (!confirm('Hiermit werden alle Einträge neu berechnet. Dieser Schritt ist nur notwendig, wenn die Bewertungskriterien verändert wurden. Möchen Sie fortfahen?')) {
                    return;
                }
                thiz.recalculateDone = false;
                dataService.getQuestions().then(questions => {
                    let oldEntriesJSON = JSON.stringify(thiz.entries);
                    entryUtil.calculateScores(thiz.entries, questions);
                    if (oldEntriesJSON !== JSON.stringify(thiz.entries)) {
                        dataService.saveEntries(thiz.entries).then(() => {
                            thiz.recalculateDone = true;
                        });
                    } else {
                        thiz.recalculateDone = true;
                    }
                });
            },
            filterChanged(timeout) {
                timeout = timeout === undefined ? 500 : timeout;
                util.debounce(() => {
                    thiz.filteredEntries = thiz.entries;
                    if (thiz.filterOptions.text) {
                        thiz.filteredEntries = thiz.filteredEntries.filter(e => e.product.label.toLowerCase().indexOf(thiz.filterOptions.text.toLowerCase()) !== -1);
                    }
                    if (thiz.filterOptions.category) {
                        if (thiz.filterOptions.category === 'UNCONFIRMED') {
                            thiz.filteredEntries = thiz.filteredEntries.filter(e => !!e.pendingConfirmation);
                        } else {
                            thiz.filteredEntries = thiz.filteredEntries.filter(e => e.category.id === thiz.filterOptions.category);
                        }
                    }
                    thiz.filteredEntries.sort((a, b) => {
                        let score1 = thiz.filterOptions.scoreType ? b.scoresByGroup[thiz.filterOptions.scoreType] : b.score;
                        let score2 = thiz.filterOptions.scoreType ? a.scoresByGroup[thiz.filterOptions.scoreType] : a.score;
                        let diff = score1 - score2;
                        if (!a.pendingConfirmation && !b.pendingConfirmation) {
                            return diff;
                        } else if (a.pendingConfirmation && b.pendingConfirmation) {
                            return diff;
                        } else {
                            return a.pendingConfirmation ? 1 : -1;
                        }
                    });
                }, timeout);
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

    .row {
        margin-bottom: 1em;
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