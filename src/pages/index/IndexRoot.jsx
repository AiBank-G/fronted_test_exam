import "./index.scss";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import ContentArea from "./ContentArea/ContentArea";

function initState(options = {}) {
  return {
    lang: options.lang || "zh-cn",
    activeNavbarItem: options.activeNavbarItem || "spot",
    activeSidebarItemL1: options.activeSidebarItemL1 || "update_logs",
    activeSidebarItemL2: options.activeSidebarItemL2 || null
  };
}

function indexReducer(state, deltaOrHandler) {
  if (_.isObject(deltaOrHandler)) {
    return _.assign(_.clone(state), deltaOrHandler);
  } else if (_.isFunction(deltaOrHandler)) {
    const newState = _.clone(state);
    deltaOrHandler(newState);
    return newState;
  } else {
    throw new TypeError(
      `The 2nd parameter of method "indexReducer" should be of type 'Object' or 'Function'.`
    );
  }
}

export default function IndexRoot(props = {}) {
  const [state, dispatch] = useReducer(indexReducer, initState(props.options || {}));

  return (
    <>
      <Navbar dispatch={dispatch} lang={state.lang} activeItem={state.activeNavbarItem} />
      <Sidebar
        dispatch={dispatch}
        lang={state.lang}
        category={state.activeNavbarItem}
        activeItemL1={state.activeSidebarItemL1}
        activeItemL2={state.activeSidebarItemL2}
      />
      <ContentArea
        dispatch={dispatch}
        activeItemL1={state.activeSidebarItemL1}
        activeItemL2={state.activeSidebarItemL2}
      />
    </>
  );
}
