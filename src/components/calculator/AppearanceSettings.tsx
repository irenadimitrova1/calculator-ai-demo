import { Moon, Palette, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SKINS, type ColorScheme, type SkinId } from '@/lib/calculator-appearance'
import { cn } from '@/lib/utils'

type AppearanceSettingsProps = {
  colorScheme: ColorScheme
  skin: SkinId
  onColorSchemeChange: (colorScheme: ColorScheme) => void
  onSkinChange: (skin: SkinId) => void
}

export function AppearanceSettings({
  colorScheme,
  skin,
  onColorSchemeChange,
  onSkinChange,
}: AppearanceSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button aria-label="Appearance settings" size="icon-sm" type="button" variant="outline">
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <PopoverHeader>
          <PopoverTitle>Appearance</PopoverTitle>
        </PopoverHeader>

        <ToggleGroup
          aria-label="Color scheme"
          className="w-full"
          onValueChange={(value) => {
            if (value === 'light' || value === 'dark') {
              onColorSchemeChange(value)
            }
          }}
          spacing={0}
          type="single"
          value={colorScheme}
          variant="outline"
        >
          <ToggleGroupItem aria-label="Light mode" className="flex-1" value="light">
            <Sun />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Dark mode" className="flex-1" value="dark">
            <Moon />
            Dark
          </ToggleGroupItem>
        </ToggleGroup>

        <div aria-label="Color skins" className="grid grid-cols-2 gap-2" role="group">
          {SKINS.map((skinOption) => {
            const isActive = skin === skinOption.id

            return (
              <button
                key={skinOption.id}
                aria-label={`${skinOption.label} skin`}
                aria-pressed={isActive}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border p-2 text-xs transition-colors',
                  isActive
                    ? 'border-ring bg-accent text-accent-foreground ring-2 ring-ring'
                    : 'border-border hover:bg-muted',
                )}
                onClick={() => onSkinChange(skinOption.id)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="size-6 rounded-full border border-border"
                  style={{ backgroundColor: skinOption.swatchColor }}
                />
                <span>{skinOption.label}</span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
