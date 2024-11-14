import { mount, createLocalVue } from "@vue/test-utils";
import i18n from "@/i18n";
import "@/stories/common";
import Vuex from "vuex";
import { storeDefinition } from "@/store";
import {
  DEFAULT_FAKEVALUE,
  DEFAULT_GREEKS,
  DEFAULT_TABLE_VIEW,
  DEFAULT_FAKEVALUE_STRATEGIES,
  DEFAULT_GREEKS_STRATEGIES,
  DEFAULT_TABLE_VIEW_STRATEGIES,
  FAKE_COLUMN,
  DEFAULT_COLUMN_ALIGNMENT,
} from "@/store/common/fauxStore";
import CustomizeViewModal from "./CustomizeViewModal";
import Constants from "@/utils/constants";

describe("CustomizeViewModal  tests", () => {
  const store = new Vuex.Store(storeDefinition());
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const wrapper = mount(CustomizeViewModal, { i18n, store, localVue });

  it("Renders to page", async () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.localFakeTableCheck.length).toBeGreaterThanOrEqual(1);
    expect(wrapper.vm.localFakeTwoTableCheck.length).toBeGreaterThanOrEqual(1);
  });

  it("Ensures mobile visibility when applicable", async () => {
    expect(wrapper.find(".componentTabsWrapper").exists()).toBe(false);
    expect(wrapper.vm.mobileModeisOn).toBe(false);

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.mobileModeisOn).toBe(true);
    expect(wrapper.vm.addDelete).toBe(":add");
    wrapper.vm.activeTab = "displayedColumns";
    expect(wrapper.vm.addDelete).toBe(":delete");
  });

  it("Ensures the static columns are lined up", async () => {
    const table = wrapper.vm.customizeTableDisplayedColumns;
    await wrapper.vm.$nextTick();
    expect(table[0].key === "bid" && table[0].checked);
    expect(table[1].key === "ask" && table[1].checked);
  });

  it("should be rendering when is not mobile", async () => {
    store.dispatch("updateMobileModeIsOn", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#columnAlignmentRadio").exists()).toBeTruthy();
  });

  it("makes sure clearAllCheckboxes function unchecks all items except default ones", async () => {
    wrapper.vm.clearAllCheckboxes();
    await wrapper.vm.$nextTick();
    const defaultColumns =
      store.getters["fakeStorePreferences/defaultStaticColumns"];

    expect(wrapper.vm.customizeTableDisplayedColumns.length).toEqual(
      defaultColumns.length
    );
  });

  it("ensures resetting returns the default values on selections", async () => {
    wrapper.vm.resetState();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.modalVisibility).toBe(false);
    expect(wrapper.vm.fakeColumnCurrentValue).toEqual(FAKE_COLUMN);
    expect(wrapper.vm.columnAlignmentCurrentValue).toEqual(
      DEFAULT_COLUMN_ALIGNMENT
    );
    expect(wrapper.vm.localFakeTwoTableCheck).toEqual(
      wrapper.vm.marketsTableCheck
    );
    expect(wrapper.vm.localFakeTableCheck).toEqual(wrapper.vm.greeksTableCheck);
  });

  it("test small functions", () => {
    const mockFireAdobeEvent = jest.fn();
    const fireAdobeEvent = wrapper.vm.fireAdobeEvent;
    wrapper.vm.fireAdobeEvent = mockFireAdobeEvent;
    const mockResetState = jest.fn();
    const resetState = wrapper.vm.resetState;
    wrapper.vm.resetState = mockResetState;
    const mockDispatch = jest.fn();
    const dispatch = store.dispatch;

    // updateModalVisibility
    wrapper.vm.updateModalVisibility("type");
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:chain:tabletype"
    );
    expect(mockResetState).toHaveBeenCalled();
    expect(wrapper.emitted("input")[0]).toEqual([false]);

    // handleFireEvents
    wrapper.vm.handleFireEvents({ checked: true, key: "title" }, "faux");
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:chain:table:column:add:market"
    );
    wrapper.vm.handleFireEvents({ checked: false, key: "title" }, "faux");
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:table:column:remove:market"
    );
    store.dispatch("updateMobileModeIsOn", true);
    wrapper.vm.handleFireEvents({ checked: true, key: "title" }, "faux");
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:chain:table:add:market"
    );
    wrapper.vm.handleFireEvents({ checked: false, key: "title" }, "faux");
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:chain:table:delete:market"
    );
    store.dispatch("updateMobileModeIsOn", false);

    // uncheckCheckbox
    const fakeValueKey = wrapper.vm.localFakeTwoTableCheck.find(
      (item) => item.key === "fakeValueKey"
    );
    const fakeValueKeyTwo = wrapper.vm.localFakeTableCheck.find(
      (item) => item.key === "fakeValueKeyTwo"
    );
    wrapper.vm.customizeTableDisplayedColumns = [
      ...wrapper.vm.customizeTableDisplayedColumns,
      { key: "fakeValueKey", checked: true, notEnabled: false },
      { key: "fakeValueKeyTwo", checked: true },
    ];
    fakeValueKey.checked = true;
    fakeValueKeyTwo.checked = true;

    wrapper.vm.uncheckCheckbox("fakeValueKey");
    expect(fakeValueKey.checked).toBe(false);
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:table:column:remove:ask size"
    );
    expect(
      wrapper.vm.customizeTableDisplayedColumns.find(
        (item) => item.key === "fakeValueKey"
      )
    ).toBe(undefined);

    store.dispatch("updateMobileModeIsOn", true);
    wrapper.vm.uncheckCheckbox("fakeValueKeyTwo");
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:chain:table:delete:fakeValueKeyTwo"
    );
    expect(
      wrapper.vm.customizeTableDisplayedColumns.find(
        (item) => item.key === "fakeValueKeyTwo"
      )
    ).toBe(undefined);
    store.dispatch("updateMobileModeIsOn", false);

    store.dispatch = mockDispatch;
    // handleHighlightColumnChange
    wrapper.vm.handleHighlightColumnChange();
    expect(mockDispatch).toHaveBeenCalledWith(
      "fakeStorePreferences/changeHightlightRadioValue",
      store.getters["fakeStorePreferences/highlightedColumnsRadioSelected"]
    );

    // handleColumnAlignmentChange
    wrapper.vm.handleColumnAlignmentChange();
    expect(mockDispatch).toHaveBeenCalledWith(
      "fakeStorePreferences/changeAlignmentRadioValue",
      store.getters["fakeStorePreferences/columnAlignmentRadioSelected"]
    );

    // saveModuleOrder
    wrapper.vm.saveModuleOrder();
    expect(mockDispatch).toHaveBeenCalledWith(
      "fakeStorePreferences/setTableView",
      wrapper.vm.customizeTableDisplayedColumns
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      "fakeStorePreferences/setUserModules",
      {
        marketsCheck: wrapper.vm.localFakeTwoTableCheck,
        greeksCheck: wrapper.vm.localFakeTableCheck,
      }
    );
    expect(mockFireAdobeEvent).toHaveBeenCalledWith(
      "fakeEvent:overview:chain:table:save"
    );

    // dragEnd
    wrapper.vm.dragEnd();
    expect(wrapper.vm.draggingIndex).toBe(null);

    // handleOnFocus
    wrapper.vm.handleOnFocus(true);
    expect(wrapper.vm.isDisplayedColumnsArea).toBe(true);

    // moveViewUp
    expect(
      wrapper.vm.customizeTableDisplayedColumns.findIndex(
        (item) => item.key === "ask"
      )
    ).toEqual(1);
    wrapper.vm.moveViewUp(1);

    expect(
      wrapper.vm.customizeTableDisplayedColumns.findIndex(
        (item) => item.key === "ask"
      )
    ).toEqual(0);

    // moveViewDown
    wrapper.vm.moveViewDown(0);
    expect(
      wrapper.vm.customizeTableDisplayedColumns.findIndex(
        (item) => item.key === "ask"
      )
    ).toEqual(1);

    // selectedTab
    wrapper.vm.selectedTab("stock");
    expect(wrapper.vm.activeTab).toBe("stock");

    wrapper.vm.fireAdobeEvent = fireAdobeEvent;
    wrapper.vm.resetState = resetState;
    store.dispatch = dispatch;
  });

  it("test checkMove and isDraggable", () => {
    expect(
      wrapper.vm.checkMove({ draggedContext: { index: 0, futureIndex: 1 } })
    ).toBe(false);
  });

  it("test restoreDefaultCheckboxes", () => {
    store.dispatch(
      "fakeStore/updateStrategyMode",
      Constants.FAKETYPE.STRATEGY.LOREM
    );
    expect(store.getters["fakeStore/strategyMode"]).toBe("LOREM");

    expect(wrapper.vm.defaultMarkets).toEqual(DEFAULT_FAKEVALUE_STRATEGIES());
    expect(wrapper.vm.defaultGreeks).toEqual(DEFAULT_GREEKS_STRATEGIES);
    expect(wrapper.vm.defaultTableView).toEqual(DEFAULT_TABLE_VIEW_STRATEGIES);
    expect(wrapper.vm.isdisplayModeLoremIpsum).toEqual(false);

    store.dispatch(
      "fakeStore/updateStrategyMode",
      Constants.FAKETYPE.STRATEGY.IPSUM
    );

    expect(store.getters["fakeStore/strategyMode"]).toBe("IPSUM");

    expect(wrapper.vm.defaultMarkets).toEqual(DEFAULT_FAKEVALUE_STRATEGIES());
    expect(wrapper.vm.defaultGreeks).toEqual(DEFAULT_GREEKS_STRATEGIES);
    expect(wrapper.vm.defaultTableView).toEqual(DEFAULT_TABLE_VIEW_STRATEGIES);
    expect(wrapper.vm.isdisplayModeLoremIpsum).toEqual(false);

    store.dispatch(
      "fakeStore/updateStrategyMode",
      Constants.FAKETYPE.STRATEGY.LOREM_IPSUM
    );

    expect(wrapper.vm.localFakeTwoTableCheck).toEqual(DEFAULT_FAKEVALUE());

    wrapper.vm.restoreDefaultCheckboxes();
    expect(wrapper.vm.localFakeTwoTableCheck).toEqual(DEFAULT_FAKEVALUE());
    expect(wrapper.vm.localFakeTableCheck).toEqual(DEFAULT_GREEKS);
    expect(wrapper.vm.customizeTableDisplayedColumns).toEqual(
      DEFAULT_TABLE_VIEW()
    );
    expect(wrapper.vm.fakeColumnCurrentValue).toEqual(FAKE_COLUMN);
    expect(wrapper.vm.columnAlignmentCurrentValue).toEqual(
      DEFAULT_COLUMN_ALIGNMENT
    );
  });

  it("test handleKeydown", () => {
    const event = {
      key: "arrowup",
      preventDefault: jest.fn(),
    };
    const element = {
      focus: jest.fn(),
    };
    const elemArr = [
      {
        querySelector: () => element,
      },
    ];

    // arrow up
    wrapper.vm.$refs.market_fakeValueKey = elemArr;
    wrapper.vm.handleKeydown(3, event, true);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(element.focus).toHaveBeenCalledTimes(1);

    event.key = "up";
    wrapper.vm.$refs.greek_gamma = elemArr;
    wrapper.vm.handleKeydown(2, event, false);
    expect(event.preventDefault).toHaveBeenCalledTimes(2);
    expect(element.focus).toHaveBeenCalledTimes(2);

    // arrow down
    event.key = "arrowdown";
    wrapper.vm.$refs.market_bidSize = elemArr;
    wrapper.vm.handleKeydown(1, event, true);
    expect(event.preventDefault).toHaveBeenCalledTimes(3);
    expect(element.focus).toHaveBeenCalledTimes(3);

    event.key = "down";
    wrapper.vm.handleKeydown(0, event, false);
    expect(event.preventDefault).toHaveBeenCalledTimes(4);
    expect(element.focus).toHaveBeenCalledTimes(4);
  });
});
