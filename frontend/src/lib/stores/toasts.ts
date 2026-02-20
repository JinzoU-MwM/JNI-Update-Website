import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function add(type: Toast['type'], message: string, duration = 4000) {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, message, duration };

    update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }

    return id;
  }

  function remove(id: string) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  function success(message: string, duration?: number) {
    return add('success', message, duration);
  }

  function error(message: string, duration?: number) {
    return add('error', message, duration);
  }

  function warning(message: string, duration?: number) {
    return add('warning', message, duration);
  }

  function info(message: string, duration?: number) {
    return add('info', message, duration);
  }

  function clear() {
    update(() => []);
  }

  return {
    subscribe,
    success,
    error,
    warning,
    info,
    remove,
    clear
  };
}

export const toasts = createToastStore();
