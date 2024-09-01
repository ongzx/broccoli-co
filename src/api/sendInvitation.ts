const API_ENDPOINT =
  "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth";

interface ApiParams {
  name: string;
  email: string;
}

export async function sendInvitation(
  params: ApiParams,
  signal: AbortSignal,
): Promise<{ status: string; res?: unknown | string }> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal,
    });
    const res = await response.json();
    if (response.status === 200) {
      return {
        status: "ok",
        res,
      };
    } else {
      return {
        status: "err",
        ...res,
      };
    }
  } catch (error) {
    return { status: "err" };
  }
}
