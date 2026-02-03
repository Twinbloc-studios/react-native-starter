import React from "react";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

/**
 * Accordion Component
 *
 * A collapsible component that displays a list of sections.
 *
 * @example
 * ```tsx
 * import { Accordion, Text } from '@/components/ui';
 * import { useState } from 'react';
 * import { View } from 'react-native';
 *
 * const SECTIONS = [
 *   { title: 'Section 1', content: 'Content for section 1' },
 *   { title: 'Section 2', content: 'Content for section 2' },
 * ];
 *
 * export default function AccordionExample() {
 *   const [activeSections, setActiveSections] = useState<number[]>([]);
 *
 *   return (
 *     <Accordion
 *       sections={SECTIONS}
 *       activeSections={activeSections}
 *       onChange={setActiveSections}
 *       renderHeader={(section, index, isActive) => (
 *         <View style={{ padding: 10, backgroundColor: isActive ? '#f0f0f0' : '#fff' }}>
 *           <Text>{section.title}</Text>
 *         </View>
 *       )}
 *       renderContent={(section) => (
 *         <View style={{ padding: 10 }}>
 *           <Text>{section.content}</Text>
 *         </View>
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export interface AccordionProps<T> {
  sections: T[];
  activeSections: number[];
  renderHeader: (section: T, index: number, isActive: boolean) => React.ReactNode;
  renderContent: (section: T, index: number, isActive: boolean) => React.ReactNode;
  onChange: (activeSections: number[]) => void;
  expandMultiple?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  sectionContainerStyle?: StyleProp<ViewStyle>;
  touchableComponent?: React.ComponentType<any>;
  duration?: number;
}

interface AccordionItemProps {
  isExpanded: boolean;
  children: React.ReactNode;
  duration?: number;
}

function AccordionItem({ isExpanded, children, duration = 300 }: AccordionItemProps) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() => {
    return withTiming(isExpanded ? height.value : 0, {
      duration,
    });
  });

  const bodyStyle = useAnimatedStyle(() => {
    return {
      height: derivedHeight.value,
      overflow: "hidden",
    };
  });

  return (
    <Animated.View style={bodyStyle}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        className="absolute top-0 w-full"
      >
        {children}
      </View>
    </Animated.View>
  );
}

export function Accordion<T>({
  sections,
  activeSections,
  renderHeader,
  renderContent,
  onChange,
  expandMultiple = false,
  containerStyle,
  sectionContainerStyle,
  duration = 300,
}: AccordionProps<T>) {
  const toggleSection = (index: number) => {
    let updatedSections = [...activeSections];

    if (updatedSections.includes(index)) {
      updatedSections = updatedSections.filter((i) => i !== index);
    } else {
      if (expandMultiple) {
        updatedSections.push(index);
      } else {
        updatedSections = [index];
      }
    }

    onChange(updatedSections);
  };

  return (
    <View style={containerStyle}>
      {sections.map((section, index) => {
        const isActive = activeSections.includes(index);
        return (
          <View key={index} style={sectionContainerStyle}>
            <Pressable
              onPress={() => toggleSection(index)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isActive }}
              accessibilityLabel={`Accordion section ${index + 1}`}
            >
              {renderHeader(section, index, isActive)}
            </Pressable>
            <AccordionItem isExpanded={isActive} duration={duration}>
              {renderContent(section, index, isActive)}
            </AccordionItem>
          </View>
        );
      })}
    </View>
  );
}
