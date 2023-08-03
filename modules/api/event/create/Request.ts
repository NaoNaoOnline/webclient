import { UserSearch } from '@/modules/api/user/search/Search';

export interface EventCreateRequest {
  dura: string;
  host: string;
  labl: string;
  link: string;
  time: string;
  user: string;
}

export async function NewEventCreateRequestFromFormData(data: FormData): Promise<EventCreateRequest> {
  const hos = "" || data.get("host-input")?.toString();
  const cat = "" || data.get("category-input")?.toString();
  const lin = "" || data.get("link-input")?.toString();
  const des = "" || data.get("description-input")?.toString();
  const dat = "" || data.get("date-input")?.toString();
  const sta = "" || data.get("start-input")?.toString();
  const end = "" || data.get("end-input")?.toString();

  return {
    dura: newDura(sta, end),
    host: newLabl(hos),
    labl: newLabl(cat),
    link: newLink(lin),
    time: newTime(dat, sta),
    user: await newUser(),
  };
}

function newDura(start: string, end: string): string {
  // Your logic to calculate the duration goes here
  // For example, you can subtract 'start' from 'end' and format the result
  return "duration value";
}

function newLabl(input: string): string {
  // Your logic to process the 'host' and 'category' inputs goes here
  return input.trim();
}

function newLink(input: string): string {
  // Your logic to process the 'link' input goes here
  return input.trim();
}

function newTime(date: string, start: string): string {
  // Your logic to combine 'date' and 'start' to create the 'time' value goes here
  return "formatted time value";
}

async function newUser(): Promise<string> {
  const response = await UserSearch();
  return response.user;
}

