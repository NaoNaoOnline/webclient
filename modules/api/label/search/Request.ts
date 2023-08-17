export interface LabelSearchRequest {
  atkn: string;
  kind: string;
  labl: string;
}

export function LabelSearchRequest(atk: string, cat: string, hos: string): LabelSearchRequest[] {
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
