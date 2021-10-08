import React from "react";
import * as api from "../api";
import CheckInterface from "./CheckInterface";
import { checkType } from "../helpers/definitions";
import { orderByPriority } from "../helpers/helperFunctions";
import Button from "../Button";
import "./VerifyChecks.css";

class VerifyChecks extends React.Component<
  {},
  {
    checks: Array<checkType>;
    results: { checkId: string; result: string }[];
    submitAllowed: boolean;
    submitted: boolean;
    success: boolean;
    currentSelected: number;
    loading: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this._isMounted = false;
    this.handleResponse = this.handleResponse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.state = {
      checks: [],
      results: [],
      submitAllowed: false,
      submitted: false,
      success: false,
      currentSelected: -1,
      loading: true,
    };
  }

  private _isMounted: boolean = false;

  componentDidMount() {
    this._isMounted = true;
    const allChecks = async () => {
      const response = await api.fetchChecks();
      if (this._isMounted) {
        this.setState(() => ({
          checks: response,
          loading: false,
        }));
        this.disableChecks();
      }
    };
    allChecks().catch(() => {
      if (this._isMounted) {
        this.setState(() => ({
          loading: false,
        }));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleResponse(answer: string, position: number): void {
    if (answer.toLowerCase() === "no") {
      this.disableChecks(position);
      this.setState(() => ({ submitAllowed: true }));
      this.setAnswer(position, "no");
    } else {
      if (this.state.results[position]?.result !== "yes") {
        this.processYesAnswer(position);
        this.setAnswer(position, "yes");
      }
    }
    this.setState(() => ({
      currentSelected: position,
    }));
  }

  handleSubmit(): void {
    const submitChecks = async () => {
      return (
        this._isMounted && (await api.submitCheckResults(this.state.results))
      );
    };
    submitChecks()
      .then(() => {
        this.setState(() => ({
          success: true,
          submitted: true,
          submitAllowed: false,
        }));
      })
      .catch(() => {
        this.setState(() => ({
          submitted: true,
          submitAllowed: false,
        }));
      });
  }

  handleRetry(): void {
    this.setState(() => ({
      submitted: false,
      submitAllowed: true,
    }));
  }

  handleKeyPressed(event: { persist: () => void; key: any }): void {
    event.persist();
    const pressedKey = event.key;
    const current = this.state.currentSelected;
    switch (pressedKey) {
      case "ArrowDown":
        if (
          this.state.checks[current + 1]?.disable !== true &&
          this.state.checks[current + 1]
        ) {
          this.setState(() => ({
            currentSelected: current + 1,
          }));
        }
        break;
      case "ArrowUp":
        if (this.state.checks[current - 1]) {
          this.setState(() => ({
            currentSelected: current - 1,
          }));
        }
        break;
      case "1":
        this.handleResponse("yes", current);
        break;
      case "2":
        this.handleResponse("no", current);
        break;
      default:
        break;
    }
  }

  processYesAnswer(position: number): void {
    const isLastCheck = this.state.checks.length === position + 1;
    if (!isLastCheck) {
      this.enableNextCheck(position);
      this.setState(() => ({ submitAllowed: false }));
    } else {
      this.setState(() => ({ submitAllowed: true }));
    }
  }

  disableChecks(initialPosition: number = 0): void {
    let listUpdated = [...this.state.checks];
    listUpdated.map((check, index) => {
      const disable =
        index > initialPosition ? { disable: true } : { disable: false };
      return Object.assign(check, disable);
    });
    this.setState(() => ({
      checks: listUpdated,
    }));
  }

  enableNextCheck(initialPosition: number): void {
    let listUpdated = [...this.state.checks];
    listUpdated[initialPosition + 1].disable = false;
    this.setState(() => ({
      checks: listUpdated,
    }));
  }

  setAnswer(position: number, response: string): void {
    const newResults = [...this.state.results];
    newResults[position] = {
      checkId: this.state.checks[position].id,
      result: response,
    };
    this.setState({ results: newResults });

    let answerList: { checkId: string; result: string }[] = [];
    for (let i = 0; i <= position; i++) {
      if (i === position) {
        answerList[i] = {
          checkId: this.state.checks[i].id,
          result: response,
        };
      } else {
        answerList[i] = {
          checkId: this.state.checks[i].id,
          result: "yes",
        };
      }
    }

    this.setState(() => ({
      results: answerList,
    }));
  }

  preRenderList(orderedList: Array<checkType>): {} {
    let renderList: {};
    if (orderedList?.length > 0) {
      renderList = orderedList.map((check, index) => {
        const checkResult = this.state.results[index];
        let activeTab: string;
        if (checkResult && checkResult.result === "no") {
          activeTab = "active-right";
        } else if (checkResult && checkResult.result === "yes") {
          activeTab = "active-left";
        } else {
          activeTab = "";
        }
        return (
          <CheckInterface
            key={check.id}
            disabled={check.disable}
            description={check.description}
            handleClick={this.handleResponse}
            position={index}
            currentSelected={index === this.state.currentSelected}
            active={activeTab}
          />
        );
      });
    } else {
      renderList = (
        <div className="success-msg success-msg--error">
          <p>
            There was an error while loading data from the server. Please reload
            the page to retry.
          </p>
        </div>
      );
    }
    return renderList;
  }

  preRenderErrorSending(): {} {
    return (
      <div className="success-msg success-msg--error">
        <p>
          There was an error while saving the data in the server. Please use the
          button to retry.
        </p>
        <Button children="Retry" onClick={this.handleRetry} />
      </div>
    );
  }

  preRenderSuccessSending(): {} {
    return (
      <div className="success-msg">
        <h2>SUCCESS!</h2>
        <p>Your selections were saved correctly.</p>
      </div>
    );
  }

  preRenderLoading(): {} {
    return (
      <div className="loading">
        <div> Loading... </div>
      </div>
    );
  }

  render() {
    const orderedList: Array<checkType> = orderByPriority(this.state?.checks);
    const renderList: {} = this.preRenderList(orderedList);
    const renderSuccess: {} = this.preRenderSuccessSending();
    const renderErrorSending: {} = this.preRenderErrorSending();
    const renderLoading: {} = this.preRenderLoading();
    return (
      <section
        className="checks-container"
        onKeyDown={this.handleKeyPressed}
        tabIndex={0}
      >
        {this.state.loading && renderLoading}
        {!this.state.submitted && !this.state.loading && renderList}
        {this.state.success && renderSuccess}
        <div className="checks-questions">
          {this.state.submitted && !this.state.success && renderErrorSending}
        </div>
        <div className="checks-submit">
          <Button
            disabled={!this.state?.submitAllowed}
            children="Submit"
            onClick={this.handleSubmit}
          />
        </div>
      </section>
    );
  }
}

export default VerifyChecks;
