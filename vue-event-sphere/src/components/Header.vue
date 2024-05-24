<template>
  <header>
    <MDBNavbar expand="lg" light bg="light" container>
      <MDBNavbarBrand href="#">EventSphere</MDBNavbarBrand>
      <MDBNavbarToggler
        @click="collapse1 = !collapse1"
        target="#navbarSupportedContent"
      ></MDBNavbarToggler>
      <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
        <MDBNavbarNav class="mb-2 mb-lg-0">
          <MDBNavbarItem to="#">
            Home
          </MDBNavbarItem>
       
          <MDBNavbarItem>
            <!-- Navbar dropdown -->
            <MDBDropdown class="nav-item" v-model="dropdown1">
              <MDBDropdownToggle
                tag="a"
                class="nav-link"
                @click="dropdown1 = !dropdown1"
                >Events</MDBDropdownToggle
              >
              <MDBDropdownMenu aria-labelledby="dropdownMenuButton">
                <MDBDropdownItem to="#">Sports</MDBDropdownItem>
                <MDBDropdownItem to="#">Concerts</MDBDropdownItem>
                <MDBDropdownItem to="#">Outside Activities</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>
          <MDBNavbarItem to="#">
            About us
          </MDBNavbarItem>
          <MDBNavbarItem to="#">
            Contact
          </MDBNavbarItem>
          <!-- Search form -->
          <form class="d-flex input-group w-auto">
            <input
              type="search"
              class="form-control"
              placeholder="Search"
              aria-label="Search"
            />
            <MDBBtn outline="primary">
              Search
            </MDBBtn>
          </form>
        </MDBNavbarNav>
       <MDBNavbarNav class="ms-auto">
  <MDBNavbarItem class="ms-auto">
    <a href="#" class="nav-link">
      <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/icons/person-circle.svg" alt="Profile" class="rounded-circle" style="width: 30px; height: 30px;">
    </a>
  </MDBNavbarItem>
</MDBNavbarNav>

       
      </MDBCollapse>
    </MDBNavbar>
  </header>
</template>

<script>
  import {
    MDBBtn,
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
  } from 'mdb-vue-ui-kit';
  import { ref } from 'vue';

  export default {
    components: {
      MDBBtn,
      MDBNavbar,
      MDBNavbarToggler,
      MDBNavbarBrand,
      MDBNavbarNav,
      MDBNavbarItem,
      MDBCollapse,
      MDBDropdown,
      MDBDropdownToggle,
      MDBDropdownMenu,
      MDBDropdownItem
    },
    setup() {
      const collapse1 = ref(false);
      const dropdown1 = ref(false);
      return {
        collapse1,
        dropdown1
      }
    }
  };
</script>

<style>
  /* Add any custom styles here */
</style>
