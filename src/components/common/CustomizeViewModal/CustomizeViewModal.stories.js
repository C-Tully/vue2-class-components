import "@/stories/common";
import i18n from "@/i18n";
import CustomizeViewModal from "./CustomizeViewModal";
import store from "@/store";

export default {
  title: "faux/CustomizeViewModal",
};

const Template = (args, { argTypes }) => {
  return {
    i18n,
    store,
    props: Object.keys(argTypes),
    components: { CustomizeViewModal },
    data: function () {
      return {
        visible: true,
      };
    },
    template: `
    <div>
      <CustomizeViewModal v-model="visible"/>
    </div>
    `,
  };
};

export const Default = Template.bind({});
Default.args = {};
