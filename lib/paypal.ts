export const PRICES = {
  APPOINTMENT: 19,
};

export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
export const PAYPAL_CURRENCY = "USD";

declare global {
  interface Window {
    // paypal?: any;
  }
}

export const addPaypalScript = (setScriptLoaded: (value: boolean) => void) => {
  console.log("Adding paypal script!");
  if (typeof window !== "undefined" && window.paypal) {
    setScriptLoaded(true);
    return;
  }

  if (typeof document === "undefined") return;

  const script = document.createElement("script");
  script.src =
    "https://www.paypal.com/sdk/js?client-id=sb-4i2nn47000072@business.example.com" +
    PAYPAL_CLIENT_ID +
    "&currency=" +
    PAYPAL_CURRENCY;

  script.async = true;
  script.type = "text/javascript";
  script.onload = () => setScriptLoaded(true);
  document.body.appendChild(script);
};
