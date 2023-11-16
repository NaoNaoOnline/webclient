export interface LabelSearchRequest {
  // intern
  labl: string;
  user: string;
  // public
  kind: string;
  name: string;
}

export const NewLabelKindSearchRequest = (kin: string[]): LabelSearchRequest[] => {
  const req: LabelSearchRequest[] = [];

  for (const x of kin) {
    req.push({
      labl: "",
      user: "",
      kind: x,
      name: "",
    });
  }

  return req;
};
