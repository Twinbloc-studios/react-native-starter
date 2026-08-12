import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { View } from '../view';

type JsonNode = {
  type?: string | unknown;
  props?: Record<string, unknown>;
  children?: JsonNode[] | null;
};

const findNode = (
  json: JsonNode | JsonNode[] | null,
  predicate: (props: Record<string, unknown>) => boolean,
): JsonNode | null => {
  if (!json) return null;
  const nodes = Array.isArray(json) ? json : [json];
  for (const node of nodes) {
    if (node?.props && predicate(node.props)) return node;
    const found = findNode(node?.children as JsonNode[] | null, predicate);
    if (found) return found;
  }
  return null;
};

const animationName = (animation: unknown) =>
  (animation as { name?: string } | null)?.name;

const applied = (animation: unknown) =>
  (animation as { applied?: Record<string, unknown> } | null)?.applied;

describe('View', () => {
  it('renders children as a plain view by default', () => {
    render(
      <View testID="plain">
        <Text>Hello</Text>
      </View>,
    );
    expect(screen.getByTestId('plain')).toBeTruthy();
  });

  it('renders an animated view with the fade preset when animatePresence is on', () => {
    render(
      <View testID="anim" animatePresence motionPreset="fade">
        <Text>Content</Text>
      </View>,
    );

    const node = findNode(
      screen.toJSON() as JsonNode | null,
      (props) => props.testID === 'anim',
    );
    expect(node).toBeTruthy();
    expect(animationName(node!.props!.entering)).toBe('FadeIn');
    expect(animationName(node!.props!.exiting)).toBe('FadeOut');
  });

  it('lets motionProps override the preset animations', () => {
    render(
      <View
        testID="anim"
        animatePresence
        motionPreset="fadeUp"
        motionProps={{ entering: FadeInDown }}
      >
        <Text>X</Text>
      </View>,
    );

    const node = findNode(
      screen.toJSON() as JsonNode | null,
      (props) => props.testID === 'anim',
    );
    expect(node!.props!.entering).toBe(FadeInDown);
    expect(animationName(node!.props!.exiting)).toBe('FadeOutUp');
  });

  it('applies the scale and fadeDown presets', () => {
    render(
      <>
        <View testID="scale" animatePresence motionPreset="scale" />
        <View testID="fade-down" animatePresence motionPreset="fadeDown" />
      </>,
    );

    const json = screen.toJSON() as JsonNode | null;
    const scale = findNode(json, (props) => props.testID === 'scale');
    const fadeDown = findNode(json, (props) => props.testID === 'fade-down');
    expect(animationName(scale!.props!.entering)).toBe('ZoomIn');
    expect(animationName(scale!.props!.exiting)).toBe('ZoomOut');
    expect(animationName(fadeDown!.props!.entering)).toBe('FadeInDown');
    expect(animationName(fadeDown!.props!.exiting)).toBe('FadeOutDown');
  });

  it('renders nothing when animatePresence is on and not visible', () => {
    render(
      <View animatePresence isVisible={false}>
        <Text>Hidden</Text>
      </View>,
    );
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('animates layout changes with the linear layout preset', () => {
    render(
      <View testID="layout" layoutPreset="linear">
        <Text>Moves</Text>
      </View>,
    );

    const node = findNode(
      screen.toJSON() as JsonNode | null,
      (props) => props.testID === 'layout',
    );
    expect(animationName(node!.props!.layout)).toBe('LinearTransition');
    expect(applied(node!.props!.layout)).toMatchObject({ duration: 250 });
    // No presence animations without animatePresence.
    expect(node!.props!.entering).toBeUndefined();
    expect(screen.getByText('Moves')).toBeTruthy();
  });

  it('applies the spring layout preset', () => {
    render(<View testID="layout" layoutPreset="spring" />);

    const node = findNode(
      screen.toJSON() as JsonNode | null,
      (props) => props.testID === 'layout',
    );
    expect(animationName(node!.props!.layout)).toBe('LinearTransition');
    expect(applied(node!.props!.layout)).toMatchObject({
      springify: undefined,
      stiffness: 200,
      damping: 20,
    });
  });

  it('lets motionProps.layout override the layout preset', () => {
    render(
      <View
        testID="layout"
        layoutPreset="linear"
        motionProps={{ layout: LinearTransition }}
      />,
    );

    const node = findNode(
      screen.toJSON() as JsonNode | null,
      (props) => props.testID === 'layout',
    );
    expect(node!.props!.layout).toBe(LinearTransition);
  });

  it('applies the delay to the entering and exiting animations', () => {
    render(
      <View testID="anim" animatePresence motionPreset="fade" delay={300}>
        <Text>Delayed</Text>
      </View>,
    );

    const node = findNode(
      screen.toJSON() as JsonNode | null,
      (props) => props.testID === 'anim',
    );
    expect(animationName(node!.props!.entering)).toBe('FadeIn');
    expect(applied(node!.props!.entering)).toMatchObject({
      duration: 200,
      delay: 300,
    });
    expect(applied(node!.props!.exiting)).toMatchObject({
      duration: 200,
      delay: 300,
    });
  });

  it('applies the delay to the layout animation', () => {
    render(
      <View testID="layout" layoutPreset="linear" delay={120}>
        <Text>Staggered</Text>
      </View>,
    );

    const node = findNode(
      screen.toJSON() as JsonNode | null,
      (props) => props.testID === 'layout',
    );
    expect(applied(node!.props!.layout)).toMatchObject({
      duration: 250,
      delay: 120,
    });
  });
});
