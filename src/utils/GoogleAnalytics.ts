import firebase from 'firebase/app';
import 'firebase/analytics';

type IActionName =
  | 'catalog/apply_keymap'
  | 'catalog/back_to_search'
  | 'catalog/build'
  | 'catalog/build/build_firmware'
  | 'catalog/build/change_description'
  | 'catalog/build/delete_firmware'
  | 'catalog/build/download_firmware'
  | 'catalog/build/flash_firmware'
  | 'catalog/cheat_sheet'
  | 'catalog/clear_search_condition'
  | 'catalog/download_firmware'
  | 'catalog/firmware'
  | 'catalog/flash_firmware'
  | 'catalog/introduction'
  | 'catalog/keymap'
  | 'catalog/open_from_search'
  | 'catalog/same_author_keyboard'
  | 'catalog/search'
  | 'configure/cheat_sheet'
  | 'configure/clear_all_changes'
  | 'configure/flash'
  | 'configure/flash_macro'
  | 'configure/import_local_file'
  | 'configure/lighting'
  | 'configure/open'
  | 'configure/restore_keymap'
  | 'configure/save_keymap'
  | 'docs/build'
  | 'docs/encoders'
  | 'docs/faq'
  | 'docs/review_policy'
  | 'docs/support-code-editing'
  | 'docs/support-qmk-022'
  | 'docs/terms_of_use';

interface IActionOptions {
  vendor_id?: string | number;
  product_id?: string | number;
  product_name?: string;
}

let analytics: firebase.analytics.Analytics | null;
try {
  analytics = firebase.analytics();
} catch (cause) {
  if (process.env.NODE_ENV === 'production') {
    throw cause;
  } else {
    analytics = null;
  }
}

export const sendEventToGoogleAnalytics = (
  action: IActionName,
  options?: IActionOptions
) => {
  if (analytics) {
    analytics.logEvent<IActionName>(action, options);
  }
};
