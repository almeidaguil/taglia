import type { ModelDefinition } from '../types'
import { wordOffset3Color } from './word-offset-3color'
import { wordOffset2Color } from './word-offset-2color'
import { wordHeart2Colors } from './word-heart-2colors'
import { socialHandleOffset3Color } from './social-handle-offset-3color'
import { socialHandleOffset2Color } from './social-handle-offset-2color'
import { socialHandleOffset2ColorQrCode } from './social-handle-offset-2color-qr-code'
import { socialHandleRectangle3Color } from './social-handle-rectangle-3color'
import { socialHandleRectangle2Color } from './social-handle-rectangle-2color'
import { separateLettersOffset3Color } from './separate-letters-offset-3color'
import { separateLettersOffset2Color } from './separate-letters-offset-2color'
import { fullNameKeychain } from './full-name-keychain'
import { rectangleNameKeychain } from './rectangle-name-keychain'
import { textOffsetKeychain2Colors } from './text-offset-keychain-2colors'
import { textOffsetKeychain3Colors } from './text-offset-keychain-3colors'
import { carrotNameKeychain } from './carrot-name-keychain'
import { bunnyNameKeychain } from './bunny-name-keychain'
import { squareNfcKeychain } from './square-nfc-keychain'
import { circleNfcKeychain } from './circle-nfc-keychain'
import { candyMold } from './candy-mold'
import { candyMoldRounded } from './candy-mold-rounded'
import { sizedPenHolder } from './sized-pen-holder'
import { scratchOffCounter } from './scratch-off-counter'
import { textPlacementHelper } from './text-placement-helper'
import { cookieCutterGenerator } from './cookie-cutter-generator'
import { imageBrigadeiroStamp } from './image-brigadeiro-stamp'
import { sunkenImageColoring } from './sunken-image-coloring'
import { sunkenImageColoringOffset } from './sunken-image-coloring-offset'
import { imageTo3dOffset } from './image-to3d-offset'
import { imageTo3dResinBorder } from './image-to3d-resin-border'
import { nameSideBookmark } from './name-side-bookmark'
import { bowlAnything } from './bowl-anything'
import { imagePuzzle } from './image-puzzle'
import { imageMultipart } from './image-multipart'

export const models: ModelDefinition[] = [
  // Signs — 3 colors
  wordOffset3Color,
  socialHandleOffset3Color,
  socialHandleRectangle3Color,
  separateLettersOffset3Color,
  // Signs — 2 colors
  wordOffset2Color,
  wordHeart2Colors,
  socialHandleOffset2Color,
  socialHandleOffset2ColorQrCode,
  socialHandleRectangle2Color,
  separateLettersOffset2Color,
  // Keychains
  textOffsetKeychain3Colors,
  textOffsetKeychain2Colors,
  fullNameKeychain,
  rectangleNameKeychain,
  carrotNameKeychain,
  bunnyNameKeychain,
  squareNfcKeychain,
  circleNfcKeychain,
  // Kitchen & Cutters
  cookieCutterGenerator,
  imageBrigadeiroStamp,
  sunkenImageColoring,
  sunkenImageColoringOffset,
  imageTo3dOffset,
  imageTo3dResinBorder,
  bowlAnything,
  candyMold,
  candyMoldRounded,
  // Tools
  imagePuzzle,
  imageMultipart,
  nameSideBookmark,
  sizedPenHolder,
  scratchOffCounter,
  textPlacementHelper,
]

export function getModel(slug: string): ModelDefinition | undefined {
  return models.find((m) => m.slug === slug)
}

export function getDefaultValues(model: ModelDefinition): Record<string, string | number | boolean> {
  const values: Record<string, string | number | boolean> = {}
  for (const section of model.sections) {
    for (const [name, param] of Object.entries(section.parameters)) {
      values[name] = param.default
    }
  }
  return values
}
