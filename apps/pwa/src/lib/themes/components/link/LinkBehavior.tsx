import Link, { LinkProps } from "next/link";

export const LinkBehavior = (
  props: Omit<LinkProps, "href"> & {
    href: LinkProps["href"];
    ref?: React.Ref<HTMLAnchorElement>;
  }
) => {
  const { href, ref, ...other } = props;
  return <Link ref={ref} href={href} {...other} />;
};
