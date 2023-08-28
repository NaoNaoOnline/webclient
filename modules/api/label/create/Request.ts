export interface LabelCreateRequest {
  // local
  atkn: string;
  // public
  kind: string;
  name: string;
}

export function LabelCreateRequest(atk: string, kin: string, lab: string[]): LabelCreateRequest[] {
  const req: LabelCreateRequest[] = [];

  for (const x of lab) {
    req.push({
      atkn: atk,
      kind: kin,
      name: x.trim(),
    });
  }

  return req;
}
