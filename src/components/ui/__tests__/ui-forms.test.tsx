import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable } from "react-native";
import { useForm } from "react-hook-form";

import { Accordion } from "../accordion";
import { BottomSheet, useBottomSheet } from "../bottom-sheet";
import { Input, ControlledInput } from "../input";
import { InputView } from "../input-view";
import { Select } from "../select";
import { Text } from "../text";

const getTrueSheetMocks = () => {
  const module = jest.requireMock("@lodev09/react-native-true-sheet") as { __mocks: { mockPresent: jest.Mock; mockDismiss: jest.Mock } };
  return module.__mocks;
};

describe("Accordion", () => {
  it("calls onChange when a section is toggled", () => {
    const onChange = jest.fn();
    const sections = [{ title: "A", content: "A content" }];
    render(
      <Accordion
        sections={sections}
        activeSections={[]}
        onChange={onChange}
        renderHeader={(section) => <Text>{section.title}</Text>}
        renderContent={(section) => <Text>{section.content}</Text>}
      />,
    );

    fireEvent.press(screen.getByLabelText("Accordion section 1"));
    expect(onChange).toHaveBeenCalledWith([0]);
  });
});

describe("BottomSheet and useBottomSheet", () => {
  it("renders title and dismisses from close button", () => {
    const { mockDismiss } = getTrueSheetMocks();
    render(
      <BottomSheet title="Actions">
        <Text>Body</Text>
      </BottomSheet>,
    );

    fireEvent.press(screen.getByLabelText("close BottomSheet"));
    expect(mockDismiss).toHaveBeenCalled();
  });

  it("presents from hook", () => {
    const { mockPresent } = getTrueSheetMocks();

    const Sample = () => {
      const sheet = useBottomSheet();
      return (
        <>
          <Pressable onPress={sheet.present} testID="present" />
          <BottomSheet ref={sheet.ref}>
            <Text>Sheet</Text>
          </BottomSheet>
        </>
      );
    };

    render(<Sample />);
    fireEvent.press(screen.getByTestId("present"));
    expect(mockPresent).toHaveBeenCalled();
  });
});

describe("Input", () => {
  it("renders label and error", () => {
    render(<Input label="Email" testID="email" error="Required" />);
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Required")).toBeTruthy();
  });

  it("renders ControlledInput with form control", () => {
    const Sample = () => {
      const { control } = useForm<{ name: string }>({ defaultValues: { name: "" } });
      return <ControlledInput name="name" control={control} testID="name-input" label="Name" />;
    };

    render(<Sample />);
    fireEvent.changeText(screen.getByTestId("name-input"), "Jane");
    expect(screen.getByTestId("name-input").props.value).toBe("Jane");
  });
});

describe("InputView", () => {
  it("renders children inside scroll view", () => {
    render(
      <InputView>
        <Text>Field</Text>
      </InputView>,
    );

    expect(screen.getByText("Field")).toBeTruthy();
  });
});

describe("Select", () => {
  it("presents options and selects value", () => {
    const onSelect = jest.fn();
    const { mockPresent, mockDismiss } = getTrueSheetMocks();

    render(<Select testID="select" options={[{ label: "One", value: "1" }]} onSelect={onSelect} />);

    fireEvent.press(screen.getByTestId("select-trigger"));
    expect(mockPresent).toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("select-item-1"));
    expect(onSelect).toHaveBeenCalledWith("1");
    expect(mockDismiss).toHaveBeenCalled();
  });
});
