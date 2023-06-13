import { IonModal } from '@ionic/vue';
import { Router } from 'vue-router';

// Allow closing the modal with browser back button
export function attachHistoryListener(modal: typeof IonModal, router: Router) {
  router.push('#');
  const removeHistoryListener = router.options.history.listen(() => {
    removeHistoryListener();
    modal.dismiss();
  });
};

export function dismissModal(router: Router) {
  router.back();
}