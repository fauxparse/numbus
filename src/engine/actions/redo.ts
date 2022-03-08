const redo = (_action: Redo, state: State): State => state.next || state;

export default redo;
