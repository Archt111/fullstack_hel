# Part 6a: Flux vs Zustand

- Flux: state lives in external stores, changed only via actions → view re-renders
- Zustand create: define store with state + action functions in one object; set merges new state
- Selectors: useStore(state => state.counter), component only re-renders when that slice changes. Destructuring the whole store causes unnecessary re-renders.
- Group actions under actions key — select the whole group at once, destructure safely
- Export custom hooks, not the raw store — export const useCounter = () => useStore(s => s.counter)
- Immutable updates: never mutate (no .push()), use .concat() or spread
- Uncontrolled forms: access value via e.target.fieldname.value, no state binding needed
