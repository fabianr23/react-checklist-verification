import { successFetchResponse } from "../helpers/APIMocks";

export default function fetchChecks() {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      true ? resolve(successFetchResponse) : reject({ success: false })
    );
  });
}

export function submitCheckResults(successResults) {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      true ? resolve(successResults) : reject({ success: false })
    );
  });
}
