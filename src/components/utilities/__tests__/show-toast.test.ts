import { toast } from 'goey-native-toast';

import { ShowToast } from '../show-toast';

const DEFAULTS = { position: 'top-left', duration: 4000 };

describe('ShowToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ShowToast.resetDefaults();
  });

  it('success forwards the message with the configured defaults', () => {
    ShowToast.success('Saved');

    expect(toast.success).toHaveBeenCalledWith('Saved', DEFAULTS);
  });

  it('merges a description string into the options', () => {
    ShowToast.success('Saved', 'Your changes are live');

    expect(toast.success).toHaveBeenCalledWith('Saved', {
      ...DEFAULTS,
      description: 'Your changes are live',
    });
  });

  it('lets per-call options override the defaults', () => {
    ShowToast.success('Saved', { duration: 6000 });

    expect(toast.success).toHaveBeenCalledWith('Saved', {
      ...DEFAULTS,
      duration: 6000,
    });
  });

  it('setDefaults merges into subsequent calls and resetDefaults restores', () => {
    ShowToast.setDefaults({ position: 'bottom-center' });
    ShowToast.success('Hi');
    expect(toast.success).toHaveBeenCalledWith('Hi', {
      position: 'bottom-center',
      duration: 4000,
    });

    ShowToast.resetDefaults();
    ShowToast.error('Oops');
    expect(toast.error).toHaveBeenCalledWith('Oops', DEFAULTS);
  });

  it('loading forces an infinite duration', () => {
    ShowToast.loading('Syncing…');

    expect(toast.info).toHaveBeenCalledWith('Syncing…', {
      ...DEFAULTS,
      duration: Infinity,
    });
  });

  it('show, info, and warning forward to the underlying toast api', () => {
    ShowToast.show('Plain');
    expect(toast.info).toHaveBeenCalledWith('Plain', DEFAULTS);

    ShowToast.info('Note');
    expect(toast.info).toHaveBeenCalledWith('Note', DEFAULTS);

    ShowToast.warning('Careful', 'Heads up');
    expect(toast.warning).toHaveBeenCalledWith('Careful', {
      ...DEFAULTS,
      description: 'Heads up',
    });
  });

  it('custom, promise, and dismiss forward to the underlying toast api', async () => {
    ShowToast.custom('Custom', { position: 'bottom-center' });
    expect(toast.custom).toHaveBeenCalledWith('Custom', {
      position: 'bottom-center',
      duration: 4000,
    });

    const promise = Promise.resolve('done');
    ShowToast.promise(promise, {
      loading: 'Loading',
      success: () => 'Done',
      error: () => 'Failed',
    });
    expect(toast.promise).toHaveBeenCalledWith(promise, {
      loading: 'Loading',
      success: expect.any(Function),
      error: expect.any(Function),
    });

    ShowToast.dismiss('toast-1');
    expect(toast.dismiss).toHaveBeenCalledWith('toast-1');
  });
});
