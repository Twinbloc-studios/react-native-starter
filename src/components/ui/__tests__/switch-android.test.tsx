import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { Switch } from '../switch';

// Force the custom-thumb (non-iOS) branch while keeping the real color palette.
jest.mock('../../utilities', () => {
  const actual = jest.requireActual('../../utilities');
  return { ...actual, IS_IOS: false, IS_ANDROID: true };
});

const renderSwitch = (props: Partial<React.ComponentProps<typeof Switch>>) =>
  render(
    <Switch
      onChange={jest.fn()}
      accessibilityLabel="switch"
      accessibilityHint="Double tap to toggle"
      {...props}
    />,
  );

describe('Switch (android)', () => {
  it('renders the custom thumb instead of the native switch', () => {
    renderSwitch({});

    const json = JSON.stringify(screen.toJSON());
    // The thumb's reanimated translateX is positioned from the constants.
    expect(json).toContain('"translateX":-24');
    // The native switch host component is not part of the tree.
    expect(json).not.toContain('RCTSwitch');
  });

  it('positions the thumb for the checked state', () => {
    renderSwitch({ checked: true });

    expect(JSON.stringify(screen.toJSON())).toContain('"translateX":-4');
  });

  it('colors the track with the brand color when checked', () => {
    renderSwitch({ checked: true });

    expect(JSON.stringify(screen.toJSON())).toContain('#ff6c00');
  });

  it('colors the track with the neutral color when unchecked', () => {
    renderSwitch({ checked: false });

    expect(JSON.stringify(screen.toJSON())).toContain('#969696');
  });

  it('calls onChange when the root is pressed', () => {
    const onChange = jest.fn();
    render(
      <Switch
        checked={false}
        onChange={onChange}
        accessibilityLabel="switch"
        accessibilityHint="Double tap to toggle"
        testID="switch"
      />,
    );

    fireEvent.press(screen.getByTestId('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
