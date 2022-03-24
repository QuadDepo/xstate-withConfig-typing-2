
// find best way to type this? can we reuse the typgen for something like this?
export const childMachineCustomConfig = {
  actions: {
    startMessage: (context, event) =>
      console.log("coming from custom config", context, event)
  }
};