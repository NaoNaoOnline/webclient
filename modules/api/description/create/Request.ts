export interface DescriptionCreateRequest {
  // local
  atkn: string;
  // public
  evnt: string;
  text: string;
}

export function NewDescriptionCreateRequestFromFormData(frm: FormData, atk: string, evn: string): DescriptionCreateRequest[] {
  const des = frm.get("description-input")?.toString() || "";

  return [{
    // local
    atkn: atk,
    // public
    evnt: evn,
    text: des,
  }];
}
