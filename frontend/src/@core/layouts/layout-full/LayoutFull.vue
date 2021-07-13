<template>
  <div :class="contentWidth === 'boxed' ? 'container p-0' : null">
    <router-view />
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light"
    >
      <a
        class="navbar-brand"
        href="#"
      >Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div
        id="navbarNavDropdown"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a
              class="nav-link"
              href="#"
            >Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
            >Features</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
            >Pricing</a>
          </li>
          <li class="nav-item dropdown">
            <a
              id="navbarDropdownMenuLink"
              class="nav-link dropdown-toggle"
              href="#"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Dropdown link
            </a>
            <div
              class="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <a
                class="dropdown-item"
                href="#"
              >Action</a>
              <a
                class="dropdown-item"
                href="#"
              >Another action</a>
              <a
                class="dropdown-item"
                href="#"
              >Something else here</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import useAppConfig from '@core/app-config/useAppConfig'

export default {
  setup() {
    const { contentWidth } = useAppConfig()
    return { contentWidth }
  },
}
</script>
