import { shallowMount } from '@vue/test-utils';
import redButton from '@/components/redButton.vue';

describe('MyComponent', () => {

  const wrapper = shallowMount(redButton);


  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('tests the component has the correct prop data', () => {

  });
});