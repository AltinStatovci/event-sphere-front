import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useEventStore = defineStore('event', () => {
    const url = 'http://localhost:5220/api/';
    const events = ref([]);
    const category = ref([]);
  
    async function getEventByCategory() {
      try {
        const response = await axios.get(`${url}Event/${eventCategoryId}/eventCategory`);
        const data = response.data;
        events.value = data.map(event => ({
          id: event.id,
          eventName: event.eventName,
        }));
      } catch (err) {
        console.log(err);
      }
    }
function test(){
        console.log(category.value);

    }
    async function getAllCategories() {
        try {
          const response = await axios.get(`${url}EventCategory`);
          const data = response.data;
        //   console.log(data);
          category.value = data.map(category => ({
            id: category.id
          }));
        //   console.log(category);
        } catch (err) {
          console.log(err);
        }
      }
  
    return {getEventByCategory, getAllCategories, test };
  });
  