<template>
    <div class="h5-pdf-content"
        v-on:touchstart="detailPdfTouchstart"
        v-on:touchend="detailPdfTouchend"
    >
        <VuePdf
            v-if="src.url != undefined && src.url != ''"
            :page="page"
            v-bind:src="src.url"
            @password="detailPdfPassword"
            @progress="detailPdfProgress"
            @num-pages="detailPdfNumpages"
            @error="pdfLoadError"
        />

        <div class="pdf-page-show-cont">
            <div class="pdf-page-show-content">
            <span class="pdf-page-show-page">{{page}}</span><span class="pdf-page-show-split">/</span><span class="pdf-page-show-total">{{total}}</span>
            </div>
        </div>

        <div v-if="loading" class="pdf-load-mock">
            <div class="pdf-load-mock-content">
                <XCircle
                    :percent="loadPercent"
                    :stroke-width="12"
                    :trail-width="12"
                    :stroke-color="['#04be02', '#999999']"
                    trail-color="#D9D9D9">
                    <span style="color:#04be02">{{ loadPercent }}%</span>
                </XCircle>
            </div>
        </div>
    </div>
</template>

<script src="./Index.js"></script>
<style lang="less" scoped src="./Index.less"></style>

<style>
.h5-pdf-content .annotationLayer {
    transform: scale(1) !important;
}
</style>
