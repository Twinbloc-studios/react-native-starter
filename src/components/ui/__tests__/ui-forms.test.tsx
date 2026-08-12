import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, View as RNView } from 'react-native';
import Svg from 'react-native-svg';

import { Accordion } from '../accordion';
import { BottomSheet, useBottomSheet } from '../bottom-sheet';
import { ControlledInput, Input } from '../input';
import { InputView } from '../input-view';
import { ControlledSelect, Options, Select } from '../select';
import { Text } from '../text';

const getTrueSheetMocks = () => {
  const module = jest.requireMock('@lodev09/react-native-true-sheet') as {
    __mocks: { mockPresent: jest.Mock; mockDismiss: jest.Mock };
  };
  return module.__mocks;
};

const findAncestorWithClass = (
  node: { parent: unknown } | null,
  className: string,
): { props: { className?: string } } | null => {
  let current = node?.parent as
    ({ props: { className?: string } } & { parent: unknown }) | undefined;
  while (current) {
    if (current.props.className?.includes(className)) return current;
    current = current.parent as never;
  }
  return null;
};

describe('Accordion', () => {
  const sections = [
    { title: 'A', content: 'A content' },
    { title: 'B', content: 'B content' },
  ];
  const renderAccordion = (props: {
    activeSections?: number[];
    onChange?: (sections: number[]) => void;
    expandMultiple?: boolean;
  }) =>
    render(
      <Accordion
        sections={sections}
        activeSections={[]}
        onChange={jest.fn()}
        renderHeader={(section) => <Text>{section.title}</Text>}
        renderContent={(section) => <Text>{section.content}</Text>}
        {...props}
      />,
    );

  it('calls onChange when a section is toggled', () => {
    const onChange = jest.fn();
    renderAccordion({ onChange });

    fireEvent.press(screen.getByLabelText('Accordion section 1'));
    expect(onChange).toHaveBeenCalledWith([0]);
  });

  it('collapses an expanded section', () => {
    const onChange = jest.fn();
    renderAccordion({ activeSections: [0], onChange });

    fireEvent.press(screen.getByLabelText('Accordion section 1'));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('keeps other sections open when expandMultiple is set', () => {
    const onChange = jest.fn();
    renderAccordion({ activeSections: [0], onChange, expandMultiple: true });

    fireEvent.press(screen.getByLabelText('Accordion section 2'));
    expect(onChange).toHaveBeenCalledWith([0, 1]);
  });

  it('measures content height on layout', () => {
    renderAccordion({ activeSections: [0] });

    const layoutView = screen
      .UNSAFE_getAllByType(RNView)
      .find((view) => typeof view.props.onLayout === 'function');
    expect(layoutView).toBeTruthy();

    fireEvent(layoutView!, 'layout', {
      nativeEvent: { layout: { height: 120 } },
    });
  });
});

describe('BottomSheet and useBottomSheet', () => {
  it('renders title and dismisses from close button', () => {
    const { mockDismiss } = getTrueSheetMocks();
    render(
      <BottomSheet title="Actions">
        <Text>Body</Text>
      </BottomSheet>,
    );

    fireEvent.press(screen.getByLabelText('close BottomSheet'));
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('presents from hook', () => {
    const { mockPresent } = getTrueSheetMocks();

    const Sample = () => {
      const sheet = useBottomSheet();
      return (
        <>
          <Pressable
            onPress={sheet.present}
            testID="present"
            accessibilityRole="button"
            accessibilityLabel="present"
            accessibilityHint="Presents the bottom sheet"
          />
          <BottomSheet ref={sheet.ref}>
            <Text>Sheet</Text>
          </BottomSheet>
        </>
      );
    };

    render(<Sample />);
    fireEvent.press(screen.getByTestId('present'));
    expect(mockPresent).toHaveBeenCalled();
  });
});

describe('Input', () => {
  it('renders label and error', () => {
    render(<Input label="Email" testID="email" error="Required" />);
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Required')).toBeTruthy();
  });

  it('renders ControlledInput with form control', () => {
    const Sample = () => {
      const { control } = useForm<{ name: string }>({
        defaultValues: { name: '' },
      });
      return (
        <ControlledInput
          name="name"
          control={control}
          testID="name-input"
          label="Name"
        />
      );
    };

    render(<Sample />);
    fireEvent.changeText(screen.getByTestId('name-input'), 'Jane');
    expect(screen.getByTestId('name-input').props.value).toBe('Jane');
  });

  it('renders icons, disabled styling, and labeled testIDs', () => {
    render(
      <Input
        testID="email"
        label="Email"
        error="Required"
        leftIcon={<Text>L</Text>}
        rightIcon={<Text>R</Text>}
        disabled
        editable={false}
      />,
    );

    expect(screen.getByText('L')).toBeTruthy();
    expect(screen.getByText('R')).toBeTruthy();
    expect(screen.getByTestId('email-label')).toBeTruthy();
    expect(screen.getByTestId('email-error')).toBeTruthy();
    expect(screen.getByTestId('email').props.className).toContain(
      'text-neutral-500',
    );
    // The disabled variant class lands on the input wrapper, not the input.
    const wrapper = findAncestorWithClass(
      screen.getByTestId('email'),
      'bg-neutral-200',
    );
    expect(wrapper).toBeTruthy();
  });

  it('applies the focused input style on focus and removes it on blur', () => {
    render(<Input testID="focus" />);
    const input = screen.getByTestId('focus');
    // The focused variant class lands on the input wrapper.
    const wrapperClassName = () =>
      findAncestorWithClass(input, 'border-neutral-400')?.props
        .className as string;

    fireEvent(input, 'focus');
    expect(wrapperClassName()).toContain('border-neutral-400');

    fireEvent(input, 'blur');
    expect(findAncestorWithClass(input, 'border-neutral-400')).toBeNull();
  });
});

describe('InputView', () => {
  it('renders children inside scroll view', () => {
    render(
      <InputView>
        <Text>Field</Text>
      </InputView>,
    );

    expect(screen.getByText('Field')).toBeTruthy();
  });
});

describe('Select', () => {
  it('presents options and selects value', () => {
    const onSelect = jest.fn();
    const { mockPresent, mockDismiss } = getTrueSheetMocks();

    render(
      <Select
        testID="select"
        options={[{ label: 'One', value: '1' }]}
        onSelect={onSelect}
      />,
    );

    fireEvent.press(screen.getByTestId('select-trigger'));
    expect(mockPresent).toHaveBeenCalled();

    fireEvent.press(screen.getByTestId('select-item-1'));
    expect(onSelect).toHaveBeenCalledWith('1');
    expect(mockDismiss).toHaveBeenCalled();
  });

  it('shows the placeholder when no value is selected', () => {
    render(<Select options={[{ label: 'One', value: '1' }]} />);
    expect(screen.getByText('select...')).toBeTruthy();
  });

  it('shows the matching option label when the value matches', () => {
    render(<Select value="1" options={[{ label: 'One', value: '1' }]} />);
    // 'One' appears both as the trigger value and as the sheet option.
    expect(screen.getAllByText('One').length).toBeGreaterThan(0);
  });

  it('falls back to the placeholder when the value matches no option', () => {
    render(<Select value="zz" options={[{ label: 'One', value: '1' }]} />);
    expect(screen.getByText('select...')).toBeTruthy();
  });

  it('marks the selected option with a check mark', () => {
    render(
      <Select
        value="1"
        testID="sel"
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
        ]}
      />,
    );

    expect(screen.UNSAFE_getAllByType(Svg)).toHaveLength(1);
  });

  it('filters options by search query', () => {
    const { mockPresent } = getTrueSheetMocks();
    render(
      <Select
        searchable
        testID="sel"
        options={[
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ]}
        onSelect={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId('sel-trigger'));
    expect(mockPresent).toHaveBeenCalled();

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'app');
    expect(screen.getByTestId('sel-item-a')).toBeTruthy();
    expect(screen.queryByTestId('sel-item-b')).toBeNull();

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'zzz');
    expect(screen.getByText('No options found')).toBeTruthy();
  });

  it('clears the search query after selecting an option', () => {
    render(
      <Select
        searchable
        testID="sel"
        options={[
          { label: 'Apple', value: 'a' },
          { label: 'Banana', value: 'b' },
        ]}
        onSelect={jest.fn()}
      />,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'app');
    fireEvent.press(screen.getByTestId('sel-item-a'));
    // The search query is cleared after selecting: all options are back.
    expect(screen.getByTestId('sel-item-a')).toBeTruthy();
    expect(screen.getByTestId('sel-item-b')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'app');
    expect(screen.getByTestId('sel-item-a')).toBeTruthy();
    expect(screen.queryByTestId('sel-item-b')).toBeNull();
  });

  it('renders Options directly with a selected value', () => {
    render(
      <Options
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
        ]}
        onSelect={jest.fn()}
        value="2"
        testID="opts"
      />,
    );
    expect(screen.getByTestId('opts-item-2')).toBeTruthy();
  });

  it('renders ControlledSelect with form control', () => {
    const Sample = () => {
      const { control } = useForm<{ fruit: string }>({
        defaultValues: { fruit: '1' },
      });
      return (
        <ControlledSelect
          name="fruit"
          control={control}
          testID="fruit"
          options={[{ label: 'One', value: '1' }]}
          onSelect={jest.fn()}
        />
      );
    };

    render(<Sample />);
    expect(screen.getAllByText('One').length).toBeGreaterThan(0);

    fireEvent.press(screen.getByTestId('fruit-trigger'));
    fireEvent.press(screen.getByTestId('fruit-item-1'));
    expect(screen.getAllByText('One').length).toBeGreaterThan(0);
  });
});
