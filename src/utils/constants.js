import Vue from "vue";

const constants = {
  EXAMPLE_CONST: {
    SOME_VALUE: "ABC",
  },
};

//Set constants to a global value
Vue.prototype.$constants = constants;
export default constants;
