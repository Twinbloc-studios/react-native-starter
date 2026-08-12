export const toasterDefaults = {
  position: 'top-left',
  duration: 4000,
  solidColors: false,
  swipeToDismissDirection: 'up',
} as const;

export const toastDefaults = {
  position: toasterDefaults.position,
  duration: toasterDefaults.duration,
} as const;
