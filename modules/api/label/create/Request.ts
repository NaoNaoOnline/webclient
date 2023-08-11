export interface LabelCreateRequest {
  atkn: string;
  desc?: string;
  disc?: string;
  kind: string;
  name: string;
  twit?: string;
}

export function HostLabelCreateRequest(atk: string, hos: string): LabelCreateRequest[] {
  return [{
    atkn: atk,
    kind: "host",
    name: hos,
  }];
}

export function CateLabelCreateRequest(atk: string, cat: string): LabelCreateRequest[] {
  const req: LabelCreateRequest[] = [];

  for (const element of cat.split(',')) {
    req.push({
      atkn: atk,
      kind: "cate",
      name: element.trim(),
    });
  }

  return req;
}
