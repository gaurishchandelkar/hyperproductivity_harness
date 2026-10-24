export interface Greeting {
  message: string;
}

export async function fetchGreeting(): Promise<Greeting> {
  const response = await fetch("/api/hello");
  if (!response.ok) throw new Error(`Request failed: ${String(response.status)}`);
  return (await response.json()) as Greeting;
}
