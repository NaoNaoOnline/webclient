export interface LabelUpdateRequest {
  // local
  atkn: string;
  // intern
  labl: string;
  // update
  oper: string[];
  path: string[];
  valu: string[];
}
