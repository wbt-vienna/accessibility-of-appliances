<template>
    <div>
        <h2>Erfasste Geräte</h2>
        <ul>
            <li v-for="entry in entries">
                <button class="one column" title="Bearbeiten" @click="edit(entry)"><i class="fas fa-edit"></i></button>
                <button class="one column" title="Löschen" @click="remove(entry)"><i class="fas fa-trash-alt"/></button>
                <span>{{entry.product.label}}</span>
            </li>
        </ul>
        <span v-if="entries && entries.length === 0">(keine erfassten Geräte)</span>
    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import $ from 'jquery';
    import {constants} from "../js/util/constants";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
                entries: null
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
        padding: 0;
        margin: 5px;
    }
</style>