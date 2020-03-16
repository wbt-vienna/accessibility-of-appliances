<template>
    <div class="wrapper">
        <h2>Neues Gerät erfassen</h2>
        <div>
            <div class="row">
                <p class="eleven columns">
                    Für die Eintragung von Geräten wird die Katalogisierung von <a href="https://geizhals.at/" target="_blank">geizhals.at</a>
                    verwendet. Suchen Sie nach Kategorie, Hersteller oder Typenbezeichnung um das zu testende Gerät zu finden. Die Eingabe in das Suchfeld startet die Suche automatisch.
                </p>
            </div>

            <div class="row">
                <label for="search" class="three columns center">Produktsuche</label>
                <input id="search" type="search" v-model="query" @input="search()" placeholder="Kategorie, Hersteller, Typenbezeichnung" class="eight columns" autocomplete="off"/>
            </div>
            <div class="row" v-if="isSearching">
                <span class="eight columns offset-by-three">es wird gesucht...</span>
            </div>
            <ul style="list-style-type: none" aria-label="Suchergebnisse" class="eight columns offset-by-three">
                <li v-for="product in searchResults.products" class="row" style="margin-top: 0.5em" >
                    <div class="nine columns" >
                        <img :src="product.img" style="margin-right: 1em" aria-hidden="true"/>
                        <a title="externer Link des Produkts auf geizhals.at in neuem Tab" target="_blank" :href="'https://geizhals.at/' + product.id">{{product.label}}</a>
                    </div>
                    <button @click="select(product)" class="three columns" aria-label="Gerät auswählen">Wählen</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import {util} from "../js/util/util";
    import {Entry} from "../js/model/Entry";
    import {databaseService} from "../js/service/data/databaseService";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                searchResults: {},
                newEntry: null,
                query: "",
                isSearching: false
            }
        },
        methods: {
            search() {
                thiz.searchResults = {};
                if (!thiz.query) {
                    util.clearDebounce("SEARCH");
                    thiz.resetSearch();
                    thiz.isSearching = false;
                    return;
                }
                thiz.isSearching = true;
                util.debounce(() => {
                    dataService.getSearchResults(thiz.query).then(result => {
                        thiz.searchResults = result;
                        thiz.isSearching = false;
                    });
                }, 500, "SEARCH");
            },
            select(product) {
                thiz.resetSearch();
                thiz.$set(thiz.newEntry, 'product', product);
                dataService.getCategory(product.label).then(category => {
                    thiz.$set(thiz.newEntry, 'category', category);
                    thiz.$router.push({name: 'edit', params: {newEntry: thiz.newEntry}});
                });
            },
            resetSearch() {
                thiz.query = "";
                thiz.searchResults = {};
            }
        },
        mounted() {
            thiz = this;
            thiz.newEntry = JSON.parse(JSON.stringify(new Entry()));
        },
    }
</script>

<style scoped>
    @media (min-width: 550px) {
        .row {
            display: flex;
        }

        .row > label {
            display: flex;
        }

        .row > label.center {
            align-items: center;
        }
    }

    .row {
        margin-bottom: 1em;
    }

    ul {
        list-style-type: none;
        margin-bottom: 0;
    }
</style>