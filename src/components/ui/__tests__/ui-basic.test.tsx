import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { Button } from "../button";
import { Avatar } from "../avatar";
import { Checkbox } from "../check-box";
import { Container } from "../container";
import { Icon } from "../icon";
import { Image, preloadImages } from "../image";
import { Radio } from "../radio";
import { SafeFastImage } from "../safe-fast-image";
import { Stack, HStack, VStack, Center, Circle } from "../stacks";
import { Switch } from "../switch";
import { Text } from "../text";
import { Root as ToggleRoot, Label as ToggleLabel } from "../toggle-shared";

import { Image as ExpoImage } from "expo-image";

describe("Button", () => {
  it("renders label and handles loading state", () => {
    const { getByTestId, queryByTestId, rerender } = render(<Button label="Save" testID="button" />);

    expect(screen.getByText("Save")).toBeTruthy();
    expect(queryByTestId("button-activity-indicator")).toBeNull();

    rerender(<Button label="Save" testID="button" loading />);
    expect(getByTestId("button-activity-indicator")).toBeTruthy();
    expect(queryByTestId("button-label")).toBeNull();
  });
});

describe("Toggle shared", () => {
  it("toggles Root on press", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <ToggleRoot checked={false} onChange={onChange} accessibilityLabel="toggle-root">
        <Text>Item</Text>
      </ToggleRoot>,
    );

    fireEvent.press(getByLabelText("toggle-root"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders Label text", () => {
    const { getByText } = render(<ToggleLabel text="Label" testID="toggle-label" />);
    expect(getByText("Label")).toBeTruthy();
  });
});

describe("Checkbox", () => {
  it("renders label and calls onChange", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Checkbox checked={false} onChange={onChange} accessibilityLabel="checkbox" label="Accept" testID="checkbox" />);

    expect(screen.getByText("Accept")).toBeTruthy();
    fireEvent.press(getByTestId("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Radio", () => {
  it("renders label and calls onChange", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Radio checked={false} onChange={onChange} accessibilityLabel="radio" label="Option" testID="radio" />);

    expect(screen.getByText("Option")).toBeTruthy();
    fireEvent.press(getByTestId("radio"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Switch", () => {
  it("renders label and calls onChange", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Switch checked={false} onChange={onChange} accessibilityLabel="switch" label="Enable" testID="switch" />);

    expect(screen.getByText("Enable")).toBeTruthy();
    fireEvent.press(getByTestId("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Container", () => {
  it("renders variants with children", () => {
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

    expect(getByText("Base")).toBeTruthy();
    expect(getByText("Page")).toBeTruthy();
    expect(getByText("Box")).toBeTruthy();
    expect(getByText("Insets")).toBeTruthy();
  });
});

describe("Stacks", () => {
  it("renders all stack components", () => {
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

    expect(getByText("Stack")).toBeTruthy();
    expect(getByText("HStack")).toBeTruthy();
    expect(getByText("VStack")).toBeTruthy();
    expect(getByText("Center")).toBeTruthy();
    expect(getByText("Circle")).toBeTruthy();
  });
});

describe("Text", () => {
  it("renders children text", () => {
    render(<Text>Heading</Text>);
    expect(screen.getByText("Heading")).toBeTruthy();
  });
});

describe("Avatar", () => {
  it("renders fallback initials", () => {
    render(<Avatar label="Jane Doe" testID="avatar" />);
    expect(screen.getByTestId("avatar")).toBeTruthy();
    expect(screen.getByText("JD")).toBeTruthy();
  });
});

describe("Icon and Image", () => {
  it("renders Icon with provided props", () => {
    const icon = require("@/assets/images/icon.png");
    const { getByTestId } = render(<Icon icon={icon} testID="icon" />);
    expect(getByTestId("icon")).toBeTruthy();
  });

  it("renders Image with default placeholder", () => {
    const { getByTestId } = render(<Image testID="image" source={{ uri: "https://example.com/image.png" }} />);
    expect(getByTestId("image").props.placeholder).toBe("L6PZfSi_.AyE_3t7t7R**0o#DgR4");
  });

  it("preloads images", () => {
    preloadImages(["https://example.com/a.png"]);
    expect(ExpoImage.prefetch).toHaveBeenCalledWith(["https://example.com/a.png"]);
  });
});

describe("SafeFastImage", () => {
  it("uses fallback on invalid source", () => {
    const { getByTestId } = render(<SafeFastImage testID="safe" source={{ uri: "" }} />);
    expect(getByTestId("safe").props.transition).toBe(0);
    expect(getByTestId("safe").props.source).toBeDefined();
  });

  it("uses blurhash placeholder and transition", () => {
    const { getByTestId } = render(<SafeFastImage testID="safe" source={{ uri: "https://example.com/img.png" }} blurhash="hash" />);
    expect(getByTestId("safe").props.placeholder).toBe("hash");
    expect(getByTestId("safe").props.transition).toBe(500);
  });
});

describe("Icon with custom view", () => {
  it("renders with style props", () => {
    const icon = require("@/assets/images/icon.png");
    const { getByTestId } = render(<Icon icon={icon} testID="icon-styled" style={{ opacity: 0.5 }} />);
    expect(getByTestId("icon-styled")).toBeTruthy();
  });
});

describe("Image className", () => {
  it("accepts className prop", () => {
    const { getByTestId } = render(<Image testID="image-class" className="rounded-md" source={{ uri: "https://example.com" }} />);
    expect(getByTestId("image-class")).toBeTruthy();
  });
});

describe("Toggle shared label usage", () => {
  it("renders label inside a view", () => {
    render(
      <View>
        <ToggleLabel text="Label Text" testID="label-text" />
      </View>,
    );
    expect(screen.getByText("Label Text")).toBeTruthy();
  });
});
