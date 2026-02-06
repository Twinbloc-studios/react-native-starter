import React, { type PropsWithChildren } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { withUniwind } from "uniwind";

import { Container } from "./container";

const NativeScrollView = withUniwind(ScrollView);

interface InputViewProps extends PropsWithChildren<ScrollViewProps> {
  contentContainerClassName?: string;
}

export function InputView(props: InputViewProps) {
  return (
    <Container.Box className="dark:bg-transparent">
      <AvoidSoftInputView>
        <NativeScrollView
          contentContainerClassName={props.contentContainerClassName}
          showsVerticalScrollIndicator={false}
        >
          {props.children}
        </NativeScrollView>
      </AvoidSoftInputView>
    </Container.Box>
  );
}

InputView.displayName = "InputView";
