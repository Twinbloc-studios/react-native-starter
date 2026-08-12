import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { toast } from 'goey-native-toast';
import type React from 'react';

import { delay } from '@/lib/utils/delay';

import { confirmDialog } from '../confirm-dialog';

// jest.setup.js mocks goey-native-toast without `update` — define a fuller
// mock here so the confirm flow can be exercised.
jest.mock('goey-native-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    custom: jest.fn(() => 'toast-id-1'),
    promise: jest.fn(),
    dismiss: jest.fn(),
    update: jest.fn(),
  },
}));

const lastCustomBody = () => {
  const options = (toast.custom as jest.Mock).mock.calls.at(-1)?.[1] as {
    customBody?: React.ReactElement;
  };
  return options.customBody;
};

describe('confirmDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (toast.custom as jest.Mock).mockReturnValue('toast-id-1');
  });

  it('presents a confirmation toast with the given title and options', () => {
    confirmDialog({
      title: 'Delete item?',
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: jest.fn(),
    });

    expect(toast.custom).toHaveBeenCalledWith(
      'Delete item?',
      expect.objectContaining({
        autoDismiss: false,
        duration: Infinity,
        backgroundColor: 'blue',
        customBody: expect.anything(),
      }),
    );
  });

  it('runs onConfirm and flips the toast to a success state', async () => {
    const onConfirm = jest.fn();
    confirmDialog({
      description: 'Proceed?',
      confirmLabel: 'Yes',
      onConfirm,
    });

    render(lastCustomBody()!);
    fireEvent.press(screen.getByLabelText('Yes'));

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(toast.update).toHaveBeenCalledWith(
        'toast-id-1',
        expect.objectContaining({
          autoDismiss: true,
          duration: 4000,
          dismissible: true,
          backgroundColor: '#7FFF00',
        }),
      ),
    );
  });

  it('supports async onConfirm before updating the toast', async () => {
    const onConfirm = jest.fn(async () => {
      await delay(10);
    });
    confirmDialog({ description: 'Save?', confirmLabel: 'Save', onConfirm });

    render(lastCustomBody()!);
    fireEvent.press(screen.getByLabelText('Save'));

    await waitFor(() => expect(toast.update).toHaveBeenCalled());
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel and dismisses the toast when cancelled', () => {
    const onCancel = jest.fn();
    confirmDialog({
      description: 'Proceed?',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
      onConfirm: jest.fn(),
      onCancel,
    });

    render(lastCustomBody()!);
    fireEvent.press(screen.getByLabelText('No'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(toast.dismiss).toHaveBeenCalledWith('toast-id-1');
    expect(toast.update).not.toHaveBeenCalled();
  });

  it('uses the destructive variant colors and success background', async () => {
    const onConfirm = jest.fn();
    confirmDialog({
      description: 'Permanently delete?',
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm,
    });

    expect(toast.custom).toHaveBeenCalledWith(
      'Are you sure?',
      expect.objectContaining({ backgroundColor: 'red' }),
    );

    render(lastCustomBody()!);
    fireEvent.press(screen.getByLabelText('Delete'));

    await waitFor(() =>
      expect(toast.update).toHaveBeenCalledWith(
        'toast-id-1',
        expect.objectContaining({ backgroundColor: '#006400' }),
      ),
    );
  });

  it('dismisses a previously active confirmation when invoked again', () => {
    confirmDialog({ description: 'First', onConfirm: jest.fn() });

    // Only count dismissals caused by the second invocation.
    (toast.dismiss as jest.Mock).mockClear();

    (toast.custom as jest.Mock).mockReturnValue('toast-id-2');
    confirmDialog({ description: 'Second', onConfirm: jest.fn() });

    expect(toast.dismiss).toHaveBeenCalledWith('toast-id-1');
  });
});
