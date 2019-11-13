let count = 0;
export default function(state=count, action){
  switch (action.type) {
    case "Increase": count==10 ? null : count++
      break;
    case "Decrease": count==0 ? null : count--
      break;
  }
  return count;
}

