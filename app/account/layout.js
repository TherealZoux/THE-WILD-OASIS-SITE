import SideNavigation from "../_components/SideNavigation";

export default function Layout({ children }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12  lg:min-w-[75rem]">
      <SideNavigation />
      <div>{children}</div>
    </div>

  );
}
