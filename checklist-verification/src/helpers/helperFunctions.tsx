import { checkType } from "./definitions";

export function orderByPriority(list: Array<checkType>): Array<checkType> {
  return list?.sort(function (a, b) {
    return a.priority - b.priority;
  });
}
