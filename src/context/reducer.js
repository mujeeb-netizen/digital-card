"use client";
export const initState = {
  isDrawer: false,
  isHide: false,
  isTemplate: {},
  selectedFont: "Roboto",
  text: "Your Text Here",
  editTemplate: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DRAWER":
      return {
        ...state,
        isDrawer: action.isDrawer,
      };
    case "SET_HIDE":
      return {
        ...state,
        isHide: action.isHide,
      };
    case "SET_TEMPLATE":
      return {
        ...state,
        isTemplate: action.isTemplate,
      };
    case "SET_FONT":
      return {
        ...state,
        selectedFont: action.selectedFont,
      };
    case "SET_TEXT":
      return {
        ...state,
        text: action.text,
      };
    case "SET_EDIT_TEMPLATE":
      return {
        ...state,
        editTemplate: action.editTemplate,
      };
    default:
      return state;
  }
};

export default reducer;
