<script setup>
import {ref, reactive, onMounted, computed, watch} from "vue";
import { useEventStore } from "@/store/eventStore.js";
import { useAuthStore } from "@/store/authStore.js";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import SideBar from "@/components/SideBar.vue";
import { useLocationStore } from '@/store/locationStore';
import { useCategoryStore } from "@/store/categoryStore";
import { useTicketStore } from "@/store/ticketStore";
import TicketList from "@/components/TicketList.vue";
import RejectMessageModalComponent from "@/components/modal/RejectMessageModalComponent.vue";

const router = useRouter();
const eventStore = useEventStore();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const eventById = ref(null);
const locationStore = useLocationStore();
const categoryStore = useCategoryStore();
const locations = ref([]);
const categories = ref([]);
const ticketList = ref([]);
const now = new Date();
const formattedNow = now.toISOString(); // Get YYYY-MM-DDTHH:MM format
console.log("Current DateTime:", formattedNow);




const formData = reactive({
  id: '',
  eventName: '',
  description: '',
  startDate: '',
  endDate: '',
  address: '',
  locationId: '',
  categoryID: '',
  organizerID: authStore.id,
  maxAttendance: 0,
  availableTickets: 0,
  dateCreated: new Date().toISOString(),
  image: '',
  isApproved: true,
  scheduleDate: '',
});

const imageUrl = ref('https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg');

const selectedEventId = ref(null);
const isEditMode = ref(false);

const imageValidationMessage = ref('');
const imageInputClass = ref('');

const handleSubmit = async () => {

  try {
    let isApproved;
    if (isSpam(formData.description) || isSpam(formData.eventName) || isSpam(formData.address)) {
      formData.isApproved = false;
      await Swal.fire({
        title: "Event Under Review",
        text: "Your event has gone into review for possible spam.",
        icon: "warning"
      });
    } else {
      formData.isApproved = true;
    }

    if (!formData.image) {
      imageValidationMessage.value = 'You need to upload the image';
      imageInputClass.value = 'is-invalid';
      return;
    } else {
      imageValidationMessage.value = '';
      imageInputClass.value = '';
    }


    if (isEditMode.value) {
      console.log(formData);
      await eventStore.updateEvent(formData);
      Swal.fire({
        title: "Event Updated successfully!",
        icon: "success"
      }).then(() => {
        const redirectUrl = `/`;
        router.push(redirectUrl);
      });
    } else {
      await eventStore.addEvent(formData);
      Swal.fire({
        title: "Event Added successfully!",
        icon: "success"
      }).then(() => {
        const redirectUrl = `/`;
        router.push(redirectUrl);
      });
    }
  } catch (e) {
    await Swal.fire({

      title: "Error!",
      text: e.message,
      icon: "error"
    });
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.image = file;
    imageUrl.value = URL.createObjectURL(file);
    imageValidationMessage.value = '';
    imageInputClass.value = '';
  }
};

const eventList = ref([]);

const allEventList = ref([])
const eventD = ref([])
const eventS = ref([])

const fetchEvents = async () => {
  eventList.value = await eventStore.getEventByOrganizer(authStore.id);
}

const fetchAllEvents = async () => {
  allEventList.value = await eventStore.getEvents()
}
const fetchEventsD = async () => {
  eventD.value = await eventStore.getEventsD(authStore.id)
}
const fetchEventsS = async () => {
  eventS.value = await eventStore.getEventsS(authStore.id)
}

const getAllLocations = async () => {
  try {
    const response = await locationStore.getLocations();
    locations.value = response;
  } catch (err) {
    console.error(err);
  }
};

const getAllCategories = async () => {
  try {
    const response = await categoryStore.getAllCategories();
    categories.value = response;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchEvents();
  fetchEventsD();
  fetchEventsS();
  fetchAllEvents();
  getAllLocations();
  getAllCategories();
})

const deleteEvent = async (eventId) => {
  try {
    await eventStore.deleteEvent(eventId);
    Swal.fire({
      title: "Event Deleted successfully!",
      icon: "success"
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.value,
      icon: "error"
    });
  }
}

const showEditForm = ref(false);

const openEditForm = async (eventId) => {
  selectedEventId.value = eventId;
  isEditMode.value = true;
  showEditForm.value = true;

  eventById.value = await eventStore.getEventById(eventId);

  formData.id = eventById.value.id;
  formData.eventName = eventById.value.eventName;
  formData.description = eventById.value.description;
  formData.startDate = eventById.value.startDate;
  formData.endDate = eventById.value.endDate;
  formData.address = eventById.value.address;
  formData.locationId = eventById.value.locationId;
  formData.categoryID = eventById.value.categoryID;
  formData.maxAttendance = eventById.value.maxAttendance;
  formData.availableTickets = eventById.value.availableTickets;
  formData.image = eventById.value.image;
  formData.scheduleDate = eventById.value.scheduleDate;

  changeTab('eventForm');
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
  return `${formattedDate} - ${formattedTime}`;
};

const activeTab = ref('eventList');

const changeTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'eventForm' && !isEditMode.value) {
    resetForm();
  }
};

const resetForm = () => {
  formData.eventName = '';
  formData.description = '';
  formData.startDate = '';
  formData.endDate = '';
  formData.address = '';
  formData.locationId = '';
  formData.categoryID = '';
  formData.maxAttendance = 0;
  formData.availableTickets = 0;
  formData.image = '';
  imageUrl.value = 'https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg';
  isEditMode.value = false;
  selectedEventId.value = null;
};
const showTicketsTable = ref(null);

const eventID = ref(0);

const getTickets = async (id) => {
  const response = await ticketStore.getTicketByEvent(id);
  eventID.value = id;
  console.log(eventID);
  ticketList.value = response.value;
  showTicketsTable.value = true;
  if (ticketList.value.length === 0) {
    Swal.fire({
      title: "No Tickets",
      text: "No tickets here",
      icon: "info",
    });
  }
}
const approveEvent = async (id) => {
  try {
    await eventStore.approveEvent(id);
    Swal.fire({
      title: "Event Approved successfully!",
      icon: "success"
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.value,
      icon: "error"
    });
  }
}
const disapproveEvent = async (id) => {
  try {
    await eventStore.disapproveEvent(id);
    Swal.fire({
      title: "Event Disapproved successfully!",
      icon: "success"
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    await Swal.fire({
      title: "Error!",
      text: err.value,
      icon: "error"
    });
  }
}

const rejectModal = ref({
  visible: false,
  eventId: null
});

const openRejectModal = (id) => {
  rejectModal.value = {
    visible: true,
    eventId: id
  };
};
const handleClose = () => {
  rejectModal.value.visible = false;
  rejectModal.value.eventId = null;
};
const truncateDescription = (text) => {
  const maxLength = 50; // adjust as needed
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const isSpam = (description) => {
  const spamKeywords = [ "free", "urgent", "limited time", "cheap", "guarantee", "risk-free",
  "bonus", "best price", "exclusive", "bargain", "click here", "subscribe","shit","fuck",
  "opt-in", "sign up", "join now", "contact us", "more information", "free trial",
  "free access", "no cost", "credit card", "bank account", "loan", "investment",
  "spam", "junk", "fake", "scam", "fraud", "virus", "malware", "phishing",
  "porn", "sex", "nude", "xxx", "lottery", "gamble", "betting", "casino",
  "viagra", "cialis", "prescription", "medication", "drug", "pills",
  "debt", "financing", "miracle", "cure", "make money", "work from home",
  "earn cash", "double your money"];
   const hasSpamKeyword = spamKeywords.some(keyword => description.includes(keyword));

  const hasGibberish = /(\w)\1{3,}/.test(description);

  return hasSpamKeyword || hasGibberish;
};
//Pagination


//EventD
const currentPageEventD = ref(1);
const pageSizeEventD = 10;

const sortedEventD = computed(() => {
  return [...eventD.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});


const paginatedEventD = computed(() => {
  const startIndex = (currentPageEventD.value - 1) * pageSizeEventD;
  return sortedEventD.value.slice(startIndex, startIndex + pageSizeEventD);
});

const approvedEvents = computed(() => {
  return eventD.value.filter(event => event.isApproved);
});

const totalPagesEventD = computed(() => {
  return Math.ceil(approvedEvents.value.length / pageSizeAllEvents);
});


const setCurrentPageEventD = (page) => {
  currentPageEventD.value = page;
};

watch(() => eventD.value, () => {
  currentPageEventD.value = 1; // Reset to first page when payments change
});

// All Events List
const currentPageAllEventsList = ref(1);
const pageSizeAllEventsList = 6;

const sortedAllEventsList = computed(() => {
  return [...allEventList.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});


const paginatedAllEventsList = computed(() => {
  const startIndex = (currentPageAllEventsList.value - 1) * pageSizeAllEventsList;
  return sortedAllEventsList.value.slice(startIndex, startIndex + pageSizeAllEventsList);
});

const totalPagesAllEventsList = computed(() => Math.ceil(allEventList.value.length / pageSizeAllEventsList));

const setCurrentPageAllEventsList = (page) => {
  currentPageAllEventsList.value = page;
};

watch(() => allEventList.value, () => {
  currentPageAllEventsList.value = 1; // Reset to first page when payments change
});

// EventS
const currentPageEventS = ref(1);
const pageSizeEventS = 10;

const sortedEventS = computed(() => {
  return [...eventS.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});


const paginatedEventS = computed(() => {
  const startIndex = (currentPageEventS.value - 1) * pageSizeEventS;
  return sortedEventS.value.slice(startIndex, startIndex + pageSizeEventS);
});

const totalPagesEventS = computed(() => Math.ceil(eventS.value.length / pageSizeEventS));

const setCurrentPageEventS = (page) => {
  currentPageEventS.value = page;
};

watch(() => eventS.value, () => {
  currentPageEventS.value = 1; // Reset to first page when payments change
});

//Event LIst

const currentPageAllEvents = ref(1);
const pageSizeAllEvents = 10;

const sortedAllEvents = computed(() => {
  return [...eventList.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});


const paginatedAllEvents = computed(() => {
  const startIndex = (currentPageAllEvents.value - 1) * pageSizeAllEvents;
  return sortedAllEvents.value.slice(startIndex, startIndex + pageSizeAllEvents);
});

const totalPagesAllEvents = computed(() => Math.ceil(eventD.value.length / pageSizeAllEvents));

const setCurrentPageAllEvents = (page) => {
  currentPageAllEvents.value = page;
};

watch(() => eventList.value, () => {
  currentPageAllEvents.value = 1; // Reset to first page when payments change
});


</script>


<template>
  <div class="d-flex d-inline-flex w-100">
    <div class="fixed-div" style="position: fixed;">
    <side-bar />
    </div>
    <div class="container-xl px-4 mt-4" style="margin-left: 20%;">
      <nav class="nav nav-borders">
        <a class="nav-link" :class="{ active: activeTab === 'eventList' }" @click.prevent="changeTab('eventList')">Event
          List</a>
        <a v-if="authStore.isOrganizer" class="nav-link" :class="{ active: activeTab === 'eventForm' }" @click.prevent="changeTab('eventForm')">Event
          Form</a>
      </nav>
      <hr class="mt-0 mb-4">

      <div v-if="activeTab === 'eventList'">
        <div class="card mb-4" v-if="authStore.isOrganizer">
          <div class="card-header">Published Events <i class="bi bi-check-lg"></i></div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Event Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Max Attendees</th>
                  <th scope="col">Available Tickets</th>
                  <th scope="col">Description</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody v-for="event in paginatedEventD" :key="event.id">
                <tr v-if="event.isApproved">
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.address }}</td>
                  <td>{{ event.categoryName }}</td>
                  <td>{{ formatDateTime(event.startDate) }}</td>
                  <td>{{ formatDateTime(event.endDate) }}</td>
                  <td>{{ event.maxAttendance }}</td>
                  <td>{{ event.availableTickets }}</td>
                  <td>
                    <div class="tooltip-container">
                      <span>{{ truncateDescription(event.description) }}</span>
                      <div class="tooltip-text">{{ event.description }}</div>
                    </div>
                  </td>
                  <td>
                  <div class="button-container">
                    <button class="btn btn-outline-danger btn-sm" @click="deleteEvent(event.id)">Delete</button>
                    <button class="btn btn-outline-primary btn-sm" @click="openEditForm(event.id)">Edit</button>
                    <button class="btn btn-outline-secondary btn-sm" @click="getTickets(event.id)">Tickets</button>
                   </div>
                   </td>
                </tr>
              </tbody>
            </table>
            <nav v-if="eventD.length > 0">
              <ul class="pagination justify-content-center">
                <li
                    class="page-item"
                    v-for="page in totalPagesEventD"
                    :key="page"
                    :class="{ active: currentPageEventD === page }"
                >
                  <a class="page-link" href="#" @click.prevent="setCurrentPageEventD(page)">{{ page }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="card mb-4" v-if="authStore.isAdmin">
          <div class="card-header">Published Events <i class="bi bi-check-lg"></i></div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Organizer</th>
                  <th scope="col">Event Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Max Attendees</th>
                  <th scope="col">Available Tickets</th>
                  <th scope="col">Description</th>
                  <th scope="col"></th>

                </tr>
              </thead>
              <tbody v-for="event in paginatedAllEventsList" :key="event.id">
                <tr v-if="event.isApproved">
                  <td>{{ event.organizerName }}</td>
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.address }}</td>
                  <td>{{ event.categoryName }}</td>
                  <td>{{ formatDateTime(event.startDate) }}</td>
                  <td>{{ formatDateTime(event.endDate) }}</td>
                  <td>{{ event.maxAttendance }}</td>
                  <td>{{ event.availableTickets }}</td>
                  <td>
                    <div class="tooltip-container">
                      <span>{{ truncateDescription(event.description) }}</span>
                      <div class="tooltip-text">{{ event.description }}</div>
                    </div>
                  </td>

                  <RejectMessageModalComponent :rejectModal="rejectModal" @close="handleClose" />
                  <td>
                  <div class="button-container">
                    <button class="btn btn-outline-success btn-sm" @click="disapproveEvent(event.id)">Disapprove</button>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteEvent(event.id)">Delete</button>
                  </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav v-if="allEventList.length > 0">
              <ul class="pagination justify-content-center">
                <li
                    class="page-item"
                    v-for="page in totalPagesAllEventsList"
                    :key="page"
                    :class="{ active: currentPageAllEventsList === page }"
                >
                  <a class="page-link" href="#" @click.prevent="setCurrentPageAllEventsList(page)">{{ page }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="card mb-4" v-if="authStore.isOrganizer">
          <div class="card-header">Waiting for approval <i class="bi bi-exclamation-octagon"></i></div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Event Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Max Attendees</th>
                  <th scope="col">Available Tickets</th>
                  <th scope="col">Description</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody v-for="event in allEventList" :key="event.id">
                <tr v-if="!event.isApproved">
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.address }}</td>
                  <td>{{ event.categoryName }}</td>
                  <td>{{ formatDateTime(event.startDate) }}</td>
                  <td>{{ formatDateTime(event.endDate) }}</td>
                  <td>{{ event.maxAttendance }}</td>
                  <td>{{ event.availableTickets }}</td>
                  <td>
                    <div class="tooltip-container">
                      <span>{{ truncateDescription(event.description) }}</span>
                      <div class="tooltip-text">{{ event.description }}</div>
                    </div>
                  </td>
                  <td>
                     <div class="button-container">
              <button class="btn btn-outline-danger btn-sm" @click="deleteEvent(event.id)">Delete</button>
              <button class="btn btn-outline-primary btn-sm" @click="openEditForm(event.id)">Edit</button>
            </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- <nav v-if="eventList.length > 0">
              <ul class="pagination justify-content-center">
                <li
                    class="page-item"
                    v-for="page in totalPagesAllEvents"
                    :key="page"
                    :class="{ active: currentPageAllEvents === page }"
                >
                  <a class="page-link" href="#" @click.prevent="setCurrentPageAllEvents(page)">{{ page }}</a>
                </li>
              </ul>
            </nav> -->
          </div>
        </div>
        <div class="card mb-4" v-if="authStore.isOrganizer">
          <div class="card-header">Scheduled Events <i class="bi bi-hourglass-split"></i></div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Event Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Max Attendees</th>
                  <th scope="col">Available Tickets</th>
                  <th scope="col">Aproved</th>
                  <th scope="col">Schedule Date</th>
                  <th scope="col">Description</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody v-for="event in paginatedEventS" :key="event.id">
                <tr>
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.address }}</td>
                  <td>{{ event.categoryName }}</td>
                  <td>{{ formatDateTime(event.startDate) }}</td>
                  <td>{{ formatDateTime(event.endDate) }}</td>
                  <td>{{ event.maxAttendance }}</td>
                  <td>{{ event.availableTickets }}</td>
                  <td>{{ event.isApproved ? 'Approved' : 'Pending' }}</td>
                  <td>{{ formatDateTime(event.scheduleDate) }}</td>
                  <td>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteEvent(event.id)">Delete</button>
                    <button class="btn btn-outline-primary btn-sm" @click="openEditForm(event.id)">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav v-if="eventS.length > 0">
              <ul class="pagination justify-content-center">
                <li
                    class="page-item"
                    v-for="page in totalPagesEventS"
                    :key="page"
                    :class="{ active: currentPageEventS === page }"
                >
                  <a class="page-link" href="#" @click.prevent="setCurrentPageEventS(page)">{{ page }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="card mb-4" v-if="authStore.isAdmin">
          <div class="card-header">Waiting for approval <i class="bi bi-exclamation-octagon"></i></div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Organizer Name</th>
                  <th scope="col">Event Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Max Attendees</th>
                  <th scope="col">Available Tickets</th>
                  <th scope="col">Description</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody v-for="event in allEventList" :key="event.id">
                <tr v-if="!event.isApproved">
                  <td>{{ event.organizerName }}</td>
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.address }}</td>
                  <td>{{ event.categoryName }}</td>
                  <td>{{ formatDateTime(event.startDate) }}</td>
                  <td>{{ formatDateTime(event.endDate) }}</td>
                  <td>{{ event.maxAttendance }}</td>
                  <td>{{ event.availableTickets }}</td>
                  <td><div class="tooltip-container">
                      <span>{{ truncateDescription(event.description) }}</span>
                      <div class="tooltip-text">{{ event.description }}</div>
                    </div></td>
                  <td></td>

                  <td>
                  <div class="button-container">
                    <button class="btn btn-outline-success btn-sm" @click="approveEvent(event.id)">Approve</button>
                    <button class="btn btn-outline-primary btn-sm" @click="openRejectModal(event.id)">Reject</button>
                  </div>
                  </td>
                  <RejectMessageModalComponent :rejectModal="rejectModal" @close="handleClose" />
                </tr>
                <tr v-if="authStore.isOrganizer && eventList && eventList.length === 0">
                  <td colspan="8" class="no-data">No events available</td>
                </tr>
                <tr v-if="authStore.isAdmin && allEventList && allEventList.length === 0">
                  <td colspan="8" class="no-data">No events available</td>
                </tr>
              </tbody>
            </table>
            <!-- <nav v-if="allEventList.length > 0">
              <ul class="pagination justify-content-center">
                <li
                    class="page-item"
                    v-for="page in totalPagesAllEventsList"
                    :key="page"
                    :class="{ active: currentPageAllEventsList === page }"
                >
                  <a class="page-link" href="#" @click.prevent="setCurrentPageAllEventsList(page)">{{ page }}</a>
                </li>
              </ul>
            </nav> -->
          </div>
        </div>
      </div>
      <div v-if="showTicketsTable">
        <ticket-list :tickets="ticketList" :eventID="eventID" />
      </div>

      <!-- Event Form Section -->
      <div v-if="activeTab === 'eventForm'">
        <div class="row">
          <div class="col-xl-12">
            <div class="card mb-4">
              <div class="card-header">{{ isEditMode ? 'Edit Event' : 'Create Event' }}</div>
              <div class="card-body">

                <form @submit.prevent="handleSubmit">
                  <!-- Event Details Form -->
                  <div class="row gx-3 mb-3">
                    <div class="col-md-3">
                      <label class="small mb-1" for="eventName">Event Name</label>
                      <input class="form-control" id="eventName" type="text" placeholder="Enter event name"
                        v-model.trim="formData.eventName">
                    </div>

                    <div class="col-md-3">
                      <label class="small mb-1" for="categorySelect">Category</label>
                      <select id="categorySelect" class="form-control custom-select" v-model.trim="formData.categoryID">
                        <option value="" disabled>Select a Category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.categoryName }}
                        </option>
                      </select>
                    </div>

                    <div class="col-md-3 ">
                      <label class="small mb-1" for="address">Address</label>
                      <input class="form-control" id="address" type="text" placeholder="Enter address"
                        v-model.trim="formData.address">
                    </div>
                    <div class="col-md-3">
                      <label class="small mb-1" for="citySelect">Location</label>
                      <select id="citySelect" class="form-control custom-select" v-model.trim="formData.locationId">
                        <option value="" disabled>Select a city</option>
                        <option v-for="location in locations" :key="location.id" :value="location.id">
                          {{ location.city }}, {{ location.country }}
                        </option>
                      </select>
                    </div>

                    <div class="col-md-6 ">
                      <label class="small mb-1" for="startDate">Start Date</label>
                      <input class="form-control" id="startDate" type="datetime-local" v-model="formData.startDate">
                    </div>
                    <div class="col-md-6 ">
                      <label class="small mb-1" for="endDate">End Date</label>
                      <input class="form-control" id="endDate" type="datetime-local" v-model="formData.endDate">
                    </div>
                  </div>

                  <div class="row gx-3 mb-3">
                    <div class="col-md-6 w-25">
                      <label class="small mb-1" for="maxAttendees">Max Attendees</label>
                      <input class="form-control" id="maxAttendees" type="number" v-model="formData.maxAttendance">
                    </div>
                    <div class="col-md-6 w-25">
                      <label class="small mb-1" for="availableTickets">Available Tickets</label>
                      <input class="form-control" id="availableTickets" type="number"
                        v-model="formData.availableTickets">
                    </div>
                    <div class="col-md-6 w-25">
                      <label class="small mb-1" for="ScheduleDate">ScheduleDate</label>
                      <input class="form-control" id="ScheduleDate" type="datetime-local"
                        v-model="formData.scheduleDate">
                    </div>
                    <div class="col-md-12 w-50">
                      <label class="small mb-1" for="description">Description</label>
                      <input class="form-control" id="description" type="text" placeholder="Enter description"
                        v-model.trim="formData.description">
                    </div>
                  </div>
                  <div class="row gx-3 mb-3">
                    <div class="col-md-12">
                      <div class="card mb-4 mb-xl-0" :class="imageInputClass">
                        <div class="card-header">Event Image</div>
                        <div class="card-body text-center" style="align-self: center;">
                          <div class="image-container" :style="{ backgroundImage: `url(${imageUrl})` }">
                            <div v-if="!imageUrl" class="placeholder">No Image Selected</div>
                          </div>
                          <div class="small font-italic text-muted mb-4">Upload your EventImage</div>
                          <div class="small font-italic text-muted mb-4"><p style="color: red">{{imageValidationMessage}}</p></div>
                          <input class="form-control" id="file" type="file" ref="fileInput" @change="handleImageUpload"
                            style="display: none;" >
                          <button class="btn btn-outline-primary" type="button" @click="$refs.fileInput.click()">Upload
                            new image</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button class="btn btn-primary" type="submit">{{ isEditMode ? 'Update' : 'Submit' }}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
  margin-top: 20px;
  background-color: #f2f6fc;
  color: #69707a;
}

.img-account-profile {
  height: 10rem;
}

.rounded-circle {
  border-radius: 50% !important;
}

.card {
  box-shadow: 0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%);
}

.card .card-header {
  font-weight: 500;
}

.card-header:first-child {
  border-radius: 0.35rem 0.35rem 0 0;
}

.card-header {
  padding: 1rem 1.35rem;
  margin-bottom: 0;
  background-color: rgba(33, 40, 50, 0.03);
  border-bottom: 1px solid rgba(33, 40, 50, 0.125);
}


.form-control,
.dataTable-input,
.form-select {
  display: block;
  width: 100%;
  padding: 0.875rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1;
  color: #69707a;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #c5ccd6;
  appearance: none;
  border-radius: 0.35rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.custom-select {
  height: calc(1.5em + 1.75rem + 2px);
}

.nav-borders .nav-link.active {
  color: #0061f2;
  border-bottom-color: #0061f2;
}

.nav-borders .nav-link {
  color: #69707a;
  border-bottom-width: 0.125rem;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0;
  padding-right: 0;
  margin-left: 1rem;
  margin-right: 1rem;
  cursor: pointer;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.image-container {
  width: 10rem;
  height: 10rem;
  border: 1px solid #c5ccd6;
  border-radius: 0.35rem;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.placeholder {
  color: #69707a;
  font-size: 0.875rem;
  text-align: center;
}

.btn {
  text-transform: capitalize;
}

.no-data {
  text-align: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #CCCC00;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-container .tooltip-text {
  visibility: hidden;
  width: 300px;
  /* adjust as needed */
  background-color: #ffffff;
  color: #131212;
  text-align: center;
  border: 1px solid lightgray;
  padding: 5px;
  position: absolute;
  z-index: 1;
  /* bottom: 0; Position the tooltip above the text */
  /* left: 50%; */
  margin-left: 0;
  /* Adjust to center */
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.pb-20 {
  padding: 20px 0px;
}
.table {
  width: 100%;
}

.table th,
.table td {
  padding: 8px;
  text-align: left;
  vertical-align: middle; /* Ensures vertical alignment of content */
}

.button-container {
  display: flex;
  gap: 10px; /* Adjust spacing between buttons */
  align-items: center; /* Aligns buttons vertically in the center */
}

.button-container button {
  margin: 0;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-container .tooltip-text {
  visibility: hidden;
  width: 200px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
}

.is-invalid {
  border-color: red;
}

</style>
