import "./Navbar.scss";
import Logo from "./logo.svg";
import navbarConf from "./navbarConf.json";

export default function Navbar(props) {
  const { dispatch, lang, activeItem } = props;

  function setActiveItem(label) {
    dispatch({ activeNavbarItem: label });
  }

  function onLangBtnClick() {
    dispatch({ lang: lang == "en-us" ? "zh-cn" : "en-us" });
  }

  return (
    <nav className="flex">
      <Logo />
      <ul className="flex">
        {navbarConf.items.map((item) => (
          <li
            key={item.label}
            className={activeItem == item.label ? "active" : ""}
            onClick={() => setActiveItem(item.label)}>
            {item.texts[lang]}
          </li>
        ))}
      </ul>
      <button onClick={onLangBtnClick}>{navbarConf.langBtn.texts[lang]}</button>
    </nav>
  );
}
