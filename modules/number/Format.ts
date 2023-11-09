export function FormatNumber(num: number, pre: number = 2) {
  if (num == 0) return "0";

  const stp = 1000;
  const fmt = ["", "K", "M", "B", "T"];
  const ind = Math.floor(Math.log(num) / Math.log(stp));

  return parseFloat((num / Math.pow(stp, ind)).toFixed(pre)) + " " + fmt[ind];
}
