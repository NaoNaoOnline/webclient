export interface LabelSearchRequest {
  // public
  kind: string;
  labl: string;
}

export function NewLabelSearchRequest(blt: string, cat: string, hos: string): LabelSearchRequest[] {
  const req: LabelSearchRequest[] = [];

  if (blt !== "") {
    req.push({
      kind: blt,
      labl: "",
    });
  }

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
