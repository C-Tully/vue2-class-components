<template>
  <div>
    <Modal
      :value="modalVisibility"
      @input="updateModalVisibility('close')"
      confirmTextKey="common.save"
      :ariaLabel="$t('fakeKey.customizeViewModal.title')"
      :cancelAria="cancelText"
      :confirmAria="confirmText"
      :showFooterButtons="true"
      @okayClicked="saveModuleOrder"
      @cancelClicked="updateModalVisibility('cancel')"
      :leftCloseBtn="mobileModeIsOn"
      scrollable
      showCloseButton
      fullScreenOnMobile
      :class="{
        mobileModeIsOn: mobileModeIsOn,
      }"
    >
      <template #header>
        <div class="header-wrapper">
          <div class="title-wrapper">
            <h2>{{ $t("customizeViewModal.title") }}</h2>
          </div>
          <span>{{ $t("customizeViewModal.subTitle") }}</span>
        </div>
      </template>

      <template>
        <div
          class="loremIpsum"
          role="tablist"
          :aria-label="$t('common.navTabsAriaLabel')"
          v-if="mobileModeIsOn"
        >
          <b-button
            variant="a-link"
            class="headerTab"
            :class="{ activeTab: tab.id === activeTab }"
            v-for="tab in tabs"
            role="tab"
            :tabindex="activeTab === tab.id ? '0' : '-1'"
            :ref="tab.id"
            :key="tab.id"
            :aria-selected="activeTab === tab.id"
            aria-controls="markMoversWrap"
            @click="selectedTab(tab.id)"
            adobe-custom-directive="tab.adobeInteraction"
          >
            {{ $t(tab.translationKey) }}
            <div class="tabConnector" v-if="tab.id === activeTab" />
          </b-button>
        </div>
        <div class="modal-body-wrapper">
          <b-row class="card-wrapper">
            <b-col v-if="tabTargetIfMobile('addColumn')">
              <div class="card col-wrap">
                <CollapsibleCard
                  class="market-card"
                  :initialExpanded="true"
                  :ariaLabelOverride="$t(`accessibility.market`)"
                >
                  <template v-slot:header>
                    <span class="section-title" aria-hidden="true">
                      {{ $t("customizeViewModal.market.title") }}
                    </span>
                  </template>
                  <b-card-body class="mt-3">
                    <div
                      v-for="(item, index) in localfakeTableCheck"
                      :key="item.key"
                      :ref="item.key"
                      @keydown="(event) => handleKeydown(index, event, true)"
                    >
                      <b-form-checkbox
                        v-model="item.checked"
                        role="checkbox"
                        :disabled="item.notEnabled"
                        stacked
                        @change="handleFireEvents(item, 'market')"
                      >
                        {{ $t(`customizeViewModal.market.${item.key}`) }}
                      </b-form-checkbox>
                    </div>
                  </b-card-body>
                </CollapsibleCard>
                <CollapsibleCard
                  class="greek-card"
                  :initialExpanded="true"
                  :ariaLabelOverride="$t(`accessibility.greeks`)"
                >
                  <template v-slot:header>
                    <span class="section-title" aria-hidden="true">
                      {{ $t("customizeViewModal.greeks.title") }}
                    </span>
                  </template>
                  <b-card-body class="mt-3">
                    <div
                      v-for="(item, index) in localGreeksTableCheck"
                      :key="item.key"
                      :ref="item.key"
                      @keydown="(event) => handleKeydown(index, event, false)"
                      @focus="() => handleOnFocus(false)"
                    >
                      <b-form-checkbox
                        v-model="item.checked"
                        :aria-checked="item.checked"
                        stacked
                        role="checkbox"
                        @change="handleFireEvents(item, 'greeks')"
                      >
                        {{ $t(`customizeViewModal.greeks.${item.key}`) }}
                      </b-form-checkbox>
                    </div>
                  </b-card-body>
                </CollapsibleCard>
              </div>
            </b-col>
            <b-col v-if="tabTargetIfMobile('displayedColumns')">
              <div class="col-wrap card displayed-columns">
                <div class="displayed-columns-header">
                  {{ $t("customizeViewModal.displayedColumns.title") }}
                </div>
                <div class="inner-wrapper">
                  <draggable
                    v-model="customizeTableDisplayedColumns"
                    @end="dragEnd"
                    :move="checkMove"
                    handle=".handle"
                    :options="{
                      filter: '.view-item.disabled',
                    }"
                  >
                    <div
                      v-for="(view, index) in customizeTableDisplayedColumns"
                      :key="view.key"
                      :aria-label="view.key"
                      :class="[
                        'view-item',
                        {
                          disabled: isDisabled(view),
                        },
                      ]"
                    >
                      <div class="group-img handle">
                        <img
                          src="@/assets/images/Group.svg"
                          :aria-label="$t(`accessibility.dragDrop`)"
                          alt=""
                        />
                      </div>
                      <div class="view-arrows">
                        <button
                          class="arrow-btn"
                          @click="moveViewUp(index)"
                          @focus="() => handleOnFocus(true)"
                          :disabled="
                            view.notEnabled || index <= disableColumnOrderIndex
                          "
                        >
                          <span class="sr-only">
                            {{ $t(`${view.key}`) }}
                            {{ $t("loremIpsumDollar.moveUp") }}
                          </span>
                          <img
                            src="@/assets/images/fakeSVG.svg"
                            :alt="$t('loremIpsumDollar.moveUp')"
                            aria-hidden="true"
                          />
                        </button>
                        <div class="view-num">{{ index + 1 }}</div>
                        <button
                          class="arrow-btn"
                          @click="moveViewDown(index)"
                          @focus="() => handleOnFocus(true)"
                          :disabled="
                            view.notEnabled ||
                            index ===
                              customizeTableDisplayedColumns.length - 1 ||
                            index < disableColumnOrderIndex
                          "
                        >
                          <span class="sr-only">
                            {{
                              $t(
                                `customizeViewModal.CustomTableCombined.${view.key}`
                              )
                            }}
                            {{ $t("loremIpsumDollar.moveDown") }}
                          </span>
                          <img
                            src="@/assets/images/fakeSVG.svg"
                            :alt="$t('loremIpsumDollar.moveDown')"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <div class="view-name">
                        {{
                          $t(
                            `customizeViewModal.CustomTableCombined.${view.key}`
                          )
                        }}
                      </div>
                      <div class="view-toggle" v-if="!view.notEnabled">
                        <button
                          v-if="!unRemovableColumnIndex.includes(index)"
                          class="remove"
                          :aria-label="
                            $t(
                              `customizeViewModal.CustomTableCombined.${view.key}`
                            ) +
                            ' ' +
                            $t(`accessibility.remove`)
                          "
                          @click="uncheckCheckbox(view.key)"
                        >
                          <img
                            src="@/assets/images/fakeSVG.svg"
                            :alt="
                              $t(
                                `customizeViewModal.CustomTableCombined.${view.key}`
                              ) +
                              ' ' +
                              $t(`accessibility.remove`)
                            "
                          />
                        </button>
                      </div>
                    </div>
                  </draggable>
                </div>
              </div>
            </b-col>
          </b-row>
          <div class="clear-all" :aria-label="$t(`accessibility.clearAll`)">
            <button
              @focus="() => handleOnFocus(false)"
              :aria-label="$t(`accessibility.clearAll`)"
              @click="clearAllCheckboxes"
            >
              {{ $t("customizeViewModal.clearAll") }}
            </button>
          </div>
          <div class="options-wrapper">
            <b-form-group
              :label="$t(`customizeViewModal.highlightColumns.title`)"
              :aria-label="$t(`customizeViewModal.highlightColumns.title`)"
            >
              <b-form-radio-group
                id="fakeColumnRadioId"
                class="input-collection"
                v-model="fakeColumnCurrentValue"
                :disabled="isDisabledHighlightAndAlignmentMode"
                :options="generateRadioOptions(highlightConfig)"
                @change="
                  fireAdobeEvent(
                    `fakeEvent:overview:table:${addDelete}highlight:${$t(
                      `customizeViewModal.highlightColumns.${fakeColumnCurrentValue}`
                    )}`.toLowerCase()
                  )
                "
                name="highlightColumns"
                size="lg"
              />
            </b-form-group>
            <b-form-group
              :label="$t(`customizeViewModal.columnAlignment.title`)"
              :aria-label="$t(`customizeViewModal.columnAlignment.title`)"
              v-if="!mobileModeIsOn"
            >
              <b-form-radio-group
                id="columnAlignmentRadio"
                class="input-collection"
                v-model="columnAlignmentCurrentValue"
                :options="generateRadioOptions(alignmentConfig)"
                @change="
                  fireAdobeEvent(
                    `fakeEvent:overview:table:alignment:${$t(
                      `customizeViewModal.columnAlignment.${columnAlignmentCurrentValue}`
                    )}`.toLowerCase()
                  )
                "
                name="columnAlignment"
                size="lg"
                :disabled="
                  !isdisplayModeLoremIpsum ||
                  isDisabledHighlightAndAlignmentMode
                "
              />
            </b-form-group>
          </div>
          <button
            v-if="mobileModeIsOn"
            :aria-label="$t('fakeKey.accessibility.restoreDefaults')"
            class="restore-defaults mobileModeIsOn"
            @click="restoreDefaultCheckboxes"
          >
            {{ $t("customizeViewModal.restoreDefaults") }}
          </button>
        </div>
      </template>
      <template #footer>
        <button
          class="restore-defaults"
          v-if="!mobileModeIsOn"
          :aria-label="$t('fakeKey.accessibility.restoreDefaults')"
          @click="restoreDefaultCheckboxes"
        >
          {{ $t("customizeViewModal.restoreDefaults") }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import Modal from "@/components/common/Modal/Modal";
import CollapsibleCard from "@/components/common/componentPath/componentPath";
import Constants from "@/utils/constants";
import draggable from "vuedraggable";
import { trackEvent } from "@/utils/adobeUtils";
import MobileMixin from "@/components/mixins/MobileMixin";
import {
  highlightColumnsConfigDefault,
  columnAlignmentConfigDefault,
  marketItems,
  greekItems,
} from "./config/CustomizeViewModalConfig";
import {
  DEFAULT_MARKETS,
  DEFAULT_GREEKS,
  DEFAULT_TABLE_VIEW,
  DEFAULT_HIGHLIGHTED_COLUMNS,
  DEFAULT_COLUMN_ALIGNMENT,
  DEFAULT_MARKETS_STRATEGIES,
  DEFAULT_GREEKS_STRATEGIES,
  DEFAULT_TABLE_VIEW_STRATEGIES,
} from "@/store/common/LoremIpsum";
import { isEnabled } from "vue-feature-flipping";
@Component({
  name: "CustomizeViewModal",
  components: {
    Modal,
    CollapsibleCard,
    draggable,
  },
  mixins: [MobileMixin()],
})
class CustomizeViewModal extends Vue {
  @Prop({ type: Boolean, default: false }) value;

  localfakeTableCheck = [];
  localGreeksTableCheck = [];
  customizeTableDisplayedColumns = [];

  highlightConfig = highlightColumnsConfigDefault;
  alignmentConfig = columnAlignmentConfigDefault;
  fakeColumnCurrentValue = this.selectedHighlightColumnMode;
  columnAlignmentCurrentValue = this.columnAlignmentRadioSelection;
  marketItems = marketItems;
  greekItems = greekItems;

  alignmentChangedByDisplayInput = false;
  clickable = true;
  isDisplayedColumnsArea = false;
  firstLoad = true;
  restoreDefaults = false;
  draggingIndex = null;

  cancelText = "fakeKey.accessibility.cancel";
  confirmText = "fakeKey.accessibility.save";
  activeTab = "addColumn";
  displayedColumnRef = "";

  mounted() {
    this.customizeTableDisplayedColumns =
      this.$store.getters[
        "loremIpsumDollarPreferences/customizeTableDisplayedColumns"
      ];
    this.localfakeTableCheck = this.fakeTableCheck;
    this.localGreeksTableCheck = this.greeksTableCheck;
  }

  updated() {
    if (this.isDisplayedColumnsArea) {
      this.$refs?.[this.displayedColumnRef]?.[0]?.focus();
    }

    if (
      (!this.isdisplayModeLoremIpsum ||
        this.isDisabledHighlightAndAlignmentMode) &&
      this.columnAlignmentCurrentValue ==
        Constants.LOREMIPSUM.ALIGNMENT.MIRROR_MODE
    ) {
      this.columnAlignmentCurrentValue =
        Constants.LOREMIPSUM.ALIGNMENT.LEFT_RIGHT_MODE;
      this.alignmentChangedByDisplayInput = true;
    }

    if (
      this.isdisplayModeLoremIpsum &&
      !this.isDisabledHighlightAndAlignmentMode &&
      this.alignmentChangedByDisplayInput
    ) {
      this.columnAlignmentCurrentValue =
        Constants.LOREMIPSUM.ALIGNMENT.MIRROR_MODE;
      this.alignmentChangedByDisplayInput = false;
    }
  }

  @Watch("fakeTableCheck", { deep: true })
  @Watch("greeksTableCheck", { deep: true })
  onStateChanged() {
    this.localfakeTableCheck = this.fakeTableCheck;
    this.localGreeksTableCheck = this.greeksTableCheck;
  }

  @Watch("localfakeTableCheck", { deep: true })
  @Watch("localGreeksTableCheck", { deep: true })
  generateDisplayedColumns() {
    let preDefineColumnsOrder = [];

    const checkedMarkets = this.localfakeTableCheck.filter(
      (item) => item.checked
    );

    const checkedGreeks = this.localGreeksTableCheck.filter(
      (item) => item.checked
    );

    const bidSizeIndex = checkedMarkets.findIndex(
      (item) => item?.key === "bidSize"
    );

    if (this.isMultiLegStrategyApplied && bidSizeIndex !== -1) {
      checkedMarkets.splice(bidSizeIndex, 1);
      preDefineColumnsOrder = [{ key: "bidSize", checked: true, fixed: true }];
    }

    const bidIndex = checkedMarkets.findIndex((item) => item?.key === "bid");
    if (bidIndex !== -1) checkedMarkets.splice(bidIndex, 1);

    const askIndex = checkedMarkets.findIndex((item) => item?.key === "ask");
    if (askIndex !== -1) checkedMarkets.splice(askIndex, 1);

    preDefineColumnsOrder = [
      ...preDefineColumnsOrder,
      { key: "bid", checked: true, fixed: true },
      { key: "ask", checked: true, fixed: true },
    ];

    const askSizeIndex = checkedMarkets.findIndex(
      (item) => item?.key === "askSize"
    );

    if (this.isMultiLegStrategyApplied && askSizeIndex !== -1) {
      checkedMarkets.splice(askSizeIndex, 1);
      preDefineColumnsOrder = [
        ...preDefineColumnsOrder,
        { key: "askSize", checked: true, fixed: true },
      ];
    }

    this.customizeTableDisplayedColumns = [
      ...preDefineColumnsOrder,
      ...checkedMarkets,
      ...checkedGreeks,
    ];
  }

  @Watch("strategyMode")
  handleOnStrategyChange() {
    this.fakeColumnCurrentValue = this.selectedHighlightColumnMode;
  }

  @Watch("fakeColumnCurrentValue")
  handleHighlightColumnChange() {
    if (!this.isDisabledHighlightAndAlignmentMode) {
      this.$store.dispatch(
        "loremIpsumDollarPreferences/changeHightlightRadioValue",
        this.fakeColumnCurrentValue
      );
    }
  }

  @Watch("columnAlignmentCurrentValue")
  handleColumnAlignmentChange() {
    if (this.isdisplayModeLoremIpsum) {
      this.$store.dispatch(
        "loremIpsumDollarPreferences/changeAlignmentRadioValue",
        this.columnAlignmentCurrentValue
      );
    }
  }

  get modalVisibility() {
    return this.value;
  }

  get isMultiLegStrategyApplied() {
    return isEnabled(this.$features.OPTIONS_CHAIN_STRATEGY);
  }

  get selectedHighlightColumnMode() {
    return this.isDisabledHighlightAndAlignmentMode
      ? null
      : this.fakeColumnRadioIdSelection;
  }

  get isDisabledHighlightAndAlignmentMode() {
    return (
      this.isMultiLegStrategyApplied &&
      [
        Constants.LOREMIPSUM.FAKEKEY.BRAVO,
        Constants.LOREMIPSUM.FAKEKEY.CHARLIE,
      ].includes(this.strategyMode)
    );
  }

  get unRemovableColumnIndex() {
    const bidIndex = this.customizeTableDisplayedColumns.findIndex(
      (item) => item?.key === "bid"
    );
    const askIndex = this.customizeTableDisplayedColumns.findIndex(
      (item) => item?.key === "ask"
    );

    return [bidIndex, askIndex];
  }

  get disableColumnOrderIndex() {
    let disabledColumn = 2;

    if (!this.isMultiLegStrategyApplied) return disabledColumn;
    const bidSizeIndex = this.customizeTableDisplayedColumns.findIndex(
      (item) => item?.key === "bidSize"
    );

    if (bidSizeIndex !== -1) {
      disabledColumn++;
    }

    const askSizeIndex = this.customizeTableDisplayedColumns.findIndex(
      (item) => item?.key === "askSize"
    );

    if (askSizeIndex !== -1) {
      disabledColumn++;
    }

    return disabledColumn;
  }

  get displayMode() {
    return this.$store.getters["loremIpsumDollar/displayMode"];
  }

  get strategyMode() {
    return this.$store.getters["loremIpsumDollar/strategyMode"];
  }

  get addDelete() {
    let result = "";

    if (this.mobileModeIsOn) {
      if (this.activeTab === "addColumn") {
        result = ":add";
      } else if (this.activeTab === "displayedColumns") {
        result = ":delete";
      }
    }

    return result;
  }

  get isdisplayModeLoremIpsum() {
    if (
      [
        Constants.LOREMIPSUM.FAKEKEY.BRAVO,
        Constants.LOREMIPSUM.FAKEKEY.CHARLIE,
      ].includes(this.strategyMode)
    ) {
      return false;
    }

    return this.displayMode === Constants.LOREMIPSUM.FAKEKEY.ALPHA_AND_BRAVO;
  }

  get fakeTableCheck() {
    if (
      this.$store.getters[
        "loremIpsumDollarPreferences/customizeTableDisplayedColumns"
      ].length === 0
    ) {
      return JSON.parse(JSON.stringify(this.defaultMarkets));
    } else
      return this.$store.getters["loremIpsumDollarPreferences/fakeTableCheck"];
  }

  get greeksTableCheck() {
    if (
      this.$store.getters[
        "loremIpsumDollarPreferences/customizeTableDisplayedColumns"
      ].length === 0
    ) {
      return JSON.parse(JSON.stringify(this.defaultGreeks));
    } else {
      return this.$store.getters[
        "loremIpsumDollarPreferences/greeksTableCheck"
      ];
    }
  }

  get fakeColumnRadioIdSelection() {
    return this.$store.getters[
      "loremIpsumDollarPreferences/highlightedColumnsRadioSelected"
    ];
  }

  get columnAlignmentRadioSelection() {
    return this.$store.getters[
      "loremIpsumDollarPreferences/columnAlignmentRadioSelected"
    ];
  }

  get defaultMarkets() {
    if (
      [
        Constants.LOREMIPSUM.FAKEKEY.ALPHA,
        Constants.LOREMIPSUM.FAKEKEY.BRAVO,
        Constants.LOREMIPSUM.FAKEKEY.CHARLIE,
        Constants.LOREMIPSUM.FAKEKEY.DELTA,
      ].includes(this.strategyMode)
    ) {
      return DEFAULT_MARKETS_STRATEGIES();
    } else {
      return DEFAULT_MARKETS();
    }
  }

  get defaultGreeks() {
    if (
      [
        Constants.LOREMIPSUM.FAKEKEY.ALPHA,
        Constants.LOREMIPSUM.FAKEKEY.BRAVO,
        Constants.LOREMIPSUM.FAKEKEY.CHARLIE,
        Constants.LOREMIPSUM.FAKEKEY.DELTA,
      ].includes(this.strategyMode)
    ) {
      return DEFAULT_GREEKS_STRATEGIES;
    } else {
      return DEFAULT_GREEKS;
    }
  }

  get defaultTableView() {
    if (
      [
        Constants.LOREMIPSUM.FAKEKEY.ALPHA,
        Constants.LOREMIPSUM.FAKEKEY.BRAVO,
        Constants.LOREMIPSUM.FAKEKEY.CHARLIE,
        Constants.LOREMIPSUM.FAKEKEY.DELTA,
      ].includes(this.strategyMode)
    ) {
      return DEFAULT_TABLE_VIEW_STRATEGIES;
    } else {
      return DEFAULT_TABLE_VIEW();
    }
  }

  get tabs() {
    return [
      {
        id: "addColumn",
        translationKey: "customizeViewModal.tabs.addColumns",
        adobeInteraction: {
          linkId:
            "fakeEvent:overview:table:column:" +
            this.$t("customizeViewModal.tabs.addColumns")
              .toLowerCase()
              .split(" ")[0],
          linkLocation:
            Constants.ADOBE_CATEGORIES.FAKEKEY.CUSTOMIZE_TABLE_MODAL,
          anaPrefix: null,
        },
      },
      {
        id: "displayedColumns",
        translationKey: "customizeViewModal.tabs.displayedColumns",
        adobeInteraction: {
          linkId:
            "fakeEvent:overview:table:column:" +
            this.$t("customizeViewModal.tabs.addColumns")
              .toLowerCase()
              .split(" ")[0],
          linkLocation:
            Constants.ADOBE_CATEGORIES.FAKEKEY.CUSTOMIZE_TABLE_MODAL,
          anaPrefix: null,
        },
      },
    ];
  }

  get mobileModeIsOn() {
    return this.$store?.getters?.mobileModeIsOn;
  }

  updateModalVisibility(type) {
    this.fireAdobeEvent(`fakeEvent:overview:table${this.addDelete}${type}`);
    this.resetState();

    this.$emit("input", false);
    this.restoreDefaults = false;
  }

  handleFireEvents(item, category) {
    this.restoreDefaults = false;
    const itemLabel = this.$t(`customizeViewModal.${category}.${item?.key}`);
    let chain = "";
    let checked = "";

    if (this.mobileModeIsOn) {
      chain = "";
      checked = item.checked ? "add" : "delete";
    } else {
      chain = item.checked ? "" : "";
      checked = item.checked ? "add" : "remove";
    }

    this.fireAdobeEvent(
      `fakeEvent:overview${chain}:table${
        this.mobileModeIsOn ? "" : ":column"
      }:${checked}:${itemLabel}`.toLowerCase()
    );
  }

  fireAdobeEvent(linkId) {
    trackEvent({
      linkId: linkId,
      linkLocation: Constants.ADOBE_CATEGORIES.FAKEKEY.CUSTOMIZE_TABLE_MODAL,
      anaPrefix: null,
    });
  }

  checkMove(e) {
    return this.isDraggable(e.draggedContext);
  }

  isDraggable(context) {
    const { index, futureIndex } = context;

    return !(
      this.customizeTableDisplayedColumns[index].fixed ||
      this.customizeTableDisplayedColumns[futureIndex].fixed
    );
  }

  isDisabled(view) {
    if (this.isMultiLegStrategyApplied) {
      return (
        view.notEnabled ||
        view.key === "bid" ||
        view.key === "ask" ||
        view.key === "askSize" ||
        view.key === "bidSize"
      );
    } else {
      return view.notEnabled || view.key === "bid" || view.key === "ask";
    }
  }

  clearAllCheckboxes() {
    this.localfakeTableCheck.forEach((item) => {
      if (item?.key !== "bid" && item?.key !== "ask") {
        item.checked = false;
      }
    });

    this.localGreeksTableCheck.forEach((item) => (item.checked = false));

    const uncheckedKeys = [
      ...this.localfakeTableCheck
        .filter((item) => !item.checked)
        .map((item) => item?.key),
      ...this.localGreeksTableCheck
        .filter((item) => !item.checked)
        .map((item) => item?.key),
    ];

    const defaultOrder = ["bid", "ask"];
    const newDisplayedColumns = [];

    defaultOrder.forEach((key) => {
      const column = this.customizeTableDisplayedColumns.find(
        (item) => item?.key === key
      );

      if (column) {
        newDisplayedColumns.push(column);
      }
    });

    this.customizeTableDisplayedColumns.forEach((column) => {
      if (
        !uncheckedKeys.includes(column?.key) &&
        !defaultOrder.includes(column?.key)
      ) {
        newDisplayedColumns.push(column);
      }
    });

    requestAnimationFrame(() => {
      this.customizeTableDisplayedColumns = newDisplayedColumns;
    });

    trackEvent({
      linkId: `fakeEvent:overview:table${this.addDelete}:clear all`,
      linkLocation: Constants.ADOBE_CATEGORIES.FAKEKEY.CUSTOMIZE_TABLE_MODAL,
      anaPrefix: null,
    });
  }

  uncheckCheckbox(key) {
    let itemLabel = "";

    const marketItem = this.localfakeTableCheck.find(
      (item) => item?.key === key
    );
    const greekItem = this.localGreeksTableCheck.find(
      (item) => item?.key === key
    );

    if (marketItem) {
      marketItem.checked = false;
      itemLabel = this.$t(`customizeViewModal.market.${key}`);
    }

    if (greekItem) {
      greekItem.checked = false;
      itemLabel = this.$t(`customizeViewModal.greeks.${key}`);
    }

    this.customizeTableDisplayedColumns =
      this.customizeTableDisplayedColumns.filter((item) => item?.key !== key);

    this.fireAdobeEvent(
      `fakeEvent:overview${this.mobileModeIsOn ? "" : ""}:table${
        this.mobileModeIsOn ? "" : ":column"
      }:${this.mobileModeIsOn ? "delete" : "remove"}:${itemLabel}`.toLowerCase()
    );
  }

  restoreDefaultCheckboxes() {
    this.restoreDefaults = true;

    const setDefaultOrder = () => {
      this.localfakeTableCheck = JSON.parse(
        JSON.stringify(this.defaultMarkets)
      );
      this.localGreeksTableCheck = JSON.parse(
        JSON.stringify(this.defaultGreeks)
      );
      this.customizeTableDisplayedColumns = JSON.parse(
        JSON.stringify(this.defaultTableView)
      );
    };
    setDefaultOrder();
    requestAnimationFrame(setDefaultOrder);

    this.fakeColumnCurrentValue = this.isDisabledHighlightAndAlignmentMode
      ? null
      : DEFAULT_HIGHLIGHTED_COLUMNS;
    this.columnAlignmentCurrentValue = DEFAULT_COLUMN_ALIGNMENT;

    trackEvent({
      linkId: `fakeEvent:overview:table${this.addDelete}:restore default`,
      linkLocation: Constants.ADOBE_CATEGORIES.FAKEKEY.CUSTOMIZE_TABLE_MODAL,
      anaPrefix: null,
    });
  }

  saveModuleOrder() {
    this.$store.dispatch(
      "loremIpsumDollarPreferences/setTableView",
      this.restoreDefaults ? [] : this.customizeTableDisplayedColumns
    );
    this.$store.dispatch("loremIpsumDollarPreferences/setUserModules", {
      marketsCheck: this.localfakeTableCheck,
      greeksCheck: this.localGreeksTableCheck,
    });

    this.restoreDefaults = false;
    this.fireAdobeEvent(`fakeEvent:overview:table${this.addDelete}:save`);
    this.$emit("input", false);
  }

  resetState() {
    this.$store.dispatch(
      "loremIpsumDollarPreferences/resetHighlightTempRadioValue"
    );
    this.$store.dispatch(
      "loremIpsumDollarPreferences/resetAlignmentTempRadioValue"
    );
    this.$store.dispatch("loremIpsumDollarPreferences/resetState");

    this.fakeColumnCurrentValue = this.selectedHighlightColumnMode;
    this.columnAlignmentCurrentValue = this.columnAlignmentRadioSelection;
  }

  dragEnd() {
    this.draggingIndex = null;
  }

  handleOnFocus(value) {
    this.isDisplayedColumnsArea = value;
  }

  moveViewUp(index) {
    if (index > 0) {
      const view = this.customizeTableDisplayedColumns.splice(index, 1)[0];
      this.customizeTableDisplayedColumns.splice(index - 1, 0, view);
    }
  }

  moveViewDown(index) {
    if (index < this.customizeTableDisplayedColumns.length - 1) {
      const view = this.customizeTableDisplayedColumns.splice(index, 1)[0];
      this.customizeTableDisplayedColumns.splice(index + 1, 0, view);
    }
  }

  generateRadioOptions(field) {
    const tempFields = field?.map((option) => {
      return {
        text: this.$t(option.text),
        selected: option.selected,
        value: option.value,
        id: option.id,
      };
    });

    return tempFields;
  }

  tabTargetIfMobile(section) {
    if (this.mobileModeIsOn) {
      return this.activeTab == section;
    } else {
      return true;
    }
  }

  selectedTab(type) {
    this.activeTab = type;
  }

  handleKeydown(index, event, isMarket) {
    const keyName = String(event?.key).toLowerCase();
    const isUpArrow = keyName === "arrowup" || keyName === "up";
    const isDownArrow = keyName === "arrowdown" || keyName === "down";
    const dataMap = isMarket ? this.marketItems : this.greekItems;

    if (isUpArrow) {
      event.preventDefault();

      if (isMarket && index === 3) {
        this.$refs[dataMap[1].id][0].querySelector("input").focus();
      } else if (index > 0) {
        this.$refs[dataMap[index - 1].id][0].querySelector("input").focus();
      }
    } else if (isDownArrow) {
      event.preventDefault();

      if (isMarket && index === 1) {
        this.$refs[dataMap[3].id][0].querySelector("input").focus();
      } else if (index < dataMap.length - 1) {
        this.$refs[dataMap[index + 1].id][0].querySelector("input").focus();
      }
    }
  }
}
export default CustomizeViewModal;
</script>

<style lang="scss" scoped>
@import "@/assets/styles/vars";

.modal-body-wrapper {
  padding: 0 24px 16px 24px;
}

.displayed-columns {
  overflow: hidden !important;

  .displayed-columns-header {
    margin-bottom: 10px;
    padding: 14px;
    border-bottom: 1px solid $vars-border-color;
  }

  .inner-wrapper {
    padding: 0 6px;
    overflow: hidden;
    overflow-y: scroll;
  }
}

.view-item {
  &.disabled {
    background-color: $vars-albicant;
    padding-left: 16px;

    .group-img {
      display: none;
    }
  }

  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid var(--primary-light-grey, $vars-colour-view-item);
}

.handle {
  cursor: move;
}

.view-all-module {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.view-name {
  color: var(--primary-slate, $vars-colour-black);
  flex: 1;
  margin: 0 10px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.view-text {
  flex: 1;
  color: var(--primary-slate, $vars-colour-black);
  font-family: $vars-font-family-regular;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.view-toggle {
  gap: 16px;
}

.view-all-module-toggle {
  margin-left: 5px;
  margin-right: 4px;
}

.view-arrows {
  display: flex;
  height: 64px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 16px;

  .arrow-btn {
    background: transparent;
    border: none;
    width: fit-content;
    height: fit-content;

    &:disabled {
      img {
        filter: invert(0.5);
      }
    }
  }
}

.view-num {
  color: var(--primary-slate, $vars-colour-black);
  text-align: center;
  font-family: $vars-font-family-regular;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  text-transform: capitalize;
}

.view-num span {
  display: inline-block;
  margin: 2px 0;
}

.col-wrap {
  height: 450px;
  border: 1px solid $vars-border-color;
  overflow: hidden;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: $vars-colour-white;
  background-clip: border-box;
  border-radius: 5px;

  ul {
    padding-left: 0;
    margin-bottom: 0;

    li {
      list-style: none;
      font-size: 14px;
    }
  }
}

.container {
  max-width: 540px;
}

.loremIpsum {
  margin-bottom: 16px;
  padding: 16px;
  padding-bottom: 0;
  border-bottom: 1px solid $vars-border-color;

  .tabConnector {
    height: 8px;
  }
}

.custom-control {
  padding-left: 0;
  margin-right: 16px;

  label {
    color: $vars-black;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    font-family: $vars-font-family-regular;
  }
}

.clear-all {
  width: 100%;
  text-align: right;
  margin-top: 12px;

  button {
    font-size: 12px;
    text-transform: uppercase;
    color: $vars-bluea;
    border: none;
    background-color: transparent;
    font-weight: 600;
  }
}

.card-wrapper {
  .col:first-child {
    padding-right: 0;
  }
}

.market-card,
.greek-card {
  border: 0;

  .section-title {
    font-family: $vars-font-family-medium;
  }
}

.restore-defaults {
  text-transform: uppercase;
  font-family: $vars-font-family-regular;
  font-size: 12px;
  background-color: transparent;
  border: none;
  color: $vars-bluea;
  margin: 0;
  padding: 0;
  margin-right: auto;
  font-weight: 600;

  &.mobileModeIsOn {
    font-size: 14px;
  }
}

.remove {
  border: none;
  background: transparent;

  img {
    width: 24px;
  }
}
.mobileModeIsOn {
  .custom-checkbox .custom-control-input ~ .custom-control-label {
    font-size: 16px;
  }
}

::v-deep {
  .mobileModeIsOn {
    .custom-checkbox .custom-control-input ~ .custom-control-label {
      font-size: 16px;
    }

    .modalBody {
      margin-bottom: 32px;
    }

    .modal-footer {
      .btn {
        display: inline-block;
      }
    }
  }

  .card-header {
    background-color: $vars-albicant !important;
    border: none;
    padding: 0 !important;

    button {
      padding: 10px;
    }
  }

  .close {
    margin: 0;
    position: relative;
    top: 0;
    right: 0;
    padding: 0;

    &:focus {
      outline: 2px solid $vars-cerulean !important;
      box-shadow: $vars-blue-box-shadow !important;
    }

    img {
      width: 24px;
    }
  }

  legend {
    color: $vars-black;
    margin-bottom: 8px;
    font-family: $vars-font-family-regular;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }

  .custom-control-inline {
    margin-right: 18px !important;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .custom-radio {
    label {
      font-size: 14px;
      padding: 2px 0 0 10px;
    }
  }

  .body-wrap {
    padding: 0 0 0 34px !important;
  }

  .modal-body {
    padding: 0;
  }

  .modal-header {
    padding-bottom: 0;

    .header-wrapper {
      width: 100%;

      .title-wrapper {
        display: flex;
        justify-content: space-between;
      }
    }
    .modal-title {
      text-align: left;
    }

    h2 {
      font-size: 22px !important;
      font-weight: 600;
      line-height: 32px;
    }

    span {
      display: block;
      width: 100%;
      font-size: 14px !important;
      line-height: 24px !important;
      font-weight: 400 !important;
      font-family: $vars-font-family-regular !important;
    }
  }

  .custom-radio.b-custom-control-lg .custom-control-label::before,
  .input-group-lg .custom-radio .custom-control-label::before,
  .custom-radio.b-custom-control-lg .custom-control-label::after,
  .input-group-lg .custom-radio .custom-control-label::after {
    width: 24px !important;
    height: 24px !important;
  }

  .options-wrapper {
    .custom-control-input:not(:checked) ~ .custom-control-label::before {
      border-color: $vars-disabled-dark;
    }

    #columnAlignmentRadio {
      .custom-radio {
        .custom-control-input:disabled:checked ~ .custom-control-label::before {
          background-color: $vars-disabled-dark !important;
          border-color: $vars-disabled-dark;
        }

        .custom-control-input:disabled:not(:checked)
          ~ .custom-control-label::before {
          background-color: $vars-disabled-light-v2;
        }
      }
    }
  }

  .custom-control-input[disabled] ~ .custom-control-label,
  .custom-control-input:disabled ~ .custom-control-label {
    color: $vars-black !important;
  }

  .custom-checkbox {
    .custom-control-input {
      padding-left: 9px;
      position: relative;

      ~ .custom-control-label {
        font-size: 14px;
        line-height: 24px;
        padding-left: 8px;
        margin-bottom: 20px;
      }

      ~ .custom-control-label::before {
        border: 2px solid $vars-grey;
      }

      ~ .custom-control-label::before,
      ~ .custom-control-label::after {
        top: 0px;
        left: -24px;
        width: 24px;
        height: 24px;
      }

      &:disabled {
        ~ .custom-control-label::before {
          background-color: $vars-disabled-dark !important;
        }
      }

      &:checked {
        ~ .custom-control-label::before {
          border: 2px solid transparent;
        }

        ~ .custom-control-label::after {
          background-image: url("~@/assets/images/checkmark.svg");
        }
      }
    }
  }

  .card {
    .hasFocusWithin {
      &:focus-within {
        outline: none;
        box-shadow: none;
        margin-bottom: 0;
        border-top-right-radius: 0 !important;
        border-top-left-radius: 0 !important;
      }
    }
  }

  .modal-footer {
    border-top: 1px solid $vars-border-color;
    padding: 16px 24px 24px;

    .confirm-footer-button {
      color: $vars-white;
    }

    .btn {
      text-transform: uppercase;
      font-family: $vars-font-family-regular;
      font-size: 12px;
      line-height: 24px;
      font-weight: 600;
    }

    .confirm-footer-button {
      font-weight: 500 !important;
      padding: 4px 16px;
      display: flex;
      align-items: center;
    }
  }

  .optionsModuleCheckbox {
    .custom-control-input:checked ~ .custom-control-label::before {
      border-color: $vars-cerulean;
      background-color: $vars-cerulean !important;
    }

    .custom-control-input:checked ~ .custom-control-label::after {
      background-color: $vars-bluea;
      transform: translateX(0.9rem);
    }

    .custom-control-input:disabled ~ .custom-control-label::before {
      border-color: $vars-light-grey !important;
      background-color: $vars-light-grey !important;
    }

    .custom-control-input:disabled ~ .custom-control-label::after {
      background-color: $vars-grey3 !important;
    }

    .custom-control-label {
      &::before {
        left: -36px;
        width: 36px;
        border-radius: 100px;
        background-color: $vars-grey3 !important;
      }

      &::after {
        transform: translateX(0rem);
        left: -37px;
        height: 24px;
        top: -4.55px;
        width: 24px;
        flex-shrink: 0;
        border-radius: 100px;
        background-color: $vars-light-grey;
      }
    }
  }
}

@media (max-width: $media-breakpoint-mobile-max) {
  .input-collection {
    display: flex;
    flex-wrap: wrap;
    gap: 0 16px;
    row-gap: 16px;
  }

  ::v-deep {
    .modal-header {
      border-bottom: none;
      margin-bottom: 0;

      .title-wrapper {
        flex-direction: column-reverse;
        width: fit-content;
      }

      .close {
        width: fit-content;
        margin: 0 0 24px 0;
        padding: 0;
      }
    }

    .model-content {
      height: 100vh !important;
      max-width: 100vw !important;
    }

    .modal-dialog {
      height: 100vh;
      margin: 0;
    }

    .modal {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .card-wrapper {
      margin-right: 0;
    }

    .loremIpsum {
      padding-top: 0;
      box-sizing: border-box;
      padding-bottom: 6px;
    }

    .modal-footer {
      justify-content: space-between;

      .btn {
        width: 45%;
        height: 48px;
      }
    }
  }
}
</style>
