const itemId = [
  "item_ask",
  "item_askSize",
  "item_bid",
  "item_bidSize",
  "item_impliedVolatility",
  "item_intrinsicValue",
  "item_last",
  "item_change",
  "item_changePercent",
  "item_mid",
  "item_openInterest",
  "item_position",
  "item_symbol",
  "item_volume",
];
export const marketItems = itemId.map((id) => {
  const item = id.split("_")[1];
  const returnItem = {
    id,
    translation: `translationId.customizeViewModal.market.${item}`,
  };
  if (["item_ask", "item_bid"].includes(id)) {
    return {
      ...returnItem,
      disabled: true,
    };
  }

  return returnItem;
});

const greekIds = [
  "greek_delta",
  "greek_gamma",
  "greek_rho",
  "greek_theta",
  "greek_vega",
];
export const greekItems = greekIds.map((id) => {
  const item = id.split("_")[1];
  return {
    id,
    translation: `translationId.customizeViewModal.greeks.${item}`,
  };
});

export const innerItemColumnsConfigDefault = [
  {
    id: "faux_id_1",
    text: "translationId.customizeViewModal.innerItemColumns.faux_id_1",
    value: "faux_1",
    selected: true,
  },
  {
    id: "faux_id_2",
    text: "translationId.customizeViewModal.innerItemColumns.faux_id_2",
    value: "faux_2",
    selected: false,
  },
  {
    id: "faux_id_3",
    text: "translationId.customizeViewModal.innerItemColumns.faux_id_3",
    value: "faux_3",
    selected: false,
  },
];

export const columnAlignmentConfigDefault = [
  {
    itemId: "mirror_mode",
    text: "translationId.customizeViewModal.columnAlignment.mirrorMode",
    selected: true,
    value: "mirrorMode",
  },
  {
    itemId: "left_right_mode",
    text: "translationId.customizeViewModal.columnAlignment.leftRightMode",
    selected: false,
    value: "leftRightMode",
  },
];
