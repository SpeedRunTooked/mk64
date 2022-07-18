<template>
    <div class="section-container mx-auto page-wrapper">
        <div class="row">
            <div class="col">
                <SubmitEntryForm></SubmitEntryForm>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SubmitEntryForm from '@/components/forms/SubmitEntryForm.vue';
</script>

<style scoped>
.section-container {
    width: 300px;
}
</style>
