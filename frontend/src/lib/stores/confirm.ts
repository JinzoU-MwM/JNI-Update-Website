interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve: ((value: boolean) => void) | null;
}

function createConfirmStore() {
  let state = $state<ConfirmState>({
    open: false,
    title: 'Konfirmasi',
    message: '',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    variant: 'danger',
    resolve: null
  });

  function show(options: ConfirmOptions): Promise<boolean> {
    state = {
      open: true,
      title: options.title || 'Konfirmasi',
      message: options.message,
      confirmText: options.confirmText || 'Ya, Lanjutkan',
      cancelText: options.cancelText || 'Batal',
      variant: options.variant || 'danger',
      resolve: null
    };

    return new Promise((resolve) => {
      state.resolve = resolve;
    });
  }

  function confirm() {
    if (state.resolve) {
      state.resolve(true);
    }
    state.open = false;
  }

  function cancel() {
    if (state.resolve) {
      state.resolve(false);
    }
    state.open = false;
  }

  return {
    get state() {
      return state;
    },
    show,
    confirm,
    cancel
  };
}

export const confirmDialog = createConfirmStore();
