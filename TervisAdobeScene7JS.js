import {
    New_AdobeScene7URLWidthAndHeightStanza,
    New_AdobeScene7SizeStanza,
    New_AdobeScene7URL
} from '@tervis/adobescene7js'

import {
    Get_TervisProductImageTemplateName,
    Get_TervisProductMetaDataUsingIndex
} from '@tervis/tervisproductmetadata'

import {
    Invoke_ArrayRotate
} from '@tervis/tervisutilityjs'

export function New_TervisAdobeScene7URL ({
    $Type,
    $RelativeURL,
    $AsScene7SrcValue,
    $ExternalURL,
    $Width,
    $Height,
    $Format,
    $Cache
}) {
    return New_AdobeScene7URL({
        $Host: "images.tervis.com",
        $Type,
        $RelativeURL,
        $AsScene7SrcValue,
        $ExternalURL,
        $Width,
        $Height,
        $Format,
        $Cache
    })
}

export async function New_TervisAdobeScene7ArcedImageURL ({
    $ProductSize,
    $ProductFormType,
    $DecalSourceValue,
    $Width,
    $Height,
    $Cache,
    $AsScene7SrcValue
}) {
    let $GetTemplateNameParameters = ({$ProductSize, $ProductFormType})

    var $RelativeURL = `
        tervisRender/${await Get_TervisProductImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Vignette"})}?
        &obj=group
        &decal
        &src=${$DecalSourceValue}
        &show
        &res=300
        &req=object
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({
        $Type: "ImageRender",
        $RelativeURL,
        $Width,
        $Height,
        $Cache,
        $AsScene7SrcValue
    })
}

export function New_TervisAdobeScene7VignetteContentsURL({
    $ProductSize,
    $ProductFormType,
    $VignetteType,
    $VignetteSuffix,
    $VignetteName
}) {
    var $VignetteTypeToSuffixMap = {
        "Hero": "1-HERO2",
        "Stock": "1"
    }
    
    if ($VignetteType) {
        var $VignetteName = `${$ProductSize}${$ProductFormType}${$VignetteTypeToSuffixMap[$VignetteType]}`
    } else if ($VignetteSuffix) {
        var $VignetteName = `${$ProductSize}${$ProductFormType}${$VignetteSuffix}`
    }
    
    // Using images2 to route through envoy proxy to add CORs headers until we can get scene 7 return the right headers directly
    return `https://images2.tervis.com/ir/render/tervisRender/${$VignetteName}?req=contents`
}

export function New_TervisAdobeScene7PrintSingleURL ({
    $ProductSize,
    $ProductFormType,
    $DecorationType,
    $AsScene7SrcValue,
    $ImageSrcValue
}) {
    var $RelativeURL = `
        tervisRender/${$ProductSize}${$ProductFormType}-${$DecorationType}-PRINT-SINGLE?
        obj=DECO
        &decal
        &src=${$ImageSrcValue}
        &res=300
        &show
        &obj=DECO
        &req=object
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageRender", $RelativeURL, $AsScene7SrcValue})
}

export function New_TervisAdobeScene7WrapDecoration3TimesURL ({
    $ProductSize,
    $ProductFormType,
    $AsScene7SrcValue,
    $DecorationType,
    $RepeatedImageSource
}) {
    var $RelativeURL = `
        tervis/${$ProductSize}${$ProductFormType}-${$DecorationType}-DECO3?
        layer=1
        &src=${$RepeatedImageSource}
        &layer=2
        &src=${$RepeatedImageSource}
        &layer=3
        &src=${$RepeatedImageSource}
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export function New_TervisAdobeScene7ProductEngravingDecorationVignetteImageURL ({
    $ProductSize,
    $ProductFormType,
    $DecorationGroupID,
    $DecorationSrc,
    $DecorationPositionXValue,
    $ElementPathsToShow,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    $RelativeURL = `
        tervis?
        layer=0
        &src=${
            New_TervisAdobeScene7ProductVignetteImageURL({
                $ProductSize,
                $ProductFormType,
                $VignetteSuffix: 1,
                $ElementPathsToShow,
                $DecorationGroupID,
                $Width,
                $Height
            })
        }
        &layer=1
        &src=${
            New_TervisAdobeScene7EngravingDecorationImageURL({
                $ProductSize,
                $ProductFormType,
                $AsScene7SrcValue: true,
                $DecorationSrc,
                $DecorationPositionXValue,
                $Width,
                $Height
            })
        }
    `
    
    return New_TervisAdobeScene7URL({
        $Type: "ImageServer",
        $Width,
        $Height,
        $RelativeURL,
        $AsScene7SrcValue
    })    
}

export function New_TervisAdobeScene7EngravingDecorationImageURL ({
    $ProductSize,
    $ProductFormType,
    $AsScene7SrcValue,
    $DecorationSrc,
    $DecorationPositionXValue,
    $Width,
    $Height
}) {
    $RelativeURL = `
        tervis/ENGRAVE?
        layer=1
        &src=ir(
            tervisRender/${$ProductSize}${$ProductFormType}1?
            &obj=MAIN/OUTER/SMOOTH/SS1
            &show
            &obj=MAIN
            &req=object
            &sharpen=1
        )
        &mask=${
            New_TervisAdobeScene7ProductVignetteImageURL({
                $ProductSize,
                $ProductFormType,
                $VignetteSuffix: 1,
                $DecorationPositionXValue,
                $AsScene7SrcValue: true,
                $DecorationSrc: New_TervisAdobeScene7WrapDecoration3TimesURL({
                    $DecorationType: "LET",
                    $ProductSize,
                    $ProductFormType,
                    $AsScene7SrcValue: true,
                    $RepeatedImageSource: $DecorationSrc
                })
            })
        }
    `
    return New_TervisAdobeScene7URL({
        $Type: "ImageServer",
        $RelativeURL,
        $AsScene7SrcValue,
        $Width,
        $Height
    })    
}

export function New_TervisAdobeScene7ProductVignetteImageURL ({
    $ProductSize,
    $ProductFormType,
    $VignetteSuffix,
    $DecorationGroupID,
    $DecorationSrc,
    $DecorationPositionXValue,
    $ElementPathsToShow,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $ShowObjectsURLFragment = $ElementPathsToShow.map(
        $ElementPath => `&obj=${$ElementPath}&show`
    )
    .join('')
 
    var $DecorationStanza
    if ($DecorationSrc) {
        $DecorationStanza = `
            &obj=MAIN/DECO
            &decal
            &src=${$DecorationSrc}
            &pos=${$DecorationPositionXValue},0
            &show
        `.replace(/\s/g, "")
    }

    var $RelativeURL = `
        tervisRender/${$ProductSize}${$ProductFormType}${$VignetteSuffix}?
        ${$ShowObjectsURLFragment ? $ShowObjectsURLFragment : ""}
        ${$DecorationStanza ? $DecorationStanza : ""}
        &obj=MAIN
        &req=object
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageRender", $RelativeURL, $Width, $Height, $AsScene7SrcValue})
}

export async function New_TervisAdobeScene7DecorationProofImageURL ({
    $DecorationImageURLAsSourceValue,
    $ArcedDecoration,
    $ProductSize,
    $ProductFormType,
    $IncludeDiecutterCalibrationLine,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $ProofBackgroundImageURLAsSourceValue

    $ProofBackgroundImageURLAsSourceValue = await New_TervisAdobeScene7DecorationProofBackgroundImageURL({
        $ProductSize,
        $ProductFormType,
        $ArcedDecoration,
        $Width,
        $Height,
        $AsScene7SrcValue: true
    })

    var $DiecutterCalibrationLineStanza
    if ($IncludeDiecutterCalibrationLine) {
        var $SizeStanza = New_AdobeScene7SizeStanza({$Width, $Height})
        var $DiecutterCalibrationCheckLineImageURL = await New_TervisAdobeScene7DiecutterCalibrationCheckLineImageURL({$ProductSize, $ProductFormType, $AsScene7SrcValue: true})
        $DiecutterCalibrationLineStanza = `
            &layer=3
            &src=${$DiecutterCalibrationCheckLineImageURL}
            ${$SizeStanza ? $SizeStanza : ""}
        `
    }
    
    var $RelativeURL = `
        tervisRender?
        &layer=0
        &src=${$ProofBackgroundImageURLAsSourceValue}
        &layer=1
        &src=${$DecorationImageURLAsSourceValue}
        ${$DiecutterCalibrationLineStanza ? $DiecutterCalibrationLineStanza : ""}
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export async function New_TervisAdobeScene7DecorationProofBackgroundImageURL ({
    $ArcedDecoration,
    $ProductSize,
    $ProductFormType,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    var $ArtBoardDimensions = $SizeAndFormTypeMetaData.ArtBoardDimensions
    var $BackgroundColorHex = "e6e7e8"
    var $SizeStanza = New_AdobeScene7SizeStanza({
        $Width: $Width && !$ArcedDecoration ? $Width : $ArtBoardDimensions.Width,
        $Height: $Height && !$ArcedDecoration ? $Height : $ArtBoardDimensions.Height
    })

    var $RelativeURL = `
        tervis?
        layer=0
        &bgColor=${$BackgroundColorHex}
        ${$SizeStanza ? $SizeStanza : ""}
    `.replace(/\s/g, "")

    if ($ArcedDecoration) {
        var $RelativeURLAsSrcValue = New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue: true})
        var $DecorationProofBackgroundArced = await New_TervisAdobeScene7ArcedImageURL({
            $ProductSize,
            $ProductFormType,
            $AsScene7SrcValue,
            $Width,
            $Height,
            $DecalSourceValue: $RelativeURLAsSrcValue
        })

        return $DecorationProofBackgroundArced
    } else {
        return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
    }
}

export async function New_TervisAdobeScene7VignetteCalibrationImageURL ({
    $ArcedDecoration,
    $ProductSize,
    $ProductFormType,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    var $ArtBoardDimensions = $SizeAndFormTypeMetaData.ArtBoardDimensions

    var $SizeStanza = New_AdobeScene7SizeStanza({
        $Width: $ArtBoardDimensions.Width,
        $Height: $ArtBoardDimensions.Height
    })

    var $BlackBarSizeStanza = New_AdobeScene7SizeStanza({
        $Width: 20,
        $Height: $ArtBoardDimensions.Height
    })
    var $BlackBarOffsetFromCenter = $ArtBoardDimensions.Width / 2

    var $RelativeURL = `
        tervis?
        layer=0
        ${$SizeStanza ? $SizeStanza : ""}
        &layer=1
        &bgcolor=000000
        ${$BlackBarSizeStanza ? $BlackBarSizeStanza : ""}
        &pos=${$BlackBarOffsetFromCenter}
        &layer=2
        &bgcolor=000000
        ${$BlackBarSizeStanza ? $BlackBarSizeStanza : ""}
        &pos=-${$BlackBarOffsetFromCenter}
    `.replace(/\s/g, "")

    if ($ArcedDecoration) {
        var $RelativeURLAsSrcValue = New_TervisAdobeScene7URL({
            $Type: "ImageServer",
            $RelativeURL,
            $AsScene7SrcValue: true
        })

        var $DecorationProofBackgroundArced = await New_TervisAdobeScene7ArcedImageURL({
            $ProductSize,
            $ProductFormType,
            $AsScene7SrcValue,
            $DecalSourceValue: $RelativeURLAsSrcValue
        })

        return $DecorationProofBackgroundArced
    } else {
        return New_TervisAdobeScene7URL({
            $Type: "ImageServer",
            $RelativeURL,
            $AsScene7SrcValue
        })
    }
}

export async function New_TervisAdobeScene7DiecutterCalibrationCheckLineImageURL ({
    $ProductSize,
    $ProductFormType,
    $AsScene7SrcValue
}) {
    return New_TervisAdobeScene7URL({
        $Type: "ImageServer",
        $RelativeURL: `tervisRender/${await Get_TervisProductImageTemplateName({ $ProductSize, $ProductFormType, $TemplateType: "DiecutterCalibrationCheckLine"})}`,
        $AsScene7SrcValue
    })
}

export async function New_TervisAdobeScene7VirtualImageURL ({
    $ProductSize,
    $ProductFormType,
    $DecorationProofImageURLAsSourceValue,
    $ProductVignetteImageURLAsSourceValue,
    $ProductVignetteDecorationPositionXValue,
    $VirtualImageIdentifier,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    var $ProofBackgroundWidth = 1650
    var $ProofBackgroundHeight = 1275

    var $DecorationProofCenterPointYRelativeToVirtualBackground = $SizeAndFormTypeMetaData.DecorationProofCenterPointYRelativeToVirtualBackground
    var $DecorationProofCenterPointXRelativeToVirtualBackground = $SizeAndFormTypeMetaData.DecorationProofCenterPointXRelativeToVirtualBackground ?
        $SizeAndFormTypeMetaData.DecorationProofCenterPointXRelativeToVirtualBackground :
        600

    var $DecorationProofPositionX = $DecorationProofCenterPointXRelativeToVirtualBackground - ($ProofBackgroundWidth/2)
    var $DecorationProofPositionY = $DecorationProofCenterPointYRelativeToVirtualBackground - ($ProofBackgroundHeight/2)

    var $ProductVignetteImageCenterPointX = 1349
    var $ProductVignetteImageCenterPointY = 637
    var $ProductVignetteImagePositionX = $ProductVignetteImageCenterPointX - ($ProofBackgroundWidth/2)
    var $ProductVignetteImagePositionY = $ProductVignetteImageCenterPointY - ($ProofBackgroundHeight/2)

    if ($ProductVignetteDecorationPositionXValue) {
        $ProductVignetteImageURLAsSourceValue = $ProductVignetteImageURLAsSourceValue.replace(
            /(?<=&pos=)-?\d+(?=,0)/,
            $ProductVignetteDecorationPositionXValue
        )
    }

    if ($VirtualImageIdentifier) {
        var $VirtualImageIdentifierStanza = `
            &layer=30,VirtualImageIdentifier
            &text={\\colortbl;\\red220\\green220\\blue220}%20\\cf1%20\\fs20%20${encodeURIComponent($VirtualImageIdentifier)}
            &anchor=800,-610
        `
    }

    var $RelativeURL = `
        tervisRender/VIRTUALS_ALL_Background?
        layer=1
        &src=${$DecorationProofImageURLAsSourceValue}
        &pos=${$DecorationProofPositionX},${$DecorationProofPositionY}
        &layer=2
        &src=${$ProductVignetteImageURLAsSourceValue}
        &pos=${$ProductVignetteImagePositionX},${$ProductVignetteImagePositionY}
        ${$VirtualImageIdentifierStanza ? $VirtualImageIdentifierStanza : ""}
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export async function ConvertTo_TervisAdobeScene7VignettePosition ({
    $ProductSize,
    $ProductFormType,
    $Degrees
}) {
    var {
        VignettePositionStepAmountToRotateBy90Degrees: $VignettePositionStepAmountToRotateBy90Degrees
    } = await Get_TervisProductMetaDataUsingIndex({ $ProductSize, $ProductFormType })

    var $VignettePositionStepAmountToRotateBy1Degrees = $VignettePositionStepAmountToRotateBy90Degrees / 90
    return $Degrees * $VignettePositionStepAmountToRotateBy1Degrees
}

export async function Get_TervisAdobeScene7VignettePosition ({
    $ProductSize,
    $ProductFormType,
    $NumberOfPositions,
    $StartPosition
}) {
    var {
        VignettePositionStepAmountToRotateBy90Degrees: $VignettePositionStepAmountToRotateBy90Degrees
    } = await Get_TervisProductMetaDataUsingIndex({ $ProductSize, $ProductFormType })

    var $DenominatorOfTheRatioOfTheStepAmountToTheUnAdjustedMaxStepAmount = 4
    var $UnAdjustedMaxStepAmountValue = $VignettePositionStepAmountToRotateBy90Degrees * $DenominatorOfTheRatioOfTheStepAmountToTheUnAdjustedMaxStepAmount 

    var $Increment = $UnAdjustedMaxStepAmountValue / $NumberOfPositions
    
    var $ArrayOfStepsMultipliers = [...Array($NumberOfPositions).keys()]     
    var $ArrayOfSteps = $ArrayOfStepsMultipliers.map( $StepMultiplier => $StepMultiplier * $Increment) 
    
    var $StepAdjustmentAmount = $ArrayOfSteps[($NumberOfPositions / 2)]
    var $ArrayOfAdjustedSteps = $ArrayOfSteps.map( $Step => $Step - $StepAdjustmentAmount )

    $ArrayOfAdjustedSteps.reverse()
    $ArrayOfAdjustedSteps = Invoke_ArrayRotate({
        $Array: $ArrayOfAdjustedSteps,
        $NumberOfPositionsToRotate: ($NumberOfPositions/2 - 1)
    })

    if ($StartPosition) {
        $ArrayOfAdjustedSteps = Invoke_ArrayRotate({
            $Array: $ArrayOfAdjustedSteps,
            $NumberOfPositionsToRotate: $ArrayOfAdjustedSteps.indexOf($StartPosition)
        })
    }
    return $ArrayOfAdjustedSteps
}

export async function Get_TervisAdobeScene7Silhouette ({
    $ProductSize,
    $ProductFormType,
    $AsScene7SrcValue
}) {
    var $ProductMetaData = await Get_TervisProductMetaDataUsingIndex({ $ProductSize, $ProductFormType })
    var $Silhouette = $ProductMetaData.ImageTemplateName.Silhouette
    var $RelativeURL = `tervis/${$Silhouette}`
    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export function Get_TervisAdobeScene7SwatchImageURL ({
    $ColorCode,
    $AsScene7SrcValue
}) {
    var $RelativeURL = `tervis/${$ColorCode}?$SWATCH$`
    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export async function Get_TervisAdobeScene7VignetteContentsXML ({
    $ProductSize,
    $ProductFormType,
    $VignetteType,
    $VignetteSuffix,
    $VignetteName
}) {
    var $VignetteContentsURL = New_TervisAdobeScene7VignetteContentsURL({ $ProductSize, $ProductFormType, $VignetteType, $VignetteSuffix, $VignetteName })
    const $IsBrowser = !(typeof window === 'undefined');

    if (!$IsBrowser) {
        var fetch = (await import("node-fetch")).default
    } else {
        var fetch = window.fetch
    }

    var $VignetteContentsXML = await fetch(
        $VignetteContentsURL
    )
    .then($Response => $Response.text())
    .then($String => (new window.DOMParser()).parseFromString($String, "text/xml"))

    return $VignetteContentsXML
}

export async function Get_TervisAdobeScene7VignetteObjectWithColorOption ({
    $ProductSize,
    $ProductFormType,
    $VignetteType,
    $VignetteSuffix,
    $VignetteName
}) {
    var $VignetteContentsXML = await Get_TervisAdobeScene7VignetteContentsXML({
        $ProductSize,
        $ProductFormType,
        $VignetteType,
        $VignetteSuffix,
        $VignetteName
    })

    var $IDsOfVignetteObjectWithColorOption = [ "ACCESSORIES", "INNER", "OUTER"]
    var $VignetteObjectWithColorOptionSelector = $IDsOfVignetteObjectWithColorOption.map(
        $ID => `vignette contents #MAIN #${$ID}`
    )
    .join()

    var $NodeList = $VignetteContentsXML.querySelectorAll($VignetteObjectWithColorOptionSelector)

    return [...$NodeList].map(
        $Node => {
            return {
                Code: $Node.id,
                Options: [...$Node.children].map(
                    $ChildNode => {
                        return {
                            Code: $ChildNode.id,
                            AvailableColorCodes: [...$ChildNode.children].map(
                                $ColorCodeNode => $ColorCodeNode.id
                            )
                        }
                    }
                )
            }
        }
    )
}

export function New_TervisAdobeScene7WhiteInkImageURL ({
    $ProductSize,
    $ProductFormType,
    $ColorInkImageURLAsSrcValue,
    $AsScene7SrcValue
}) {
    var $RelativeURL = `
        tervis?
        &src=${$ColorInkImageURLAsSrcValue}
        &.color=000000
        &op_invert=1
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({
        $Type: "ImageServer",
        $RelativeURL,
        $ProductSize,
        $ProductFormType,
        $AsScene7SrcValue,
        $Format: "png,gray"
    })
}