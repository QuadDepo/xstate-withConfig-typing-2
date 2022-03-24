import { createMachine, spawn, assign } from "xstate";
import { createChildMachine } from "./childMachine";
import { childMachineCustomConfig } from "./childMachineConfig";

type Events = {
  type: "SPAWN";
  id: number;
}

// BEST WAY TO TYPE THIS?
const getMachineConfig = (id: number) => {
  switch (id) {
    case 1:
      return childMachineCustomConfig;
    default:
      return {};
  }
};

const initialContext = {
	childs: []
}

// Edit your machine(s) here
export const parentMachine = createMachine(
  {
    id: "parent",
    tsTypes: {} as import("./parentMachine.typegen").Typegen0,
    initial: "inactive",
	context: initialContext,
    schema: {
      context: initialContext,
      events: {} as Events,
    },
    states: {
      inactive: {
        on: {
          SPAWN: {
            actions: 'spawnChild',
		      }
        }
      },
    }
  },
  {
    actions: {
      spawnChild: assign((context, {id}) => {
        spawn(createChildMachine(id).withConfig(getMachineConfig(id)), `child-${id}`)
        const { childs } = context;
        childs.push(id);
        return {
          ...context,
          childs
        }
      })
    }
  }
);
