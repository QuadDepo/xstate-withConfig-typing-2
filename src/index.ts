import { inspect } from '@xstate/inspect';
import { interpret  } from "xstate";
import { parentMachine } from "./parentMachine";
import "./styles.css";

inspect({
  iframe: false // open in new window
});

document.getElementById("app").innerHTML = `
<h1>XState TypeScript Example</h1>
<div>
  Open the <strong>Console</strong> to view the machine output.
</div>
`;

// Edit your service(s) here
const parentMachineService = interpret(parentMachine, {
  devTools: true
}).onTransition((state) => {
  console.log(state.value);
});

parentMachineService.start();

parentMachineService.send({
  type: "SPAWN",
  id: 1
});

parentMachineService.send({
  type: "SPAWN",
  id: 100
});
