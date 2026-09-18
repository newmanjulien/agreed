import type { ChangeRequest } from "./types";

export const mockRequests: ChangeRequest[] = [
  {
    id: "redlined-purchase-agreement",
    requestedChange:
      "Add a 10-day notice period before suspending service for non-payment",
    type: "Can accept",
    action: "Accept",
    points: 3,
  },
  {
    id: "closing-date-screenshot",
    requestedChange:
      "Increase the liability cap from 1x to 2x fees paid under the MSA",
    type: "Needs approval",
    action: "Add",
  },
  {
    id: "inspection-credit-recording",
    requestedChange: "Require unlimited liability for all breaches of the MSA",
    type: "Can't accept",
    action: "See more",
  },
  {
    id: "redlined-real-estate-agreement",
    requestedChange:
      "Add a 30-day cure period before termination for material breach",
    type: "Can accept",
    action: "Accept",
    points: 1,
  },
  {
    id: "financing-contingency-screenshot",
    requestedChange:
      "Add a termination for convenience right with 30 days' notice",
    type: "Needs approval",
    action: "Add",
  },
];
