import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[T | null, any]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    console.log("Error with the request: ", error);
    return [null, error];
  }
}
