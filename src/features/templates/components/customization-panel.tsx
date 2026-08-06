"use client";

import { ColorPicker } from "@/features/templates/components/color-picker";
import { FontSelector } from "@/features/templates/components/font-selector";
import { LayoutSelector } from "@/features/templates/components/layout-selector";
import { SectionVisibilityControl } from "@/features/templates/components/section-visibility-control";
import { useCustomize } from "@/features/templates/context/customize-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CustomizationPanel({ className }: { className?: string }) {
  const {
    customization,
    update,
    applyPalette,
    setFont,
    setLayout,
    toggleSection,
    moveSection,
  } = useCustomize();

  return (
    <aside className={className}>
      <div className="border-b border-line px-4 py-4">
        <h2 className="font-serif text-lg font-semibold text-ink">Customize</h2>
        <p className="text-sm text-ink-soft">
          Colors, type, layout, and section visibility.
        </p>
      </div>
      <Tabs defaultValue="colors" className="px-3 py-3">
        <TabsList className="mb-3 grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>
        <TabsContent value="colors" className="px-1 pb-8">
          <ColorPicker
            primary={customization.primaryColor}
            accent={customization.accentColor}
            background={customization.backgroundColor}
            text={customization.textColor}
            onChange={(key, value) => {
              if (key === "primary") update({ primaryColor: value });
              if (key === "accent") update({ accentColor: value });
              if (key === "background") update({ backgroundColor: value });
              if (key === "text") update({ textColor: value });
            }}
            onApplyPalette={applyPalette}
          />
        </TabsContent>
        <TabsContent value="type" className="px-1 pb-8">
          <FontSelector
            value={customization.fontFamily}
            fontSize={customization.fontSize}
            headingStyle={customization.headingStyle}
            bodySpacing={customization.bodySpacing}
            onFontChange={setFont}
            onFontSizeChange={(fontSize) => update({ fontSize })}
            onHeadingStyleChange={(headingStyle) => update({ headingStyle })}
            onBodySpacingChange={(bodySpacing) => update({ bodySpacing })}
          />
        </TabsContent>
        <TabsContent value="layout" className="px-1 pb-8">
          <LayoutSelector
            layout={customization.layout}
            sectionSpacing={customization.sectionSpacing}
            margins={customization.margins}
            onLayoutChange={setLayout}
            onSectionSpacingChange={(sectionSpacing) =>
              update({ sectionSpacing })
            }
            onMarginsChange={(margins) => update({ margins })}
          />
        </TabsContent>
        <TabsContent value="sections" className="px-1 pb-8">
          <SectionVisibilityControl
            sections={customization.sections}
            onToggle={toggleSection}
            onMove={moveSection}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
