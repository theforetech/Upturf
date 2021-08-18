<template>
  <b-card>
    <validation-observer ref="form1">
      <!-- media -->
      <b-media no-body>
        <b-media-aside>
          <b-link>
            <b-img
              ref="previewEl"
              rounded
              :src="optionsLocal.avatar"
              height="80"
            />
          </b-link>
        <!--/ avatar -->
        </b-media-aside>

        <b-media-body class="mt-75 ml-75">
          <!-- upload button -->
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            size="sm"
            class="mb-75 mr-75"
            @click="$refs.refInputEl.$el.click()"
          >
            Upload
          </b-button>
          <b-form-file
            ref="refInputEl"
            v-model="profileFile"
            accept=".jpg, .png, .gif"
            :hidden="true"
            plain
            @input="inputImageRenderer"
          />
          <!--/ upload button -->

          <!-- reset -->
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            size="sm"
            class="mb-75 mr-75"
          >
            Reset
          </b-button>
          <!--/ reset -->
          <b-card-text>Allowed JPG, GIF or PNG. Max size of 800kB</b-card-text>
        </b-media-body>
      </b-media>
      <!--/ media -->

      <!-- form -->
      <b-form class="mt-2">
        <b-row>
          <b-col sm="6">
            <b-form-group
              label="Username"
              label-for="account-username"
            >
              <b-form-input
                v-model="optionsLocal.username"
                placeholder="Username"
                name="username"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="E-mail"
              label-for="account-e-mail"
            >
              <b-form-input
                v-model="optionsLocal.email"
                name="email"
                placeholder="Email"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Name"
              label-for="account-name"
            >
              <label>This field is required</label>
              <validation-provider
                #default="{ errors }"
                rules="required|min:2|alpha"
                name="First Name"
              >
                <b-form-input
                  v-model="optionsLocal.fullName"
                  name="name"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Name"
                  @keyup="$emit('update', optionsLocal);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Company"
              label-for="account-company"
            >
              <label>This field is required</label>
              <validation-provider
                #default="{ errors }"
                rules="required|min:2"
                name="Company"
              >
                <b-form-input
                  v-model="optionsLocal.company"
                  name="company"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Company name"
                  @keyup="$emit('update', optionsLocal);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import {
  BFormFile, BButton, BForm, BFormGroup, BFormInput, BRow, BCol, BCard, BCardText, BMedia, BMediaAside, BMediaBody, BLink, BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref } from '@vue/composition-api'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  alpha, alphaDash, between, confirmed, digits, email, integer, length, min, password, required, url,
} from '@validations'
import { codeType } from '@/views/forms/form-validation/code'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionsLocal: JSON.parse(JSON.stringify(this.generalData)),
      profileFile: null,
      required,
      confirmed,
      password,
      email,
      min,
      integer,
      url,
      alpha,
      between,
      digits,
      length,
      alphaDash,
      codeType,
    }
  },
  methods: {
    resetForm() {
      this.optionsLocal = JSON.parse(JSON.stringify(this.generalData))
    },
  },
  setup() {
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl)

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
}
</script>
