let badgeCount = 0
export default function (state = badgeCount, action) {
    console.log('!!!!!!!!!Payload!!!!!!!!!!!!!', action.payload);
    switch (action.type) {
        case "DecreaseBadge":
            let newState = Number(state)
            newState == 0 ? null : newState--
            return newState
        case "SetBadge":
            return state = action.payload
        case "ResetRedux":
            let resetState = Number(state)
            resetState = badgeCount
            return resetState
        default:
            return state
    }
}

// const INITIAL_STATE = {
//     badgeCount: 10,
// }

// export default function (state = badgeCount, action) {
//     console.log('!!!!!!!!!Payload!!!!!!!!!!!!!', action.payload);
//     switch (action.type) {
//         case "DecreaseBadge":
//             let newState = Number(state)
//             newState == 0 ? null : newState--
//             return newState
//         case "SetBadge":
//             return state = action.payload
//         case "ResetRedux":
//             let resetState = Number(state)
//             resetState = badgeCount
//             return resetState
//         default:
//             return state
//     }
// }






