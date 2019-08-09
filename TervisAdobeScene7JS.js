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
} from '@tervis/tervisutility'

export function New_TervisAdobeScene7URL ({
    $Type,
    $RelativeURL,
    $AsScene7SrcValue,
    $ExternalURL
}) {
    return New_AdobeScene7URL({
        $Type,
        $RelativeURL,
        $AsScene7SrcValue,
        $ExternalURL,
        $Host: "images.tervis.com"
    })
}

export async function New_TervisAdobeScene7ArcedImageURL ({
    $Size,
    $FormType,
    $DecalSourceValue,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    let $GetTemplateNameParameters = ({$Size, $FormType})

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
    $Size,
    $FormType,
    $VignetteType,
    $VignetteName
}) {
    var $VignetteTypeToSuffixMap = {
        "Hero": "1-HERO2",
        "Stock": "1"
    }
    
    if ($VignetteType) {
        var $VignetteName = `${$Size}${$FormType}${$VignetteTypeToSuffixMap[$VignetteType]}`
    }
    
    return `https://images.tervis.com/ir/render/tervisRender/${$VignetteName}?req=contents`
}

export function New_TervisAdobeScene7PrintSingleURL ({
    $Size,
    $FormType,
    $DecorationType,
    $AsScene7SrcValue,
    $ImageSrcValue
}) {
    var $RelativeURL = `
        tervisRender/${$Size}${$FormType}-${$DecorationType}-PRINT-SINGLE?
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
    $Size,
    $FormType,
    $AsScene7SrcValue,
    $DecorationType,
    $RepeatedImageSource
}) {
    var $RelativeURL = `
        tervis/${$Size}${$FormType}-${$DecorationType}-DECO3?
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
    $Size,
    $FormType,
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

    var $WidthAndHeightStanza = New_AdobeScene7URLWidthAndHeightStanza({$Width, $Height})

    var $RelativeURL = `
        tervisRender/${$Size}${$FormType}${$VignetteSuffix}?
        ${$ShowObjectsURLFragment ? $ShowObjectsURLFragment : ""}
        ${$DecorationStanza ? $DecorationStanza : ""}
        ${$WidthAndHeightStanza ? $WidthAndHeightStanza : ""}
        &obj=MAIN
        &req=object
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageRender", $RelativeURL, $AsScene7SrcValue})
}

export async function New_TervisAdobeScene7DecorationProofImageURL ({
    $DecorationImageURLAsSourceValue,
    $ArcedDecoration,
    $Size,
    $FormType,
    $IncludeDiecutterCalibrationLine,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $ProofBackgroundImageURLAsSourceValue

    $ProofBackgroundImageURLAsSourceValue = await New_TervisAdobeScene7DecorationProofBackgroundImageURL({
        $Size,
        $FormType,
        $ArcedDecoration,
        $Width,
        $Height,
        $AsScene7SrcValue: true
    })

    var $DiecutterCalibrationLineStanza
    if ($IncludeDiecutterCalibrationLine) {
        var $SizeStanza = New_AdobeScene7SizeStanza({$Width, $Height})
        var $DiecutterCalibrationCheckLineImageURL = await New_TervisAdobeScene7DiecutterCalibrationCheckLineImageURL({$Size, $FormType, $AsScene7SrcValue: true})
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
    $Size,
    $FormType,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_TervisProductMetaDataUsingIndex({$Size, $FormType})
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
            $Size,
            $FormType,
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
    $Size,
    $FormType,
    $AsScene7SrcValue
}) {
    return New_TervisAdobeScene7URL({
        $Type: "ImageServer",
        $RelativeURL: `tervisRender/${await Get_TervisProductImageTemplateName({ $Size, $FormType, $TemplateType: "DiecutterCalibrationCheckLine"})}`,
        $AsScene7SrcValue
    })
}

export async function New_TervisAdobeScene7VirtualImageURL ({
    $Size,
    $FormType,
    $DecorationProofImageURLAsSourceValue,
    $ProductVignetteImageURLAsSourceValue,
    $ProductVignetteDecorationPositionXValue,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_TervisProductMetaDataUsingIndex({$Size, $FormType})
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

export async function Get_TervisAdobeScene7VignettePositions ({
    $Size,
    $FormType,
    $NumberOfPositions
}) {
    var {
        VignettePositionStepAmountToRotateBy90Degrees: $VignettePositionStepAmountToRotateBy90Degrees
    } = await Get_TervisProductMetaDataUsingIndex({ $Size, $FormType })

    var $DenominatorOfTheRatioOfTheStepAmountToTheUnAdjustedMaxStepAmount = 4
    var $UnAdjustedMaxStepAmountValue = $VignettePositionStepAmountToRotateBy90Degrees * $DenominatorOfTheRatioOfTheStepAmountToTheUnAdjustedMaxStepAmount 

    var $Increment = $UnAdjustedMaxStepAmountValue / $NumberOfPositions
    
    var $ArrayOfStepsMultipliers = [...Array($NumberOfPositions).keys()]     
    var $ArrayOfSteps = $ArrayOfStepsMultipliers.map( $StepMultiplier => $StepMultiplier * $Increment) 
    
    var $StepAdjustmentAmount = $ArrayOfSteps[($NumberOfPositions / 2)]
    var $ArrayOfAdjustedSteps = $ArrayOfSteps.map( $Step => $Step - $StepAdjustmentAmount )

    $ArrayOfAdjustedSteps.reverse()
    $ArrayOfAdjustedSteps = Invoke_ArrayRotate({$Array: $ArrayOfAdjustedSteps, $NumberOfPositionsToRotate: $NumberOfPositions/2})
    return $ArrayOfAdjustedSteps
}