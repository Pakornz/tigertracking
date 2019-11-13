export function increase() {
  return {
    type: "Increase"
  };
}
export function decrease() {
  return {
    type: "Decrease"
  };
}

export function decreaseBadge() {
  return {
    type: "DecreaseBadge"
  };
}

export function setBadge(badgeCount) {
  return {
    type: "SetBadge",
    payload: badgeCount
  };
}

export function resetRedux() {
  return {
    type: "ResetRedux"
  };
}
