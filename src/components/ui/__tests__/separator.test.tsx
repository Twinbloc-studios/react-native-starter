import { render } from '@testing-library/react-native';

import { Separator } from '../separator';

const classNameOf = (element: React.ReactElement) =>
  (
    render(element).toJSON() as unknown as {
      props: { className: string };
    }
  ).props.className;

describe('Separator', () => {
  it('renders a horizontal hairline by default', () => {
    expect(classNameOf(<Separator />)).toBe(
      'h-px w-full bg-neutral-200 dark:bg-neutral-700',
    );
  });

  it('renders a vertical hairline when orientation is vertical', () => {
    expect(classNameOf(<Separator orientation="vertical" />)).toBe(
      'w-px self-stretch bg-neutral-200 dark:bg-neutral-700',
    );
  });

  it('merges an extra className via twMerge, keeping the later bg color', () => {
    expect(classNameOf(<Separator className="bg-primary-600" />)).toBe(
      'h-px w-full dark:bg-neutral-700 bg-primary-600',
    );
  });

  it('passes through other view props', () => {
    const json = render(
      <Separator
        accessibilityLabel="divider"
        accessibilityHint="Separates content"
      />,
    ).toJSON() as { props: Record<string, unknown> };
    expect(json.props.accessibilityLabel).toBe('divider');
  });
});
