<template>
    <div>
        <h2>Neues Gerät erfassen</h2>
        <div class="row">
            <label for="search" class="two columns">Produktsuche</label>
            <input id="search" type="text" v-model="query" @input="search()" placeholder="Produktname" class="eight columns"/>
        </div>
        <ul style="list-style-type: none">
            <li v-for="product in searchResults.products" class="row">
                <div class="eight columns offset-by-two">
                    <button @click="select(product)">Wählen</button>
                    <img :src="product.img"/>
                    <a target="_blank" :href="'https://geizhals.at/' + product.id">{{product.label}}</a>
                </div>
            </li>
        </ul>
        <div v-if="newEntry">
            <div class="row">
                <label for="product" class="two columns">Produkt</label>
                <span id="product" class="eight columns" v-if="newEntry.product"><a target="_blank" :href="'https://geizhals.at/' + newEntry.product.id">{{newEntry.product.label}}</a></span>
            </div>
            <div class="row">
                <label for="category" class="two columns">Kategorie</label>
                <span id="category" class="eight columns" v-if="newEntry.category">{{newEntry.category.label}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import {util} from "../js/util/util";
    import {Entry} from "../js/model/Entry";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                searchResults: {},
                newEntry: JSON.parse(JSON.stringify(new Entry())),
                query: ""
            }
        },
        methods: {
            search() {
                if (!thiz.query) {
                    thiz.resetSearch();
                    return;
                }
                util.debounce(() => {
                    dataService.getSearchResults(thiz.query).then(result => {
                        console.log(result.products);
                        thiz.searchResults = result;
                    });
                }, 1000);
            },
            select(product) {
                thiz.resetSearch();
                thiz.$set(thiz.newEntry, 'product', product);
                dataService.getCategory(product.label).then(category => {
                    thiz.$set(thiz.newEntry, 'category', category);
                });
            },
            resetSearch() {
                thiz.query = "";
                thiz.searchResults = {};
            }
        },
        mounted() {
            thiz = this;
        },
    }
</script>

<style scoped>
</style>