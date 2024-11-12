<template>
  <b-button
    :id="buttonId"
    :variant="buttonVariant"
  >
    {{buttonCopy}}
  </b-button>
</template>

<script >
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class CustomButton extends Vue {
  @Prop({ type: String, default: '' }) passedButtonId;
  @Prop({ type: String, default: '' }) buttonVariant;
  @Prop({ type: String, default: 'I am a button' }) buttonCopy;

  //Temp
  mounted() {
    console.log('Mounted');
  }

  get buttonId() {
    return this.passedButtonId ? 
      `button-${this._ud}-${this.passedButtonId}` 
      : `button-${this._ud}`; 
  }
}
</script>