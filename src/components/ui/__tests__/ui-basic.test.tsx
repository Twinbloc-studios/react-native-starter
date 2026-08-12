import { fireEvent, render, screen } from '@testing-library/react-native';
import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { Avatar } from '../avatar';
import { Button } from '../button';
import { Checkbox } from '../check-box';
import { Container } from '../container';
import { Icon } from '../icon';
import { Image, preloadImages } from '../image';
import { Radio } from '../radio';
import { SafeFastImage } from '../safe-fast-image';
import { Center, Circle, HStack, Stack, VStack } from '../stacks';
import { Switch } from '../switch';
import { Text } from '../text';
import { Label as ToggleLabel, Root as ToggleRoot } from '../toggle-shared';

describe('Button', () => {
  it('renders label and handles loading state', () => {
    const { getByTestId, queryByTestId, rerender } = render(
      <Button label="Save" testID="button" />,
    );

    expect(screen.getByText('Save')).toBeTruthy();
    expect(queryByTestId('button-activity-indicator')).toBeNull();

    rerender(<Button label="Save" testID="button" loading />);
    expect(getByTestId('button-activity-indicator')).toBeTruthy();
    expect(queryByTestId('button-label')).toBeNull();
  });
});

describe('Toggle shared', () => {
  it('toggles Root on press', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <ToggleRoot
        checked={false}
        onChange={onChange}
        accessibilityLabel="toggle-root"
        accessibilityHint="toggles item"
      >
        <Text>Item</Text>
      </ToggleRoot>,
    );

    fireEvent.press(getByLabelText('toggle-root'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('renders Label text', () => {
    const { getByText } = render(
      <ToggleLabel text="Label" testID="toggle-label" />,
    );
    expect(getByText('Label')).toBeTruthy();
  });
});

describe('Checkbox', () => {
  it('renders label and calls onChange', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox
        checked={false}
        onChange={onChange}
        accessibilityLabel="checkbox"
        accessibilityHint="toggles checkbox"
        label="Accept"
        testID="checkbox"
      />,
    );

    expect(screen.getByText('Accept')).toBeTruthy();
    fireEvent.press(getByTestId('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('Radio', () => {
  it('renders label and calls onChange', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Radio
        checked={false}
        onChange={onChange}
        accessibilityLabel="radio"
        accessibilityHint="selects option"
        label="Option"
        testID="radio"
      />,
    );

    expect(screen.getByText('Option')).toBeTruthy();
    fireEvent.press(getByTestId('radio'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('Switch', () => {
  it('renders label and calls onChange', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <Switch
        checked={false}
        onChange={onChange}
        accessibilityLabel="switch"
        accessibilityHint="toggles switch"
        label="Enable"
        testID="switch"
      />,
    );

    expect(screen.getByText('Enable')).toBeTruthy();
    fireEvent.press(getByTestId('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('Container', () => {
  it('renders variants with children', () => {
    const { getByText } = render(
      <>
        <Container>
          <Text>Base</Text>
        </Container>
        <Container.Page>
          <Text>Page</Text>
        </Container.Page>
        <Container.Box>
          <Text>Box</Text>
        </Container.Box>
        <Container.Insets>
          <Text>Insets</Text>
        </Container.Insets>
      </>,
    );

    expect(getByText('Base')).toBeTruthy();
    expect(getByText('Page')).toBeTruthy();
    expect(getByText('Box')).toBeTruthy();
    expect(getByText('Insets')).toBeTruthy();
  });
});

describe('Stacks', () => {
  it('renders all stack components', () => {
    const { getByText } = render(
      <>
        <Stack>
          <Text>Stack</Text>
        </Stack>
        <HStack>
          <Text>HStack</Text>
        </HStack>
        <VStack>
          <Text>VStack</Text>
        </VStack>
        <Center>
          <Text>Center</Text>
        </Center>
        <Circle>
          <Text>Circle</Text>
        </Circle>
      </>,
    );

    expect(getByText('Stack')).toBeTruthy();
    expect(getByText('HStack')).toBeTruthy();
    expect(getByText('VStack')).toBeTruthy();
    expect(getByText('Center')).toBeTruthy();
    expect(getByText('Circle')).toBeTruthy();
  });
});

describe('Text', () => {
  it('renders children text', () => {
    render(<Text>Heading</Text>);
    expect(screen.getByText('Heading')).toBeTruthy();
  });
});

describe('Avatar', () => {
  it('renders fallback initials', () => {
    render(<Avatar label="Jane Doe" testID="avatar" />);
    expect(screen.getByTestId('avatar')).toBeTruthy();
    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('derives initials from a single-word label', () => {
    render(<Avatar label="Zed" />);
    expect(screen.getByText('ZE')).toBeTruthy();
  });

  it('renders the fallback image for an empty label', () => {
    render(<Avatar label="   " />);
    expect(screen.UNSAFE_getByType(ExpoImage)).toBeTruthy();
  });

  it('sizes the avatar numerically and rounds corners per shape', () => {
    render(<Avatar label="JD" size={48} shape="rounded" testID="numeric" />);
    const view = screen.getByTestId('numeric');
    // withUniwind nests the style array; flatten it before asserting.
    const flatStyles = (view.props.style as unknown[])
      .flat(Infinity)
      .filter(Boolean);
    expect(flatStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 48,
          height: 48,
          borderRadius: Math.round(48 * 0.2),
        }),
      ]),
    );
  });

  it('falls back to initials when the image fails and calls imageProps.onError', () => {
    const onImageError = jest.fn();
    render(
      <Avatar
        source={{ uri: 'https://example.com/avatar.png' }}
        label="Jane"
        imageProps={{ onError: onImageError }}
      />,
    );

    fireEvent(
      screen.UNSAFE_getByType(ExpoImage),
      'error',
      new Error('load failed'),
    );

    expect(onImageError).toHaveBeenCalled();
    expect(screen.getByText('JA')).toBeTruthy();
  });
});

describe('Icon and Image', () => {
  it('renders Icon with provided props', () => {
    const icon = require('@/assets/images/icon.png');
    const { getByTestId } = render(<Icon icon={icon} testID="icon" />);
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('renders Image with default placeholder', () => {
    const { getByTestId } = render(
      <Image
        testID="image"
        source={{ uri: 'https://example.com/image.png' }}
      />,
    );
    expect(getByTestId('image').props.placeholder).toBe(
      'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    );
  });

  it('preloads images', () => {
    preloadImages(['https://example.com/a.png']);
    expect(ExpoImage.prefetch).toHaveBeenCalledWith([
      'https://example.com/a.png',
    ]);
  });
});

describe('SafeFastImage', () => {
  it('uses fallback on invalid source', () => {
    const { getByTestId } = render(
      <SafeFastImage testID="safe" source={{ uri: '' }} />,
    );
    expect(getByTestId('safe').props.transition).toBe(0);
    expect(getByTestId('safe').props.source).toBeDefined();
  });

  it('uses blurhash placeholder and transition', () => {
    const { getByTestId } = render(
      <SafeFastImage
        testID="safe"
        source={{ uri: 'https://example.com/img.png' }}
        blurhash="hash"
      />,
    );
    expect(getByTestId('safe').props.placeholder).toBe('hash');
    expect(getByTestId('safe').props.transition).toBe(500);
  });

  it('switches to the fallback and calls onError when the image fails', () => {
    const onError = jest.fn();
    render(
      <SafeFastImage
        testID="safe"
        source={{ uri: 'https://example.com/img.png' }}
        blurhash="hash"
        onError={onError}
      />,
    );

    fireEvent(
      screen.UNSAFE_getByType(ExpoImage),
      'error',
      new Error('load failed'),
    );

    expect(onError).toHaveBeenCalled();
    // The fallback drops the original placeholder.
    expect(screen.getByTestId('safe').props.placeholder).toBeUndefined();
    expect(screen.getByTestId('safe').props.source).toBeDefined();
  });
});

describe('Icon with custom view', () => {
  it('renders with style props', () => {
    const icon = require('@/assets/images/icon.png');
    const { getByTestId } = render(
      <Icon icon={icon} testID="icon-styled" style={{ opacity: 0.5 }} />,
    );
    expect(getByTestId('icon-styled')).toBeTruthy();
  });
});

describe('Image className', () => {
  it('accepts className prop', () => {
    const { getByTestId } = render(
      <Image
        testID="image-class"
        className="rounded-md"
        source={{ uri: 'https://example.com' }}
      />,
    );
    expect(getByTestId('image-class')).toBeTruthy();
  });
});

describe('Toggle shared label usage', () => {
  it('renders label inside a view', () => {
    render(
      <View>
        <ToggleLabel text="Label Text" testID="label-text" />
      </View>,
    );
    expect(screen.getByText('Label Text')).toBeTruthy();
  });
});
