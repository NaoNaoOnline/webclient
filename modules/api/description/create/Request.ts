export interface DescriptionCreateRequest {
  atkn: string;
  evnt: string;
  text: string;
}

export function NewDescriptionCreateRequestFromFormData(frm: FormData, atk: string, evn: string): DescriptionCreateRequest {
  const des = frm.get("description-input")?.toString() || "";

  return {
    atkn: atk,
    evnt: evn,
    text: des,
  };
}
