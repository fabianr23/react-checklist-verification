export const successFetchResponse = [
  {
    id: "aaa",
    priority: 10,
    description: "Face on the picture matches face on the document",
  },
  {
    id: "bbb",
    priority: 5,
    description: "Veriff supports presented document",
  },
  {
    id: "ccc",
    priority: 7,
    description: "Face is clearly visible",
  },
  {
    id: "ddd",
    priority: 3,
    description: "Document data is clearly visible",
  },
];

export const errorFetchResponse = { success: false };

export const successResults = [
  {
    checkId: "ddd",
    result: "yes",
  },
  {
    checkId: "bbb",
    results: "yes",
  },
  {
    checkId: "ccc",
    results: "no",
  },
];

export const rejectResults = { success: false };
