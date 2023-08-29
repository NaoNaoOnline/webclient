export interface LabelSearchRequest {
  // local
  atkn: string;
  // public
  kind: string;
  labl: string;
}

export function NewLabelSearchRequest(atk: string, cat: string, hos: string): LabelSearchRequest[] {
  const req: LabelSearchRequest[] = [];

  if (cat !== "") {
    req.push({
      atkn: atk,
      kind: cat,
      labl: "",
    });
  }

  if (hos !== "") {
    req.push({
      atkn: atk,
      kind: hos,
      labl: "",
    });
  }

  return req;
}
