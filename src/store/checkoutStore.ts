import { Store } from "@tanstack/react-store";
import { useStore } from "@tanstack/react-store";

type CheckoutState = {
  lastOrderId: string | null;
  lastOrderCreatedAt: string | null;
  redirectToTracking: boolean;
};

type AppStoreState = {
  checkout: CheckoutState;
};

const STORAGE_KEY = "arancia_app_checkout_state";

const defaultState: AppStoreState = {
  checkout: {
    lastOrderId: null,
    lastOrderCreatedAt: null,
    redirectToTracking: false,
  },
};

const loadInitialState = (): AppStoreState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw) as Partial<AppStoreState>;
    return {
      checkout: {
        ...defaultState.checkout,
        ...(parsed.checkout || {}),
      },
    };
  } catch {
    return defaultState;
  }
};

export const appStore = new Store<AppStoreState>(loadInitialState());

const persistState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appStore.state));
  } catch {
    // Ignore storage errors to avoid breaking checkout flow.
  }
};

appStore.subscribe(() => {
  persistState();
});

export const registerSuccessfulCheckout = (orderId: string) => {
  appStore.setState((prev) => ({
    ...prev,
    checkout: {
      lastOrderId: orderId,
      lastOrderCreatedAt: new Date().toISOString(),
      redirectToTracking: true,
    },
  }));
};

export const clearCheckoutRedirectFlag = () => {
  appStore.setState((prev) => ({
    ...prev,
    checkout: {
      ...prev.checkout,
      redirectToTracking: false,
    },
  }));
};

export const useCheckoutState = <T,>(selector: (state: CheckoutState) => T) =>
  useStore(appStore, (state) => selector(state.checkout));
