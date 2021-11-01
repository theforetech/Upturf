<template>
  <b-card
    class="user-booking"
    :class="{selected:getSelected}"
  >
    <b-container>
      <b-row
        style="padding-bottom: 1.5rem"
      >
        <b-col
          style="padding-left: 0;padding-right: 0rem"
          cols="3"
          align-h="center"
          align-self="center"
          @click="selectX"
        >
          <b-avatar
            variant="light-secondary"
            size="55"
          >
            <feather-icon
              size="27"
              :icon="findAdType"
              style="color: black"
            />
          </b-avatar>
        </b-col>
        <b-col
          cols="7"
          align-h="center"
          style="padding-left: 0.2rem;padding-right: 0;"
          @click="selectX"
        >
          <div>
            <h2 style="font-size: 1rem;color:#202023">
              {{ type }}
            </h2>
            <h2 style="font-size: 0.8rem;color:#3D3D42;overflow-wrap: break-word;">
              {{ address }}
            </h2>
            <h2 style="font-size: 0.72rem;color:#3D3D42;">
              Pincode: {{ pincode }}
            </h2>
          </div>

        </b-col>
        <b-col
          align-h="end"
          cols="2"
          style="padding-left:0px;"
          align-self="center"
        >
          <b-avatar
            variant="light-danger"
            size="30"
            style="float:right;"
          >
            <feather-icon
              size="15"
              icon="Trash2Icon"
              @click="removeX"
            />
          </b-avatar>
        </b-col>
      </b-row>
    </b-container>

  </b-card>
</template>

<script>
import {
  BCard, BRow, BAvatar, BContainer, BCol,
  // , BCardText, BLink
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCard,
    // BCardText,
    // BLink
    BRow,
    BContainer,
    BCol,
    BAvatar,
  },
  directives: {
    Ripple,
  },
  props: {
    type: {
      type: String,
      required: true,
      default: '',
    },
    address: {
      type: String,
      required: true,
      default: '',
    },
    pincode: {
      type: String,
      required: true,
      default: '',
    },
    tag: {
      type: String,
      required: true,
      default: '',
    },
    color: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      addressType: [
        {
          name: 'Home',
          icon: 'HomeIcon',
        },
        {
          name: 'Work',
          icon: 'MonitorIcon',
        },
      ],
    }
  },
  computed: {
    findAdType() {
      const x = this.addressType.filter(item => item.name === this.type)
      // console.log(x)
      return x[0].icon
    },
    getSelected() {
      return this.color === true
    },
  },
  methods: {
    removeX() {
      this.$emit('remove', true)
    },
    selectX() {
      this.$emit('select', true)
    },
  },
}
</script>
<style scoped>
.booking-btn {
  white-space: nowrap;
  font-size: 0.9rem;
  margin: auto;
  padding: 0.8rem 0.6rem;

}
.sport-image{
  height: 3rem;
}

.user-booking .card-body{
  padding-bottom: 0rem!important;
}
.selected{
  background-color: rgba(24, 149, 0,0.1);
  border:1px solid rgba(24, 149, 0, 0.5);
  box-shadow: -1px -2px 4px rgba(146, 229, 123, 0.7),-1px 2px 4px rgba(146, 229, 123, 0.7);
  transition: all ease-in-out 100ms;

}
.display {
  display:none;
}

</style>
