<template>
    <div class="container">
        <h2>Erfasste Geräte</h2>
        <h3>Filter</h3>
        <div>
            <p>Info: Filterkriterien (Freitextsuche oder Kategorie) werden bei Änderung sofort übernommen und die Liste der Geräte an die Filterkriterien angepasst.</p>
        </div>
        <div class="form-group">
            <label for="inText">Freitextsuche</label>
            <input id="inText" type="search" class="form-control" v-model="filterOptions.text" @input="filterChanged()"/>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
                <label for="category">Kategorie</label>
                <select id="category" class="form-control" @change="filterChanged()" v-model="filterOptions.category">
                    <option selected value="">alle Kategorien</option>
                    <option v-for="categoryId in Object.keys(categories)" :value="categoryId">{{categories[categoryId]}}</option>
                    <option selected value="UNCONFIRMED">nicht verifizierte Einträge</option>
                </select>
            </div>
            <div class="form-group col-md-6">
                <label for="scoreType">Anzuzeigende Bewertung für Zielgruppe</label>
                <select id="scoreType" class="form-control" @change="filterChanged()" v-model="filterOptions.scoreType">
                    <option selected value="">Gesamtbewertung</option>
                    <option v-for="targetGroupId in constants.TARGETGROUPS" :value="targetGroupId">{{targetGroupId | translate}}</option>
                </select>
            </div>
        </div>
        <h3>Liste der Einträge</h3>
        <div class="row d-none d-md-flex" style="font-weight: bold" aria-hidden="true">
            <span class="col-md-6">Titel</span>
            <span class="col-md-2">Bewertung</span>
            <span class="col-md-4">Aktionen</span>
        </div>
        <span class="only-screenreader">Die Links in der Liste führen zum Produkt auf geizhals.at und werden in einem neuen Tab geöffnet.</span>
        <span class="only-screenreader">Die Liste ist absteigend nach Bewertung sortiert, beste Bewertung zuerst.</span>
        <span class="only-screenreader" aria-live="assertive" v-if="filteredEntries">{{filteredEntries.length}} angezeigte Einträge</span>
        <ul class="entries">
            <li v-for="entry in filteredEntries" class="row py-3 py-md-0">
                <div class="col-md-6">
                    <div class="d-md-none" v-if="entry.pendingConfirmation"><i>nicht verifizierter Eintrag</i></div>
                    <label for="link" class="d-md-none" aria-hidden="true">Bezeichnung: </label>
                    <label for="link" class="only-screenreader">Bezeichnung</label>
                    <div class="d-md-inline-block">
                        <i v-if="entry.pendingConfirmation" class="fas fa-question-circle d-none d-md-inline-block" title="nicht verifizierter Eintrag eines anonymen Users"></i>
                        <a id="link" target="_blank" title="externer Link des Geräts auf geizhals.at in neuem Tab" :href="'https://geizhals.at/' + entry.product.id">{{entry.product.label}}</a>
                    </div>
                </div>
                <div class="col-md-2">
                    <label class="d-md-none" aria-hidden="true" for="score">Bewertung: </label>
                    <label for="score" class="only-screenreader">{{filterOptions.scoreType ? ('Bewertung für ' + $options.filters.translate(filterOptions.scoreType)) : 'Gesamtbewertung'}}</label>
                    <div id="score" class="bewertung" style="text-align: left">{{filterOptions.scoreType ? Math.round(entry.scoresByGroup[filterOptions.scoreType]) : Math.round(entry.score)}} %</div>
                </div>
                <div v-if="isLoggedIn || entry.pendingConfirmation || !isLoggedIn" class="col-md-4">
                    <label class="d-md-none mb-1" aria-hidden="true" for="btngroup">Aktionen: </label>
                    <label for="btngroup" class="only-screenreader">Aktionen</label>
                    <div id="btngroup" role="group" class="mb-2 mb-md-0">
                        <button title="Eintrag ansehen" @click="route(entry)" class="btn"><i aria-hidden="true" class="fas fa-eye"/></button>
                        <button v-if="isLoggedIn || entry.pendingConfirmation" title="Bearbeiten" @click="edit(entry)" class="btn"><i aria-hidden="true" class="fas fa-edit"></i></button>
                        <button v-if="isLoggedIn || entry.pendingConfirmation" title="Löschen" @click="remove(entry)" class="btn"><i aria-hidden="true" class="fas fa-trash-alt"/></button>
                        <button v-if="isLoggedIn && entry.pendingConfirmation" title="Eintrag verifizieren" @click="verify(entry)" class="btn"><i aria-hidden="true" class="fas fa-check"></i></button>
                    </div>
                </div>
            </li>
        </ul>
        <span v-if="entries && filteredEntries && filteredEntries.length === 0">(keine Geräte gefunden)</span>
        <div class="form-group" v-if="isLoggedIn" style="margin: 5em 0">
            <button class="form-control btn-primary mb-1" @click="recalculateAll()">Alle Einträge neu berechnen</button>
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
        padding: 0;
    }

    @media (max-width: 767px) {
        ul li {
            outline: 1px solid lightgray;
            outline-offset: -5px;
        }
    }

    .btn {
        border: 1px solid gray;
        padding-left: 1em;
        padding-right: 1em;
    }

    @media (min-width: 993px) {
        .btn {
            padding-left: 1.25em;
            padding-right: 1.25em;
            margin: 0.25em;
        }
    }

    @media (max-width: 767px) {
        .btn {
            padding-left: 1.5em;
            padding-right: 1.5em;
            margin-right: 0.5em;
        }
    }

    .entries label {
        margin: 0.5em 0 0 0;
    }
</style>