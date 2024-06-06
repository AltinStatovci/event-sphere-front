<script setup lang="ts">
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol
} from 'mdb-vue-ui-kit';
</script>

<template>
    <MDBFooter :text="['center', 'lg-start']">
      <!-- Grid container -->
      <MDBContainer class="p-4">
        <!--Grid row-->
        <MDBRow>
          <!--Grid column-->
          <MDBCol md="12" class="mb-4 mb-md-0">
            <h5 class="text-uppercase">Event Sphere</h5>
  
            <p>
                Welcome to EventSphere, your ultimate destination for unforgettable experiences!
                 Whether you're a music enthusiast eager to catch your favorite artist live,
                  a sports fan seeking thrilling game-day action, or an adventure lover looking for exciting outdoor activities,
                   we have you covered. Our easy-to-use platform allows you to browse and purchase tickets for concerts, sports events,
                    and a variety of outdoor adventures. Discover upcoming events, secure your seats, and get ready to create lasting memories with EventSphere.
                     Start your journey today and never miss out on the excitement!
            </p>
          </MDBCol>
        </MDBRow>
        <!--Grid row-->
      </MDBContainer>
      <!-- Grid container -->
  
      <!-- Copyright -->
      <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2)">
        © 2024 Copyright:
      </div>
      <!-- Copyright -->
    </MDBFooter>
  </template>

