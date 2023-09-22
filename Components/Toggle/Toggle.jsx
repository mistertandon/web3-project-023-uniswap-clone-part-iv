import { useState, useRef, useId } from "react";
const Toggle = ({
  parentWidth,
  parentHeight,
  toggleBtnBgColor = "#00B8B8",
}) => {
  const toggleBtnSelector = useId();
  const [checkboxCheckedStatus, setCheckboxCheckedStatus] = useState(false);

  const checkboxCheckedRef = useRef(false);

  const checkboxClickHandler = () => {
    const elem = document.getElementById(`${toggleBtnSelector}`);
    setCheckboxCheckedStatus(checkboxCheckedRef.current.checked);

    if (checkboxCheckedRef.current.checked) {
      elem.setAttribute(
        "style",
        `transform:translateX(100%); background-color: ${toggleBtnBgColor}`
      );
    } else {
      elem.setAttribute(
        "style",
        `transform:translateX(0%); background-color: ${toggleBtnBgColor};`
      );
    }
  };

  return (
    <section
      className="relative"
      style={{
        maxWidth: `${parentWidth}px`,
        width: `${parentWidth}px`,
        height: `${parentHeight}px`,
      }}
    >
      <div className="absolute top-0 left-0 z-10 flex items-center w-full h-full justify-evenly text-mini">
        <div>Yes</div>
        <div>No</div>
      </div>
      <div
        className="absolute top-0 left-0 z-20 w-1/2 h-full rounded-full bg-[#FF6633] transition duration-500 ease-out"
        style={{
          maxWidth: `${parentWidth / 2}px`,
          width: `${parentWidth / 2}px`,
          height: `${parentHeight}px`,
          backgroundColor: `${toggleBtnBgColor}`,
        }}
        id={`${toggleBtnSelector}`}
      ></div>
      <input
        className="absolute top-0 left-0 z-30 w-full h-full p-0 m-0 bg-transparent border-0 opacity-0 outline-0"
        type="checkbox"
        ref={checkboxCheckedRef}
        onClick={() => checkboxClickHandler()}
      />
    </section>
  );
};

export default Toggle;
