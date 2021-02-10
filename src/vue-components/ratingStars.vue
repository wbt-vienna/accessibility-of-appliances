<template>
    <div style="display: inline-block">
        <div class="rating-box" aria-hidden="true" :title="Math.round(percentage) + '%'">
            <div class="rating" :style="'width:' + percentage + '%;'"></div>
        </div>
        <span class="sr-only">{{Math.round(percentage) + '%'}}</span>
        <span v-if="count > 1" :title="count + ' Bewertungen für dieses Gerät'"><span class="sr-only">Anzahl der Bewertungen:</span>{{count}} <span class="far fa-file-alt" aria-hidden="true"></span></span>
    </div>
</template>

<script>
    export default {
        props: {
            'percentage': Number,
            'count': Number
        },
        components: {},
        data() {
            return {
                showExamples: null,
            }
        },
        computed: {
        },
        methods: {
        },
        mounted() {
        },
    }
</script>

<style scoped>
    /* rating box with fontawesome 5 inspired from - https://stackoverflow.com/a/49343426/6908282
    Whitspace in pseudo elements: https://stackoverflow.com/a/5467676/6908282
    replace "\f111" with \f005 to make it a star */

    .rating-box {
        position:relative;
        vertical-align: middle;
        font-family: FontAwesome;
        display:inline-block;
        color: orange;
    }
    .rating-box:before{
        font-family: "Font Awesome 5 Free";
        /* white-space: pre; */
        font-weight: 400;
        content: "\f005 \f005 \f005 \f005 \f005"; /* You can add gap by simply adding more spaces in between or you can use \00a0*/
    }
    .rating-box .rating {
        position: absolute;
        left:0;
        top:0;
        white-space:nowrap;
        overflow:hidden;
        color: orange;
    }
    .rating-box .rating:before {
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        /* white-space: pre; */
        content: "\f005 \f005 \f005 \f005 \f005";
    }
</style>