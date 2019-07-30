import {
    Get_CustomyzerImageTemplateName,
    Get_SizeAndFormTypeMetaDataUsingIndex,
    New_CustomyzerProjectProductVirtualURL
} from '@tervis/terviscustomyzerjs/TervisCustomyzerJS.js'

export async function New_TervisAdobeScene7ColorInkImageURL ({
    $ProjectID,
    $Size,
    $FormType
}) {
    if ($FormType !== "SS") {
        var $ArtboardImageURLAsSrcValue = New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID, $AsScene7SrcValue: true})
        return New_TervisAdobeScene7ArcedImageURL({$Size, $FormType, $DecalSourceValue: $ArtboardImageURLAsSrcValue})
    } else if ($FormType === "SS") {
        return New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID})
    }
}

export function New_AdobeScene7URLWidthAndHeightStanza ({
    $Width,
    $Height,
}) {
    if ($Width && $Height) {
        return `
            &wid=${$Width}
            &hei=${$Height}
        `.replace(/\s/g, "")
    }
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
        tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Vignette"})}?
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

export async function New_TervisAdobeScene7WhitInkImageURL ({
    $ProjectID,
    $Size,
    $FormType,
    $WhiteInkColorHex = "00A99C",
    $VuMarkID
}) {
    let $GetTemplateNameParameters = ({$Size, $FormType})
    if (!$VuMarkID && $FormType !== "SS") {
        return `
http://images.tervis.com/is/image/tervis?
src=(
    http://images.tervis.com/is/image/tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Mask"})}?
    &layer=1
    &mask=is(
        tervisRender?
        &src=ir(
            tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Vignette"})}?
            &obj=group
            &decal
            &src=is(
                tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Base"})}?
                .BG
                &layer=5
                &anchor=0,0
                &src=is(
                    tervis/prj-${$ProjectID}
                )
            )
            &show
            &res=300
            &req=object
            &fmt=png-alpha
        )
    )
    &scl=1
)
&scl=1
&color=000000
&fmt=png,gray
&quantize=adaptive,off,2,ffffff,${$WhiteInkColorHex}
`.replace(/\s/g, "")
    } else if ($VuMarkID && $FormType !== "SS") {
        return `
http://images.tervis.com/is/image/tervis?
src=(
    http://images.tervis.com/is/image/tervisRender/16oz_mark_mask?
    &layer=1
    &mask=is(
        tervisRender?
        &src=ir(
            tervisRender/16_Warp_trans?
            &obj=group
            &decal
            &src=is(
                tervisRender/16oz_base2?
                .BG
                &layer=5
                &anchor=0,0
                &src=is(
                    tervis/prj-${$ProjectID}
                )
            )
            &show
            &res=300
            &req=object
            &fmt=png-alpha
        )
    )
    &scl=1
    &layer=2
    &src=is(
        tervisRender/mark_mask_v1?
        &layer=1
        &mask=is(
            tervis/vum-${$ProjectID}-${$VuMarkID}
        )
        &scl=1
    )
    &scl=1
)
&scl=1
&fmt=png,gray
&quantize=adaptive,off,2,ffffff,${$WhiteInkColorHex}
`.replace(/\s/g, "")
    } else if (!$VuMarkID && $FormType === "SS") {
        return `
http://images.tervis.com/is/image/tervis?
src=(
    http://images.tervis.com/is/image/tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Mask"})}?
    &layer=1
    &mask=is(
        tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Base"})}?
        .BG
        &layer=5
        &anchor=0,0
        &src=is(
            tervis/prj-${$ProjectID}
        )
    )
    &scl=1
)
&op_grow=1
&op_usm=5,250,255,0
&scl=1
&cache=off
&fmt=png,gray
`.replace(/\s/g, "")
    }
}

export async function New_TervisAdobeScene7VuMarkImageURL ({
    $ProjectID,
    $VuMarkID
}) {
    return `http://images.tervis.com/is/image/tervis/vum-${$ProjectID}-${$VuMarkID}?scl=1&fmt=png-alpha,rgb`
}

export function New_TervisAdobeScene7URL ({
    $Type,
    $RelativeURL,
    $AsScene7SrcValue,
    $ExternalURL
}) {
    if ($AsScene7SrcValue) {
        if ($Type === "ImageServer") {
            return `is{${$RelativeURL}}`
        } else if ($Type === "ImageRender") {
            return `ir{${$RelativeURL}}`
        } else if ($ExternalURL) {
            var $ExternalURLWithoutHttps = $ExternalURL.replace(/^https/i, "http")
            return `{${$ExternalURLWithoutHttps}}`
        }
    } else {
        var $URL
        if ($Type === "ImageServer") {
            $URL = new URL(`https://images.tervis.com/is/image/${$RelativeURL}`)
        } else if ($Type === "ImageRender") {
            $URL = new URL(`https://images.tervis.com/ir/render/${$RelativeURL}`)
        }

        var $URLSearchParams = new URLSearchParams($URL.search)
        $URLSearchParams.append('scl', 1)
        $URLSearchParams.append('fmt', 'png-alpha')
        $URL.search = `?${$URLSearchParams.toString()}`
        return decodeURIComponent($URL.href)
    }
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

export function New_TervisAdobeScene7ProductVirtualURL ({
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

export function New_TervisAdobeScene7CustomyzerArtboardImageURL ({
    $ProjectID,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $SizeStanza = New_AdobeScene7SizeStanza({$Width, $Height})
    var $RelativeURL = `
        tervis/prj-${$ProjectID}
        ${$SizeStanza ? `?${$SizeStanza}` : ""}
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export async function New_TervisAdobeScene7ArtboardProofBackgroundImageURL ({
    $Size,
    $FormType,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_SizeAndFormTypeMetaDataUsingIndex({$Size, $FormType})
    var $ArtBoardDimensions = $SizeAndFormTypeMetaData.ArtBoardDimensions
    var $BackgroundColorHex = "e6e7e8"
    var $SizeStanza = New_AdobeScene7SizeStanza({
        $Width: $Width ? $Width : $ArtBoardDimensions.Width,
        $Height: $Height ? $Height : $ArtBoardDimensions.Height
    })

    var $RelativeURL = `
    tervis?
    layer=0
    &bgColor=${$BackgroundColorHex}
    ${$SizeStanza ? $SizeStanza : ""}
    `
    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export function New_AdobeScene7SizeStanza ({
    $Width,
    $Height
}) {
    if ($Width && $Height){
        return `&size=${$Width},${$Height}`
    }
}

export async function New_TervisAdobeScene7ProofImageURL ({
    $DecorationImageURLAsSourceValue,
    $ArcedDecoration,
    $Size,
    $FormType,
    $IncludeDiecutterCalibrationLine,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $ProofBackgroundImageURLAsSourceValue = await New_TervisAdobeScene7ArtboardProofBackgroundImageURL({
        $Size,
        $FormType,
        $Width,
        $Height,
        $AsScene7SrcValue: true
    })

    if ($ArcedDecoration) {
        $ProofBackgroundImageURLAsSourceValue = await New_TervisAdobeScene7ArcedImageURL({
            $Size,
            $FormType,
            $AsScene7SrcValue: true,
            $Width,
            $Height,
            $DecalSourceValue: $ProofBackgroundImageURLAsSourceValue
        })
    }

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

export async function New_TervisAdobeScene7DiecutterCalibrationCheckLineImageURL ({
    $Size,
    $FormType,
    $AsScene7SrcValue
}) {
    return New_TervisAdobeScene7URL({
        $Type: "ImageServer",
        $RelativeURL: `tervisRender/${await Get_CustomyzerImageTemplateName({ $Size, $FormType, $TemplateType: "DiecutterCalibrationCheckLine"})}`,
        $AsScene7SrcValue
    })
}

export async function New_TervisAdobeScene7VirtualImageURL ({
    $ProjectID,
    $Size,
    $FormType,
    $DecorationProofImageURLAsSourceValue,
    $ProductVirtualURLAsSourceValue,
    $ProductVirtualDecorationPositionXValue,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_SizeAndFormTypeMetaDataUsingIndex({$Size, $FormType})
    var $ProofBackgroundWidth = 1650
    var $ProofBackgroundHeight = 1275

    var $DecorationProofCenterPointYRelativeToVirtualBackground = $SizeAndFormTypeMetaData.DecorationProofCenterPointYRelativeToVirtualBackground
    var $DecorationProofCenterPointXRelativeToVirtualBackground = 600

    var $DecorationProofPositionX = $DecorationProofCenterPointXRelativeToVirtualBackground - ($ProofBackgroundWidth/2)
    var $DecorationProofPositionY = $DecorationProofCenterPointYRelativeToVirtualBackground - ($ProofBackgroundHeight/2)

    if (!$DecorationProofImageURLAsSourceValue) {
        var $DecorationProofWidthOnVirtual = $SizeAndFormTypeMetaData.DecorationProofWidthOnVirtual    
        var $DecorationProofAspectRatio = $SizeAndFormTypeMetaData.PrintImageDimensions.Width / $SizeAndFormTypeMetaData.PrintImageDimensions.Height
        var $DecorationProofHeightOnVirtual = Math.round($DecorationProofWidthOnVirtual / $DecorationProofAspectRatio)
        
        if ($FormType !== "SS") {
            $DecorationProofImageURLAsSourceValue = await New_TervisAdobeScene7ArcedProofImageURL({
                $ProjectID,
                $Size,
                $FormType,
                $Width: $DecorationProofWidthOnVirtual,
                $Height: $DecorationProofHeightOnVirtual,
                $AsScene7SrcValue: true,
                $IncludeDiecutterCalibrationLine: true
            })
        } else {
            $DecorationProofImageURLAsSourceValue = New_TervisAdobeScene7CustomyzerArtboardProofImageURL({
                $ProjectID,
                $Width: $DecorationProofWidthOnVirtual,
                $Height: $DecorationProofHeightOnVirtual,
                $AsScene7SrcValue: true
            })
        }
    }

    if (!$ProductVirtualURLAsSourceValue) {
        var $ProductVirtualWidth = 1079
        var $ProductVirtualHeight = 949
        $ProductVirtualURLAsSourceValue = await New_CustomyzerProjectProductVirtualURL({
            $ProjectID,
            $Size,
            $FormType,
            $DecorationPositionXValue: $ProductVirtualDecorationPositionXValue,
            $Width: $ProductVirtualWidth,
            $Height: $ProductVirtualHeight,
            $AsScene7SrcValue: true
        })
    }

    var $ProductVirtualCenterPointX = 1349
    var $ProductVirtualCenterPointY = 637
    var $ProductVirtualPositionX = $ProductVirtualCenterPointX - ($ProofBackgroundWidth/2)
    var $ProductVirtualPositionY = $ProductVirtualCenterPointY - ($ProofBackgroundHeight/2)

    var $RelativeURL = `
        tervisRender/VIRTUALS_ALL_Background?
        layer=1
        &src=${$DecorationProofImageURLAsSourceValue}
        &pos=${$DecorationProofPositionX},${$DecorationProofPositionY}
        &layer=2
        &src=${$ProductVirtualURLAsSourceValue}
        &pos=${$ProductVirtualPositionX},${$ProductVirtualPositionY}
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}
