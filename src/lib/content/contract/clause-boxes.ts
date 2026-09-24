import type { ClauseBoxRegistry } from "$lib/document/contract-model";

export const contractClauseBoxes = {
  resale: {
    intro: [
      "This means that a client can only use a Diver for its own internal business needs and cannot resell that Diver's services.",
      "Clients are sometimes concerned that this will restrict their ability to bill their own clients for services rendered.",
    ],
    negotiation: {
      body: "This concern is not true. The clause notes that this resource is committed exclusively to you but you can't subcontract the workers out as another staffing arrangement. Your ability to bill your own clients for services rendered for your work is completely unaffected.",
    },
    preferredConcessions: {
      concessionIds: ["resale-ordinary-course-billing"],
      showInfoTooltip: true,
    },
  },
  "provision-professionals": {
    intro: [
      "This is the core service: as long as the client pays and follows the contract, they get access to the Diver's services.",
      "Access is for the client's own internal use only - not to resell or hand off to someone else.",
    ],
  },
  "access-use": {
    intro: [
      "This section defines what Oceans is actually providing: access to a specific Professional (Diver) to do specific work, for the client's own internal use only.",
      "It covers what happens if a Diver needs to be swapped out, and confirms Oceans keeps ownership of anything it hasn't explicitly handed over.",
    ],
  },
} satisfies ClauseBoxRegistry;
