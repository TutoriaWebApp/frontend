export function getBackendUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.INTERNAL_BACKEND_URL ||
      process.env.internalBackendURL ||
      process.env.BACKEND_INTERNAL_URL ||
      process.env.BACKEND_BASE_URL ||
      process.env.backendBaseURL ||
      "http://localhost:8000/v1"
    );
  }
  return (
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    process.env.backendBaseURL ||
    "http://localhost:8000/v1"
  );
}
