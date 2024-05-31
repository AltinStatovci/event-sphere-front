<script setup>
 defineProps({
    event: {
      type: Object,
      required: true
    }
  });
</script>

<template>
    <div>

    <div class="d-flex my-5">
        <div class="card mx-5" style="width: 23rem;">
            <img src="https://imgs.ticombo.com//tc-images-main/thumbnail/events/other/banner/crickett.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">{{ event.eventName }}</h5>
                <p class="card-text">{{ event.description }}</p>
                <p class="card-text">{{ event.location }}</p>
                <p class="card-text">{{ event.startDate }}</p>
                <p class="card-text">{{ event.endDate }}</p>
                <a href="#" class="btn btn-primary">Go to event</a>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
</style>