(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8e86211e"],{"088b":function(t,e,s){"use strict";var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("img",{staticStyle:{height:"4.5rem"},attrs:{src:"/logo.png"}})},i=[],r=s("2877"),a={},o=Object(r["a"])(a,n,i,!1,null,null,null);e["a"]=o.exports},"959b":function(t,e,s){"use strict";s("da54")},d200:function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"misc-wrapper"},[s("b-link",{staticClass:"brand-logo"},[s("Vuexy-logo")],1),t._m(0)],1)},i=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"misc-inner p-2 p-sm-3"},[s("div",{staticClass:"w-100 text-center"},[s("h2",{staticClass:"mb-2",staticStyle:{"margin-top":"-2.5rem"}},[t._v(" Logging you in ")])])])}],r=s("aa59"),a=s("088b"),o={name:"RefreshLogin",components:{VuexyLogo:a["a"],BLink:r["a"]},created:function(){if(this.$auth.isAuthenticated){if(this.$store.state.app.redirectAfterLogin){var t=this.$store.state.app.redirectAfterLogin;return this.$store.commit("app/UPDATE_REDIRECT",null),void this.$router.push(t)}this.$router.push({name:"home"})}else this.$router.push({name:"auth-control"})}},c=o,u=(s("959b"),s("2877")),l=Object(u["a"])(c,n,i,!1,null,null,null);e["default"]=l.exports},da54:function(t,e,s){}}]);
//# sourceMappingURL=chunk-8e86211e.a7aec03f.js.map