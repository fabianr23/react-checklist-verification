import React from "react";
import ResponseSelector from "./ResponseSelector";
import "./CheckInterface.css";

const CheckInterface = (props: {
  disabled: any;
  currentSelected: any;
  description: String;
  handleClick: any;
  position: any;
  active: any;
}) => {
  const classDisabled = props.disabled ? "disabled" : "";
  const selected = props.currentSelected ? "check-interface__selected" : "";
  return (
    <div className={`check-interface ${classDisabled} ${selected}`}>
      <p>{props.description}</p>
      <ResponseSelector
        handleClick={props.handleClick}
        disabled={props.disabled}
        position={props.position}
        active={props.active}
      />
    </div>
  );
};

export default CheckInterface;
