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
    $Height
}) {
    return New_AdobeScene7URL({
        $Type,
        $RelativeURL,
        $AsScene7SrcValue,
        $ExternalURL,
        $Width,
        $Height,
        $Host: "images.tervis.com"
    })
}

export async function New_TervisAdobeScene7ArcedImageURL ({
    $ProductSize,
    $ProductFormType,
    $DecalSourceValue,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    let $GetTemplateNameParameters = ({$ProductSize, $ProductFormType})

    var $WidthAndHeightStanza = New_AdobeScene7URLWidthAndHeightStanza({$Width, $Height})
    
    var $RelativeURL = `
        tervisRender/${await Get_TervisProductImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Vignette"})}?
        &obj=group
        &decal
        &src=${$DecalSourceValue}
        &show
        &res=300
        &req=object
        ${$WidthAndHeightStanza ? $WidthAndHeightStanza : ""}
    `.replace(/\s/g, "")
    return New_TervisAdobeScene7URL({$Type: "ImageRender", $RelativeURL, $AsScene7SrcValue})
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

export function New_TervisAdobeScene7ProductVignetteImageURL ({
    $ProductSize,
    $ProductFormType,
    $VignetteSuffix,
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

    var $RelativeURL = `
        tervisRender/VIRTUALS_ALL_Background?
        layer=1
        &src=${$DecorationProofImageURLAsSourceValue}
        &pos=${$DecorationProofPositionX},${$DecorationProofPositionY}
        &layer=2
        &src=${$ProductVignetteImageURLAsSourceValue}
        &pos=${$ProductVignetteImagePositionX},${$ProductVignetteImagePositionY}
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

export async function Get_TervisAdobeScene7VignettePositions ({
    $ProductSize,
    $ProductFormType,
    $NumberOfPositions
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
    $ArrayOfAdjustedSteps = Invoke_ArrayRotate({$Array: $ArrayOfAdjustedSteps, $NumberOfPositionsToRotate: ($NumberOfPositions/2 - 1)})
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