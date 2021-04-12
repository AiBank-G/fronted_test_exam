import "./Sidebar.scss";
import sidebarConf from "./sidebarConf.json";

export default function Sidebar(props) {
  // Props passed down from the parent component
  const { dispatch, lang, category, activeItemL1, activeItemL2 } = props;

  // Local states and patch method
  const [localState, setLocalState] = useState({ keyword: "", filteredItems: [] });

  function setLocalDelta(delta) {
    setLocalState(_.assign(_.clone(localState), delta));
  }

  // Local effects

  // Event handlers
  function onInputChange(e) {
    const keyword = e.target.value.trim();
    const keywordReg = new RegExp(keyword, "i");
    const filteredItems =
      keyword.length > 0
        ? sidebarConf[category].filter((item) => _.some(item.texts, (txt) => txt.match(keywordReg)))
        : [];
    setLocalDelta({ keyword, filteredItems });
  }

  function clickSearchResult(item) {
    dispatch({
      activeSidebarItemL1: item.label,
      activeSidebarItemL2: item.children ? item.children[0].label : null
    });
  }

  function clickItemL1(e, itemL1) {
    e.stopPropagation();
    const labelL1 = itemL1.label;
    const labelL2 = _.get(itemL1, "children[0].label");

    dispatch({
      activeSidebarItemL1: labelL1,
      activeSidebarItemL2: labelL2 || null
    });
  }

  function clickItemL2(e, itemL2) {
    e.stopPropagation();
    dispatch({ activeSidebarItemL2: itemL2.label });
  }

  return (
    <div className="sidebar">
      <div className="search-area">
        <input type="text" onChange={_.debounce(onInputChange, 200)} />
        <ul className={"results" + (localState.keyword.length > 0 ? "" : " folded")}>
          {localState.filteredItems.map((item) => (
            <li className="l1" key={item.label} onClick={() => clickSearchResult(item)}>
              {item.texts[lang]}
            </li>
          ))}
        </ul>
      </div>
      <ul className="top-level">
        {sidebarConf[category].map((itemL1) => (
          <li
            className={"l1" + (activeItemL1 == itemL1.label && !activeItemL2 ? " active" : "")}
            key={itemL1.label}
            onClick={_.throttle((e) => clickItemL1(e, itemL1), 200)}>
            <span>{itemL1.texts[lang]}</span>
            {itemL1.children ? (
              <ul className={activeItemL1 == itemL1.label ? "" : "folded"}>
                {itemL1.children.map((itemL2) => (
                  <li
                    className={"l2" + (activeItemL2 == itemL2.label ? " active" : "")}
                    key={itemL2.label}
                    onClick={_.throttle((e) => clickItemL2(e, itemL2), 200)}>
                    {itemL2.texts[lang]}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
