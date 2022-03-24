import { createMachine } from "xstate";
export const createChildMachine = (id: number) =>
  createMachine(
    {
      id: `child-${id}`,
      initial: "inactive",
      tsTypes: {} as import("./childMachine.typegen").Typegen0,
      states: {
        inactive: {
          entry: "startMessage",
        },
      }
    },
    {
      actions: {
        startMessage: (context, event) =>
          console.log("coming from default config", context, event)
      }
    }
  );