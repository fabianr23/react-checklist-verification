import { successResponse } from "../helpers/APIMocks";

export default function fetchChecks() {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      true ? resolve(successResponse) : reject({ success: false })
    );
  });
}
