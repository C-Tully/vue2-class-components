import { shallowMount } from "@vue/test-utils";
import i18n from "@/i18n";
import store from "@/store";
import AccessibilityMixin from "./AccessibilityMixin";

describe("AccessibilityMixin test", () => {
  const Component = {
    render() {},
    mixins: [AccessibilityMixin()]
  };
  const wrapper = shallowMount(Component, { i18n, store });

  it("test onFilterEnterKeypress", async () => {
    wrapper.vm.$refs["price-selectAll"] = [
      {
        focus: jest.fn()
      }
    ];
    wrapper.vm.$refs["countryCheckbox-0"] = [
      {
        focus: jest.fn()
      }
    ];
    wrapper.vm.onFilterEnterKeypress("price");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$refs["price-selectAll"][0].focus).toHaveBeenCalled();
    wrapper.vm.onFilterEnterKeypress("country");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$refs["countryCheckbox-0"][0].focus).toHaveBeenCalled();
  });

  it("test onUpArrowKeypress", async () => {
    // setup mock data
    const e = { preventDefault: jest.fn() };
    const key = "ArrowUp";
    wrapper.vm.$refs = {
      one: [{ focus: jest.fn() }],
      two: [{ focus: jest.fn() }],
      three: [{ focus: jest.fn() }]
    };
    const nextFocus = { focus: jest.fn() };
    const querySelectorMock = (el, id) => nextFocus;
    const querySelector = wrapper.vm.$el.querySelector;
    wrapper.vm.$el.querySelector = querySelectorMock;

    // should handle up arrow key press when index is -1
    wrapper.vm.onUpArrowKeypress(e, key, -1, 3);
    expect(e.preventDefault).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$refs.three[0].focus).toHaveBeenCalled();

    // should handle up arrow key press when index is 0
    wrapper.vm.onUpArrowKeypress(e, key, 0);
    await wrapper.vm.$nextTick();
    expect(e.preventDefault).toHaveBeenCalledTimes(2);
    expect(nextFocus.focus).toHaveBeenCalled();

    // should handle up arrow key press when index is greater than 0
    wrapper.vm.onUpArrowKeypress(e, key, 1);
    expect(e.preventDefault).toHaveBeenCalledTimes(3);
    expect(wrapper.vm.$refs.one[0].focus).toHaveBeenCalled();

    wrapper.vm.$el.querySelector = querySelector;
  });

  it("test onDownArrowKeypress", async () => {
    // setup mock data
    const e = { preventDefault: jest.fn() };
    const key = "ArrowDown";
    wrapper.vm.$refs = {
      one: [{ focus: jest.fn() }],
      two: [{ focus: jest.fn() }],
      three: [{ focus: jest.fn() }]
    };
    const nextFocus = { focus: jest.fn() };
    const querySelectorMock = (el, id) => nextFocus;
    const querySelector = wrapper.vm.$el.querySelector;
    wrapper.vm.$el.querySelector = querySelectorMock;

    // should handle down arrow key press when index is -1
    wrapper.vm.onDownArrowKeypress(e, key, -1);
    expect(e.preventDefault).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$refs.one[0].focus).toHaveBeenCalled();

    // should handle down arrow key press when index equals to filter length
    wrapper.vm.onDownArrowKeypress(e, key, 2, 3);
    await wrapper.vm.$nextTick();
    expect(e.preventDefault).toHaveBeenCalledTimes(2);
    expect(nextFocus.focus).toHaveBeenCalled();

    // should handle down arrow key press when index is equals to 0
    wrapper.vm.onDownArrowKeypress(e, key, 0, 3);
    expect(e.preventDefault).toHaveBeenCalledTimes(3);
    expect(wrapper.vm.$refs.two[0].focus).toHaveBeenCalled();

    wrapper.vm.$el.querySelector = querySelector;
  });

  it("test onDownArrowKeyPressNoSelectAll", () => {
    // setup mock data
    const e = { preventDefault: jest.fn() };
    const key = "price";
    wrapper.vm.$refs = {
      "priceCheckbox-0": [
        {
          focus: jest.fn()
        }
      ],
      "priceCheckbox-1": [
        {
          focus: jest.fn()
        }
      ]
    };

    // handle index = -1
    wrapper.vm.onDownArrowKeyPressNoSelectAll(e, key, -1);
    expect(e.preventDefault).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$refs["priceCheckbox-0"][0].focus).toHaveBeenCalledTimes(
      1
    );

    // handle index = filter length
    wrapper.vm.onDownArrowKeyPressNoSelectAll(e, key, 1, 2);
    expect(e.preventDefault).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.$refs["priceCheckbox-0"][0].focus).toHaveBeenCalledTimes(
      2
    );

    // handle index < filter length
    wrapper.vm.onDownArrowKeyPressNoSelectAll(e, key, 0, 2);
    expect(e.preventDefault).toHaveBeenCalledTimes(3);
    expect(wrapper.vm.$refs["priceCheckbox-1"][0].focus).toHaveBeenCalledTimes(
      1
    );
  });

  it("test onUpArrowKeypressNoSelectAll", async () => {
    // setup mock data
    const e = { preventDefault: jest.fn() };
    const key = "price";
    wrapper.vm.$refs = {
      "priceCheckbox-0": [
        {
          focus: jest.fn()
        }
      ],
      "priceCheckbox-1": [
        {
          focus: jest.fn()
        }
      ]
    };

    // handle index = -1
    wrapper.vm.onUpArrowKeypressNoSelectAll(e, key, -1, 2);
    expect(e.preventDefault).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$refs["priceCheckbox-1"][0].focus).toHaveBeenCalledTimes(
      1
    );

    // handle index = 0
    wrapper.vm.onUpArrowKeypressNoSelectAll(e, key, 0, 2);
    await wrapper.vm.$nextTick();
    expect(e.preventDefault).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.$refs["priceCheckbox-1"][0].focus).toHaveBeenCalledTimes(
      2
    );

    // handle index > 0
    wrapper.vm.onUpArrowKeypressNoSelectAll(e, key, 1, 2);
    expect(e.preventDefault).toHaveBeenCalledTimes(3);
    expect(wrapper.vm.$refs["priceCheckbox-0"][0].focus).toHaveBeenCalledTimes(
      1
    );
  });

  it("test onTabKeyPress", () => {
    // setup mock data
    const e = {
      key: "ArrowRight"
    };
    wrapper.vm.$refs = {
      "tab-0": [
        {
          focus: jest.fn()
        }
      ],
      "tab-1": [
        {
          focus: jest.fn()
        }
      ]
    };

    // keyName = arrowright
    wrapper.vm.onTabKeyPress(e, 0, 2);
    expect(wrapper.vm.$refs["tab-1"][0].focus).toHaveBeenCalledTimes(1);

    // keyName = right && index === length
    e.key = "Right";
    wrapper.vm.onTabKeyPress(e, 2, 2);
    expect(wrapper.vm.$refs["tab-0"][0].focus).toHaveBeenCalledTimes(1);

    // keyName = ArrowLeft && index === 0
    e.key = "ArrowLeft";
    wrapper.vm.onTabKeyPress(e, 0, 1);
    expect(wrapper.vm.$refs["tab-1"][0].focus).toHaveBeenCalledTimes(2);

    // keyName = Left && index != 0
    e.key = "Left";
    wrapper.vm.onTabKeyPress(e, 1, 2);
    expect(wrapper.vm.$refs["tab-0"][0].focus).toHaveBeenCalledTimes(2);
  });

  it("test announceToScreenReader", () => {
    wrapper.vm.$refs.srAnnouncement = {};
    wrapper.vm.announceToScreenReader("test");
    expect(wrapper.vm.$refs.srAnnouncement.textContent).toBe("");

    setTimeout(() => {
      expect(wrapper.vm.$refs.srAnnouncement.textContent).toBe("test");
    }, 20);
  });
});
