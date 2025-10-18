// components/AppDrawer.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Fragment } from "react";

const AppDrawer = ({
  title = "Drawer",
  description,
  children,
  footer,
  trigger,
  open,
  onOpenChange,
  direction,
  variant = "default", // 'default' | 'minimal'
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerTrigger asChild>{trigger || <Button>Open</Button>}</DrawerTrigger>

      <DrawerContent>
        {/* Always include DrawerTitle for a11y */}
        {variant === "default" ? (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        ) : (
          <VisuallyHidden>
            <DrawerTitle>{title}</DrawerTitle>
          </VisuallyHidden>
        )}

        <div className={variant === "default" ? "px-4 pb-4" : "p-0"}>
          {children}
        </div>

        {variant === "default" && (
          <DrawerFooter>
            {footer ? (
              footer
            ) : (
              <Fragment>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </Fragment>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AppDrawer;
