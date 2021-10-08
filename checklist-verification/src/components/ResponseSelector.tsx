import React from "react";
import Button from "../Button";
import "./ResponseSelector.css";

const ResponseSelector = (props: {
  handleClick?: any;
  position?: any;
  disabled?: any;
  active?: any;
}) => {
  const { position, disabled, active } = props;
  return (
    <div className={`answer-selector ${active}`}>
      <Button
        disabled={disabled}
        children="Yes"
        onClick={(e: { persist: () => void }) => {
          e.persist();
          props.handleClick("yes", position);
        }}
      />
      <Button
        disabled={disabled}
        children="No"
        onClick={(e: { persist: () => void }) => {
          e.persist();
          props.handleClick("no", position);
        }}
      />
    </div>
  );
};

export default ResponseSelector;
