import { accountQueries, profileQueries } from '@linode/queries';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

/**
 * This hook is responsible for making Cloud Manager's initial requests.
 * POC mode: seeds query cache with mock data instead of calling the API.
 */
export const useInitialRequests = () => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Seed query cache with mock data for POC
    queryClient.setQueryData(accountQueries.account.queryKey, {
      active_promotions: [],
      active_since: '2024-01-01T00:00:00',
      address_1: '',
      address_2: '',
      balance: 0,
      balance_uninvoiced: 0,
      billing_source: 'linode',
      capabilities: [
        'Linodes', 'NodeBalancers', 'Block Storage', 'Object Storage',
        'Kubernetes', 'Cloud Firewall', 'Vlans', 'VPCs', 'Placement Group',
        'Databases',
      ],
      city: '',
      company: '',
      country: 'US',
      credit_card: { expiry: '01/2030', last_four: '1234' },
      email: 'user@example.com',
      euuid: 'mock-euuid',
      first_name: 'POC',
      last_name: 'User',
      phone: '',
      state: '',
      tax_id: '',
      zip: '',
    });
    queryClient.setQueryData(accountQueries.settings.queryKey, {
      backups_enabled: false,
      longview_subscription: null,
      managed: false,
      network_helper: true,
      object_storage: 'active',
    });
    queryClient.setQueryData(profileQueries.profile().queryKey, {
      authorized_keys: [],
      email: 'user@example.com',
      email_notifications: true,
      ip_whitelist_enabled: false,
      lish_auth_method: 'keys_only',
      referrals: { code: '', completed: 0, credit: 0, pending: 0, total: 0, url: '' },
      restricted: false,
      timezone: 'America/New_York',
      two_factor_auth: false,
      uid: 12345,
      username: 'poc-user',
      verified_phone_number: null,
      authentication_type: 'password',
    });
    queryClient.setQueryData(profileQueries.preferences.queryKey, {
      collapsedSideNavProductFamilies: [],
    });
    setIsLoading(false);
  }, []);

  return { isLoading };
};
