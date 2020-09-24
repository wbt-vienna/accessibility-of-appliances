<template>
    <div class="container">
        <h2>Neues Gerät erfassen</h2>
        <div>
            <div class="form-group">
                Für die Eintragung von Geräten wird die Katalogisierung von <a href="https://geizhals.at/" target="_blank">geizhals.at</a>
                verwendet. Suchen Sie nach Kategorie, Hersteller oder Typenbezeichnung um das zu testende Gerät zu finden. Die Eingabe in das Suchfeld startet die Suche automatisch.
            </div>
            <div class="form-group">
                <label for="search">Produktsuche</label>
                <input id="search" type="search" v-model="query" @input="search()" placeholder="Kategorie, Hersteller, Typenbezeichnung" class="form-control" autocomplete="off"/>
            </div>
            <div class="form-group" v-if="isSearching">
                <span>es wird gesucht...</span>
            </div>
            <div class="">
                <ul style="list-style-type: none; padding: 0" aria-label="Suchergebnisse, die Links in der Liste führen zum Produkt auf geizhals.at und werden in einem neuen Tab geöffnet">
                    <li v-for="product in searchResults.products">
                        <div class="row no-gutters my-4 my-sm-3">
                            <div class="col-sm-9 mb-2 position-relative" style="min-height: 48px">
                                <img :src="product.img" style="position: absolute; top: 2px" aria-hidden="true"/>
                                <a title="externer Link des Produkts auf geizhals.at in neuem Tab" target="_blank" :href="'https://geizhals.at/' + product.id" style="padding-left: 50px; display: block">{{product.label}}</a>
                            </div>
                            <button @click="select(product)" class="col-sm-3 form-control btn-primary" aria-label="Gerät auswählen">Wählen</button>
                        </div>
                    </li>
                </ul>
            </div>
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