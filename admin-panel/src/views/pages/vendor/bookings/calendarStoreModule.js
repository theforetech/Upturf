import axios from '@axios'
import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'

export default {
  namespaced: true,
  state: {
    calendarOptions: [
      {
        color: 'danger',
        label: 'Personal',
      },
      {
        color: 'primary',
        label: 'Business',
      },
      {
        color: 'warning',
        label: 'Family',
      },
      {
        color: 'success',
        label: 'Holiday',
      },
      {
        color: 'info',
        label: 'ETC',
      },
    ],
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC'],
  },
  getters: {},
  mutations: {
    SET_SELECTED_EVENTS(state, val) {
      state.selectedCalendars = val
    },
  },
  actions: {
    fetchEvents(ctx, { calendars }) {
      apolloClient.query({
        query: gql`query($startDate: date, $endDate:date) {
            bookings(where: {_and: {payment_status: {_eq: success}, booking_status: {_eq: 1}, reservation_date: {_gte: $startDate, _lte: $endDate}}}) {
                contact_name
                contact_phone
                booking_status
                amount
                facility {
                    id
                    type
                    sport {
                        name
                        images {
                            url
                        }
                    }
                }
                id
                payment_status
                reservation_date
                split_payment
                split_members
                split_amount
                booked_slots {
                    id
                    startTime
                    endTime
                }
            }
        }`,
        variables: {
          startDate: '2021-11-01',
          endDate: '2022-11-04',
        },
      })
      return new Promise((resolve, reject) => {
        axios
          .get('/apps/calendar/events', {
            params: {
              calendars: calendars.join(','),
            },
          })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addEvent(ctx, { event }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/apps/calendar/events', { event })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateEvent(ctx, { event }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/apps/calendar/events/${event.id}`, { event })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeEvent(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/apps/calendar/events/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
