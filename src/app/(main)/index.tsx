import { Container, Text } from '@/components/ui';

export default function Index() {
  return (
    <Container.Insets className="items-center justify-center">
      <Text
        testID="home-title"
        className="text-xl text-neutral-900 dark:text-white"
      >
        Edit /index.tsx to see the changes
      </Text>
    </Container.Insets>
  );
}
