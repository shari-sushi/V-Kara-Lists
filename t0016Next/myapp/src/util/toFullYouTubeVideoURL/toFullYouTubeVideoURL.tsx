import { timeStringToSecondNum } from "../convertion/convert"

export const toFullYouTubeVideoURL = (uri: string, startTime: string) => {
  return "https://" + uri + "&t=" + timeStringToSecondNum(startTime)
}
