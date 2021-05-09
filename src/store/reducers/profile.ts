import { default as update } from "immutability-helper";

import * as types from "src/types";

export const profile = (
  profile: types.Profile = { id: "", name: "" },
  action: types.Action
) => {
  switch (action.type) {
    case "profile/update":
      return update(profile, {
        $merge: action.payload,
      });
    default:
      return profile;
  }
};
