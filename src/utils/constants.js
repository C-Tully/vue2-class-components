import Vue from "vue";

const constants = {
  EXAMPLE_CONST: {
    SOME_VALUE: "ABC",
  },
};

Vue.prototype.$constants = constants;
export default constants;
