import {
  saveWebstoreItem,
  getWebstoreItem,
  checkPreference,
  savePreference,
} from "@/data";
import {
  fakeInputsCollectionAlpha,
  fakeInputsCollectionBravo,
  fakeInpuitsCollectionCharlie,
  fakeColumnsCollectionAlpha,
  fakeColumnsCollectionBravo,
} from "@/components/somefakePath/config";
import {
  fakeTableColumnsCollectionAlpha,
  fakeTableColumnsCollectionBravo,
  fakeTableColumnsCollectionCharlie,
  fakeTableColumnsCollectionDelta,
} from "@/components/someFakePath/config";
import Constants from "@/utils/constants";

export const DEFAULT_ALPHA_COLLECTION = JSON.parse(
  JSON.stringify(fakeInputsCollectionAlpha)
);
export const DEFAULT_VALUE_BRAVO = {
  default: Constants.FAKE_DEFAULT_VALUES,
  activeFilters: Constants.FAKE_DEFAULT_VALUES,
  custom: Constants.FAKE_DEFAULT_VALUES,
};
export const DEFAULT_FAKE_VALUES_LOREM = fakeInputsCollectionBravo;
export const DEFAULT_FAKE_VALUES_BRAVO = fakeInpuitsCollectionCharlie;
export const DEFAULT_FAKE_VALUES_CHARLIE = "default";
export const DEFAULT_TABLE_FIELDS = fakeColumnsCollectionAlpha.default;
export const FULL_COLLECTION_TABLE_FIELDS =
  fakeColumnsCollectionAlpha.fullCollection;

const toggleEligableTableColumn = (
  tableFields = [],
  strategy,
  addOrRemoveFlag = false
) => {
  if (strategy) {
    const tempFullCollection = JSON.parse(
      JSON.stringify(DEFAULT_ALPHA_COLLECTION[strategy])
    );

    const eligableColumns = {
      [Constants.FAKE_VALUE_ALPHA]: [
        Constants.FAKE_VALUE.LOREM,
        Constants.FAKE_KEY.DOLLAR,
      ],
      [Constants.FAKE_KEY.AMIT]: [
        Constants.FAKE_KEY.ELIT,
        Constants.FAKE_KEY.TEMPOR,
      ],
    };

    if (Object.keys(eligableColumns).includes(strategy)) {
      eligableColumns[strategy].forEach((key) => {
        const columnIndex = tableFields.findIndex(
          (obj) => obj?.columnKey === key
        );

        const eligableFilter = tempFullCollection[0].filters.find(
          (item) => item.columnKey === key
        );

        if (addOrRemoveFlag) {
          if (columnIndex <= -1 && eligableFilter) {
            tableFields.splice(3, 0, eligableFilter);
          }
        } else {
          if (columnIndex > -1) {
            tableFields.splice(columnIndex, 1);
          }
        }
      });
    }
  }
  return tableFields;
};

const toggleLoremIpsumColumn = (
  tableFields = [],
  strategy,
  addOrRemoveFlag = false
) => {
  if (strategy) {
    const sharesHeldColumn = fakeTableColumnsCollectionAlpha.sharesHeld;

    const columnIndex = tableFields.findIndex(
      (item) => item?.key == Constants.FAKE_KEY.SHARES_HELD
    );

    if (addOrRemoveFlag) {
      if (columnIndex <= -1) {
        tableFields.splice(2, 0, sharesHeldColumn);
      }
    } else {
      if (columnIndex > -1) {
        tableFields.splice(columnIndex, 1);
      }
    }
  }

  return tableFields;
};

export const updateNetPremumimColumns = (
  tableFields,
  strategy,
  limitMyholdingsState
) => {
  if (strategy == Constants.FAKE_KEY.AMIT) {
    //Toggle is ON
    if (limitMyholdingsState) {
      const fakeColumnIndex = tableFields.findIndex(
        (obj) => obj.key == "someValue"
      );
      if (fakeColumnIndex > -1) {
        tableFields[fakeColumnIndex] =
          fakeTableColumnsCollectionAlpha.netCredit;
      }
    } else {
      const fakeColumnIndex = tableFields.findIndex(
        (obj) => obj.key == "someValue"
      );

      if (fakeColumnIndex == -1) {
        const fakeTableColumnIndex = tableFields.findIndex(
          (obj) => obj.key == "netCredit"
        );

        tableFields[fakeTableColumnIndex] =
          fakeTableColumnsCollectionAlpha.someValue;
      }
    }
  }

  return tableFields;
};

export default {
  namespaced: true,
  state: () => ({
    customPreferences: {},
    fakeStateVariableAlpha: Constants.FAKE_DEFAULT_VALUES,
    fakeStateVariableBravo: JSON.parse(JSON.stringify(DEFAULT_VALUE_BRAVO)),
    defaultStateVariableAlpha: JSON.parse(
      JSON.stringify(DEFAULT_FAKE_VALUES_CHARLIE)
    ),
    tableFields: JSON.parse(JSON.stringify(DEFAULT_TABLE_FIELDS)),
    savedChangeResultSettings: [],
    customPreferencesCopy: {},
    actionID: "loremIpsum",
    actionButtonSate: false,
    rawFakeStateAlpha: "",
  }),
  getters: {
    fakeStateVariableAlpha: (state) => state.fakeStateVariableAlpha,
    fakeStateVariableBravo: (state) => state.fakeStateVariableBravo,
    defaultStateVariableAlpha: (state) => state.defaultStateVariableAlpha,
    tableFields: (state) => state.tableFields,
    customPreferences: (state) => state.customPreferences,
    customPreferencesCopy: (state) => state.customPreferencesCopy,
    savedChangeResultSettings: (state) => state.savedChangeResultSettings,
    actionID: (state) => state.actionID,
    actionButtonSate: (state) => state.actionButtonSate,
    rawFakeStateAlpha: (state) => state.rawFakeStateAlpha,
  },
  mutations: {
    updatefakeStateVariableBravo: (state, newPreferences) => {
      state.fakeStateVariableBravo = newPreferences;
    },
    updatedefaultStateVariableAlpha: (state, newPreferences) => {
      state.defaultStateVariableAlpha = newPreferences;
    },
    updateTableFields: (state, { strategy, tableFields }) => {
      state.tableFields[strategy] = tableFields;
    },
    updateCustomPreferences: (state, newPreferences) => {
      state.customPreferences = JSON.parse(JSON.stringify(newPreferences));
    },
    updateCustomPreferencesCopy: (state, newPreferences) => {
      state.customPreferencesCopy = JSON.parse(JSON.stringify(newPreferences));
    },
    updateSavedChangeResultSettings(state, newSettings) {
      state.savedChangeResultSettings = [...newSettings];
    },
    updateActionID(state, newid) {
      state.actionID = newid;
    },
    updateActionButtonState(state, value) {
      state.actionButtonSate = value;
    },
    updateQuickAnalysis(state, { key, value }) {
      state.fakeStateVariableBravo[key] = value;
    },
    updateFakeStateVariableAlphaForSection(state, sectionKey) {
      state.fakeStateVariableAlpha = state.fakeStateVariableBravo[sectionKey];
    },
    updaterawFakeStateAlpha(state, data) {
      state.rawFakeStateAlpha = data;
    },
  },
  actions: {
    async getUserPreferences({ commit, rootGetters }) {
      try {
        const results = await getWebstoreItem(
          rootGetters["api/http"],
          "fakeWebStoreName",
          "fakeWebStoreName"
        );

        commit("updaterawFakeStateAlpha", results?.data?.data?.Data);
      } catch (e) {
        commit("updateTableFields", {
          strategy: rootGetters["fakeStoreKey/strategy"],
          tableFields:
            DEFAULT_TABLE_FIELDS[rootGetters["fakeStoreKey/strategy"]],
        });
      }
    },
    async updateParsedPreferences({ rootGetters, getters, commit, dispatch }) {
      const strategy = rootGetters["fakeStoreKey/strategy"];
      const parsedPreferences = getters.rawFakeStateAlpha
        ? JSON.parse(atob(getters.rawFakeStateAlpha))
        : {};

      if (parsedPreferences) {
        if (parsedPreferences[strategy]?.fakeStateVariableBravo) {
          const temp = parsedPreferences[strategy]?.fakeStateVariableBravo;
          temp.default = Constants.FAKE_DEFAULT_VALUES;
          commit("updatefakeStateVariableBravo", temp);
        }

        if (parsedPreferences?.actionID) {
          commit("updateActionID", parsedPreferences?.actionID);
        }

        const fullCollection = {
          ...fakeTableColumnsCollectionAlpha,
          ...fakeTableColumnsCollectionBravo,
          ...fakeTableColumnsCollectionCharlie,
          ...fakeTableColumnsCollectionDelta,
          ...fakeColumnsCollectionBravo,
        };

        for (const key in parsedPreferences) {
          if (typeof parsedPreferences[key] != String) {
            parsedPreferences[key]?.displayedColumns?.custom?.forEach(
              (item) => {
                let itemKey = item.key;
                if (item.key === "someValue") {
                  itemKey = "lorem";
                } else if (item.key === "ipsum" || item.key === "dollar") {
                  itemKey = item.columnKey;
                }
                item.label = fullCollection[itemKey].label;
                item.toolTipText = fullCollection[itemKey].toolTipText;
                item.class = fullCollection[itemKey].class;
                item.notEnabled = fullCollection[itemKey].notEnabled;
                item.fixed = fullCollection[itemKey].fixed;
                item.default = fullCollection[itemKey].default;
                item.singleInnerTextLabel =
                  fullCollection[itemKey].singleInnerTextLabel;
                item.hasFakeKey = fullCollection[itemKey].hasFakeKey;
                item.adobeInteraction =
                  fullCollection[itemKey].adobeInteraction;
              }
            );
          }
        }

        commit("updateFakeStateVariableAlphaForSection", "custom");
        commit("updateCustomPreferences", parsedPreferences);
        commit("updateCustomPreferencesCopy", parsedPreferences);
      } else {
        commit("updateTableFields", {
          strategy: strategy,
          tableFields: DEFAULT_TABLE_FIELDS[strategy],
        });
      }

      await dispatch("changeTableFieldsForLimitMyHoldings");
    },
    async getUserPreferencesResults({ commit, rootGetters }) {
      try {
        const results = await checkPreference(
          rootGetters["api/http"],
          "fakeStoreKeyChangeResultSettings"
        );
        const tempConfig = results?.data?.data?.value;
        if (tempConfig) {
          const parsedPreferences = JSON.parse(atob(tempConfig));
          commit("updateSavedChangeResultSettings", parsedPreferences);
        }
      } catch {
        //do nothing: this should be dumped to a log file
      }
    },
    async saveUserPreferences(
      { getters, dispatch, commit, rootGetters },
      {
        strategy,
        newPreferences,
        displayedColumns,
        actionID,
        tab,
        deletedFakeValueKeys,
      }
    ) {
      try {
        commit("updateActionButtonState", true);

        const payload = {
          custom: newPreferences,
          displayedColumns: {
            custom: displayedColumns,
          },
          fakeStateVariableBravo: getters.fakeStateVariableBravo,
          deletedFakeValueKeys,
        };
        const currentPreferences =
          JSON.parse(JSON.stringify(getters.customPreferences)) || {};
        // TODO: Setting by reference, change this
        currentPreferences["actionID"] = actionID;
        currentPreferences[strategy] = payload;

        const encodedPreferences = btoa(JSON.stringify(currentPreferences));

        await saveWebstoreItem(rootGetters["api/http"], {
          name: "fakeWebStoreName",
          category: "fakeWebStoreName",
          data: encodedPreferences,
        });
        commit("updateCustomPreferences", currentPreferences);
        commit("updateCustomPreferencesCopy", currentPreferences);
        commit("updaterawFakeStateAlpha", encodedPreferences);

        await dispatch("changeTableFieldsForLimitMyHoldings");
        commit("updateFakeStateVariableAlphaForSection", tab);
      } catch {
        //do nothing
      } finally {
        commit("updateActionButtonState", false);
      }
    },
    updateActionID({ commit }, newValue) {
      commit("updateActionID", newValue);
    },
    updateActionButtonState({ commit }, newValue) {
      commit("updateActionButtonState", newValue);
    },
    updateQuickAnalysis({ commit }, { key, value }) {
      commit("updateQuickAnalysis", { key, value });
    },
    saveResultSettings({ rootGetters, commit, getters }, newData) {
      try {
        let basedOn = newData.basedOn;
        if (newData.basedOn === "loremIpsum") {
          basedOn = "alpha";
        } else if (newData.basedOn === "dollar") {
          basedOn = "bravo";
        } else if (newData.basedOn === "tempor") {
          basedOn = "charlie";
        }
        const dataToApi = {
          category: newData.category,
          strategy: newData.strategy,
          basedOn: basedOn,
          limit: newData.limit,
          customValue: newData.customValue,
          isLoremIpsum: newData.isLoremIpsum,
          selectedLoremIpsum: newData.selectedLoremIpsum,
          topLoremIpsum: newData.topLoremIpsum,
        };
        const savedLoremIpsum = JSON.parse(
          JSON.stringify(getters.savedChangeResultSettings)
        );
        if (savedLoremIpsum?.length > 0) {
          const loremIpsumIndex = savedLoremIpsum.findIndex(
            (obj) => obj.strategy === newData.strategy && !obj.isLoremIpsum
          );
          const themeIndex = savedLoremIpsum.findIndex(
            (obj) =>
              obj.strategy === newData.strategy &&
              obj.selectedLoremIpsum === newData.selectedLoremIpsum
          );
          const index = newData.isLoremIpsum ? themeIndex : loremIpsumIndex;

          if (index !== -1) {
            savedLoremIpsum[index].category = newData.category;
            savedLoremIpsum[index].basedOn = basedOn;
            savedLoremIpsum[index].limit = newData.limit;
            savedLoremIpsum[index].customValue = newData.customValue;
            savedLoremIpsum[index].isLoremIpsum = newData.isLoremIpsum;
            savedLoremIpsum[index].selectedLoremIpsum =
              newData.selectedLoremIpsum;
            savedLoremIpsum[index].topLoremIpsum = newData.topLoremIpsum;
          } else {
            savedLoremIpsum.push(dataToApi);
          }
        } else {
          savedLoremIpsum.push(dataToApi);
        }

        savePreference(
          rootGetters["api/http"],
          "fakeStoreKeyChangeResultSettings",
          btoa(JSON.stringify(savedLoremIpsum))
        );
        commit("updateSavedChangeResultSettings", savedLoremIpsum);
      } catch (error) {
        commit("updateErrorLog", {
          error: {
            name: "Custom Preferences: saveResultSettings",
            message: error,
          },
        });
      }
    },
    async changeTableFieldsForLimitMyHoldings({
      rootGetters,
      getters,
      commit,
    }) {
      const strategy = rootGetters["fakeStoreKey/strategy"];
      const savedPreferences =
        getters.customPreferences[strategy]?.displayedColumns?.custom?.length >
        0
          ? JSON.parse(JSON.stringify(getters.customPreferences))
          : {
              [strategy]: {
                custom: {
                  options: [],
                  etfs: [],
                  stocks: [],
                },
                displayedColumns: {
                  custom: [],
                },
                actionID: getters.actionID,
                fakeStateVariableBravo: getters.fakeStateVariableBravo,
              },
            };
      const tableFieldSource =
        savedPreferences[strategy]?.displayedColumns?.custom?.length > 0
          ? [...savedPreferences[strategy].displayedColumns.custom]
          : DEFAULT_TABLE_FIELDS[strategy];

      let tableFields = toggleLoremIpsumColumn(
        tableFieldSource,
        strategy,
        rootGetters["fakeStoreKey/loremIpsumKey"]
      );

      if (
        getters.customPreferencesCopy[strategy]?.displayedColumns?.custom
          .length > 0 &&
        rootGetters["fakeStoreKey/loremIpsumKey"]
      ) {
        if (getters.customPreferencesCopy[strategy]?.displayedColumns?.custom) {
          tableFields = [
            ...(getters.customPreferencesCopy[strategy]?.displayedColumns
              .custom || []),
          ];
        }

        tableFields = toggleLoremIpsumColumn(
          tableFields,
          strategy,
          rootGetters["fakeStoreKey/loremIpsumKey"]
        );

        if (strategy === "alpha" || strategy === "bravo") {
          if (
            !savedPreferences[strategy].custom.options.includes("ipsum") &&
            !savedPreferences[strategy].deletedFakeValueKeys?.includes("ipsum")
          ) {
            savedPreferences[strategy].custom.options.push("ipsum");
            tableFields.splice(
              3,
              0,
              DEFAULT_TABLE_FIELDS[strategy].find(
                (item) => item.key === "ipsum"
              )
            );
          }
          if (
            !savedPreferences[strategy].custom.options.includes("dollar") &&
            !savedPreferences[strategy].deletedFakeValueKeys?.includes("dollar")
          ) {
            savedPreferences[strategy].custom.options.push("dollar");
            tableFields.splice(
              4,
              0,
              DEFAULT_TABLE_FIELDS[strategy].find(
                (item) => item.key === "dollar"
              )
            );
          }
        }

        savedPreferences[strategy].displayedColumns.custom = tableFields;
        commit("updateCustomPreferences", savedPreferences);
      } else {
        tableFields = toggleEligableTableColumn(
          tableFields,
          strategy,
          rootGetters["fakeStoreKey/loremIpsumKey"]
        );
        if (
          getters.customPreferencesCopy[strategy]?.displayedColumns?.custom
            .length > 0
        ) {
          savedPreferences[strategy].displayedColumns.custom = tableFields;
          commit("updateCustomPreferences", savedPreferences);
        }
      }

      if (strategy === Constants.FAKE_KEY.AMIT) {
        tableFields = updateNetPremumimColumns(
          tableFields,
          strategy,
          rootGetters["fakeStoreKey/loremIpsumKey"]
        );
        savedPreferences[strategy].displayedColumns.custom = tableFields;

        if (
          getters.customPreferencesCopy[strategy]?.displayedColumns?.custom
            .length > 0
        ) {
          commit("updateCustomPreferences", savedPreferences);
        }
      }

      commit("updateTableFields", {
        strategy: strategy,
        tableFields: JSON.parse(JSON.stringify(tableFields)),
      });
    },
  },
};
