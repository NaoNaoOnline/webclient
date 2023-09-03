export interface DescriptionUpdateRequest {
  // local
  atkn: string;
  // intern
  desc: string;
  // public
  text: string;
}

export function NewDescriptionUpdateRequestFromFormData(frm: FormData, atk: string, des: string): DescriptionUpdateRequest[] {
  const txt = frm.get("description-input")?.toString() || "";

  return [{
    // local
    atkn: atk,
    // intern
    desc: des,
    // public
    text: txt,
  }];
}
