import { createMachine, interpret, spawn } from "xstate";
import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>XState TypeScript Example</h1>
<div>
  Open the <strong>Console</strong> to view the machine output.
</div>
`;

interface ToggleContext {
  count: number;
}

type ToggleEvent = {
  type: "TOGGLE";
  id: number;
};

const childMachineCustomConfig = {
  actions: {
    startMessage: (context, event) =>
      console.log("coming from custom config", context, event)
  }
};

const getMachineConfig = (id: number) => {
  switch (id) {
    case 1:
      return childMachineCustomConfig;
    default:
      return {};
  }
};

const createChildMachine = (id: number) =>
  createMachine(
    {
      id: `child-${id}`,
      initial: "inactive",
      context: {
        count: 0
      },
      states: {
        inactive: {
          onEntry: "startMessage",
          on: { TOGGLE: "active" }
        },
        active: {
          on: { TOGGLE: "inactive" }
        }
      }
    },
    {
      actions: {
        startMessage: (context, event) =>
          console.log("coming from default config", context, event)
      }
    }
  );

// Edit your machine(s) here
const parentMachine = createMachine<ToggleContext, ToggleEvent>(
  {
    id: "parent",
    initial: "inactive",
    context: {
      count: 0
    },
    states: {
      inactive: {
        on: {
          TOGGLE: {
            invoke: "spawnChild",
            target: "active"
          }
        }
      },
      active: {
        after: {
          0: { target: "inactive" }
        }
      }
    }
  },
  {
    services: {
      spawnChild: (context, event) => {
        spawn(
          createChildMachine(event.id).withConfig(getMachineConfig(event.id))
        );
      }
    }
  }
);

// Edit your service(s) here
const parentMachineService = interpret(parentMachine).onTransition((state) => {
  console.log(state.value);
});

parentMachineService.start();

parentMachineService.send({
  type: "TOGGLE",
  id: 1
});
