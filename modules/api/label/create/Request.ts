export interface LabelCreateRequest {
  atkn: string;
  desc?: string;
  disc?: string;
  kind: string;
  name: string;
  twit?: string;
}

export function LabelCreateRequest(atk: string, kin: string, cat: string): LabelCreateRequest[] {
  const req: LabelCreateRequest[] = [];

  for (const element of cat.split(',')) {
    req.push({
      atkn: atk,
      kind: kin,
      name: element.trim(),
    });
  }

  return req;
}
