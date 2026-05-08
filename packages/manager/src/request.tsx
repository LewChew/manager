import { baseRequest } from '@linode/api-v4/lib/request';

import { API_ROOT, DEFAULT_ERROR_MESSAGE } from 'src/constants';
import { setErrors } from 'src/store/globalErrors/globalErrors.actions';

import { getEnvLocalStorageOverrides } from './utilities/storage';

import type { ApplicationStore } from './store';
import type { APIError, Profile } from '@linode/api-v4';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const handleSuccess: <T extends AxiosResponse<any>>(response: T) => T | T = (
  response
) => {
  if (response.headers['x-maintenance-mode']) {
    Promise.reject(response);
  }

  return response;
};

// All errors returned by the actual Linode API are in this shape.
export type LinodeError = { errors: APIError[] };

export const handleError = (
  error: AxiosError<LinodeError>,
  store: ApplicationStore
) => {
  const status: number = error.response?.status ?? 0;
  const errors: APIError[] = error.response?.data?.errors ?? [
    { reason: DEFAULT_ERROR_MESSAGE },
  ];

  const apiInMaintenanceMode = !!error.response?.headers['x-maintenance-mode'];

  if (apiInMaintenanceMode) {
    store.dispatch(
      setErrors({
        api_maintenance_mode: true,
      })
    );
  }

  if (
    !!errors[0].reason.match(/account must be activated/i) &&
    status === 403
  ) {
    store.dispatch(
      setErrors({
        account_unactivated: true,
      })
    );
  }

  // Downstream components should only have to handle ApiFieldErrors, not AxiosErrors.
  return Promise.reject(errors);
};

export const getURL = ({ baseURL, url }: AxiosRequestConfig) => {
  if (!url || !baseURL) {
    return;
  }

  const localStorageOverrides = getEnvLocalStorageOverrides();

  const apiRoot = localStorageOverrides?.apiRoot ?? API_ROOT;

  // If we have environment overrides in local storage, use those. Otherwise,
  // override the baseURL (from @linode/api-v4) with the one we have defined
  // in the environment (via .env file).
  return url.replace(baseURL, apiRoot);
};

// The API returns an HTTP header for all
// requests made by Akamai users. This middleware injects the value
// of this header to the GET /profile response so it can be used
// throughout the app.
export type ProfileWithAkamaiAccountHeader = Profile & {
  _akamaiAccount: boolean;
};

// A user's external UUID can be found on the response to /account.
// Since that endpoint is not available to restricted users, the API also
// returns it as an HTTP header ("X-Customer-Uuid"). This header is injected
// in the response to `/profile` so that it's available in Redux.
export type ProfileWithEuuid = Profile & {
  _euuidFromHttpHeader?: string;
};

export const injectAkamaiAccountHeader = (
  response: AxiosResponse
): AxiosResponse => {
  const akamaiAccountHeader = 'akamai-internal-account';
  // NOTE: this won't work locally (only staging and prod allow this header)
  if (isSuccessfulGETProfileResponse(response)) {
    const modifiedData: ProfileWithAkamaiAccountHeader = {
      ...response.data,
      _akamaiAccount: akamaiAccountHeader in response.headers,
    };
    return {
      ...response,
      data: modifiedData,
    };
  }
  return response;
};

export const isSuccessfulGETProfileResponse = (
  response: AxiosResponse
): response is AxiosResponse<Profile> => {
  const { config, status } = response;

  const method = config.method?.toLowerCase();
  const url = config.url?.toLowerCase();

  return (
    (method === 'get' && status === 200 && url?.endsWith('/profile')) ?? false
  );
};

/**
 * A user's external UUID can be found on the response to /account.
 * Since that endpoint is not available to restricted users, the API also
 * returns it as an HTTP header ("X-Customer-Uuid"). This middleware injects
 * the value of the header to the GET /profile response so it can be added to
 * the Redux store and used throughout the app.
 */
export const injectEuuidToProfile = (
  response: AxiosResponse
): AxiosResponse => {
  if (isSuccessfulGETProfileResponse(response)) {
    const xCustomerUuidHeader = response.headers['x-customer-uuid'];
    // NOTE: this won't work locally (only staging and prod allow this header)
    if (xCustomerUuidHeader) {
      const profileWithEuuid: ProfileWithEuuid = {
        ...response.data,
        _euuidFromHttpHeader: xCustomerUuidHeader,
      };

      return {
        ...response,
        data: profileWithEuuid,
      };
    }
  }
  return response;
};

export const setupInterceptors = (_store: ApplicationStore) => {
  baseRequest.interceptors.request.use((config) => ({
    ...config,
    url: getURL(config),
  }));

  // POC mode: silently swallow all API errors so unmocked endpoints don't blow up the UI.
  baseRequest.interceptors.response.use(handleSuccess, (error: AxiosError) =>
    Promise.resolve({
      data: null,
      status: error.response?.status ?? 0,
      statusText: error.response?.statusText ?? '',
      headers: error.response?.headers ?? {},
      config: error.config ?? {},
    })
  );

  baseRequest.interceptors.response.use(injectAkamaiAccountHeader);
  baseRequest.interceptors.response.use(injectEuuidToProfile);
};
