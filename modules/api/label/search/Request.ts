export interface LabelSearchRequest {
  // public
  kind: string;
  labl: string;
}

export function NewLabelSearchRequest(cat: string, hos: string): LabelSearchRequest[] {
  const req: LabelSearchRequest[] = [];

  if (cat !== "") {
    req.push({
      kind: cat,
      labl: "",
    });
  }

  if (hos !== "") {
    req.push({
      kind: hos,
      labl: "",
    });
  }

  return req;
}
