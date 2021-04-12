import "./ContentArea.scss";
import contentHtml from "./content.html";
import isInViewport from "../../../util/isInViewport";

let labels = [];
let labelsL1 = [];
let labelsL2 = [];

export default function ContentArea(props) {
  // Props passed down from the parent
  const { dispatch, activeItemL1, activeItemL2 } = props;

  // Effects
  useEffect(() => {
    labelsL1 = document.querySelectorAll("h1[data-label]");
    labelsL2 = document.querySelectorAll("h2[data-label]");
    labels = [...labelsL1, ...labelsL2].sort((a, b) => {
      return a.getBoundingClientRect().y - b.getBoundingClientRect().y;
    });

    // Scroll to target label
    if (activeItemL2) {
      const lb = _.find(labelsL2, (h2) => h2.getAttribute("data-label") == activeItemL2);
      if (!isInViewport(lb)) {
        lb.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      const lb = _.find(labelsL1, (h1) => h1.getAttribute("data-label") == activeItemL1);
      if (!isInViewport(lb)) {
        lb.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeItemL1, activeItemL2]);

  function getActiveLabel(labels, mark) {
    let anchor = null;
    for (let i = 0; i < labels.length; ++i) {
      const current = labels[i];
      const rectCurrent = current.getBoundingClientRect();
      if (rectCurrent.y > mark) {
        anchor = current;
        break;
      }
      const next = labels[i + 1];
      if (!next) {
        anchor = current;
        break;
      }
      const rectNext = next.getBoundingClientRect();
      if (rectNext.y > mark) {
        anchor = current;
        break;
      }
    }
    console.log(anchor);
    return anchor;
  }

  function onContentScroll() {
    const anchor = getActiveLabel(labels, 100);
    if (!anchor) return;

    if (anchor.nodeName == "H1") {
      dispatch({
        activeSidebarItemL1: anchor.getAttribute("data-label"),
        activeSidebarItemL2: null
      });
    } else if (anchor.nodeName == "H2") {
      const anchorIndex = _.indexOf(labels, anchor);
      const anchorParent = _.findLast(labels, (lb, i) => {
        return i < anchorIndex && lb.nodeName == "H1";
      });
      dispatch({
        activeSidebarItemL1: anchorParent.getAttribute("data-label"),
        activeSidebarItemL2: anchor.getAttribute("data-label")
      });
    }
  }

  return (
    <div className="content-area" onScroll={_.debounce(onContentScroll, 100)}>
      <div
        className="copied-html markdown-body"
        dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
    </div>
  );
}
