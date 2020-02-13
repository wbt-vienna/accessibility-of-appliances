<template>
    <div>
        <h2>Neues Gerät erfassen</h2>

    </div>
</template>

<script>
    import {dataService} from "../js/service/data/dataService";
    import {Entry} from "../js/model/Entry";

    let thiz = null;
    export default {
        components: {},
        data() {
            return {
            }
        },
        methods: {
            init() {
            }
        },
        mounted() {
            thiz = this;
            dataService.saveEntry(new Entry({brand: 'brand', type: 'type', category: 'category'}));
            dataService.getEntries().then(entries => {
                log.warn(entries);
            })
        },
    }
</script>

<style scoped>
</style>