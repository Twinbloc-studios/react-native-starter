import React, { type PropsWithChildren } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { Container } from "./container";

interface InputViewProps extends PropsWithChildren<ScrollViewProps> {
  contentContainerClassName?: string;
}

export function InputView(props: InputViewProps) {
  return (
    <Container.Box className="dark:bg-transparent">
      <AvoidSoftInputView>
        <ScrollView contentContainerClassName={props.contentContainerClassName} showsVerticalScrollIndicator={false}>
          {props.children}
        </ScrollView>
      </AvoidSoftInputView>
    </Container.Box>
  );
}

InputView.displayName = "InputView";
