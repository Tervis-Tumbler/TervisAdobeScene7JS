import {
    Get_CustomyzerImageTemplateName,
    Get_SizeAndFormTypeMetaDataUsingIndex
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

export async function New_TervisAdobeScene7ArcedImageURL ({
    $Size,
    $FormType,
    $DecalSourceValue,
    $AsScene7SrcValue
}) {
    let $GetTemplateNameParameters = ({$Size, $FormType})
    var $RelativeURL = `
        tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Vignette"})}?
        &obj=group
        &decal
        &src=${$DecalSourceValue}
        &show
        &res=300
        &req=object
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
        tervisRender/${$Size}${$FormType}${$VignetteSuffix}?
        ${$ShowObjectsURLFragment}
        ${$DecorationStanza}
        &obj=MAIN
        &req=object
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageRender", $RelativeURL, $AsScene7SrcValue})
}

export function New_TervisAdobeScene7VirtualURL ({
    $Size,
    $FormType,
    $VignetteSuffix,
    $DecorationSrc,
    $DecorationPositionXValue,
    $ElementPathsToShow,
    $AsScene7SrcValue
}) {

    var $RelativeURL = `
        tervisRender/VIRTUALS_ALL_Background?
        layer1
    `.replace(/\s/g, "")
}

export function New_TervisAdobeScene7CustomyzerArtboardImageURL ({
    $ProjectID,
    $AsScene7SrcValue,
    $BackgroundColorHex
}) {
    var $RelativeURL = `tervis/prj-${$ProjectID}`

    if ($BackgroundColorHex){
        $RelativeURL += `
            ?
            layer=0
            &bgColor=${$BackgroundColorHex}
        `.replace(/\s/g, "")
    }
    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export function New_TervisAdobeScene7CustomyzerArtboardProofImageURL ({
    $ProjectID,
    $AsScene7SrcValue
}) {
    return New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID, $BackgroundColorHex: "e6e7e8", $AsScene7SrcValue})
}

export async function New_TervisAdobeScene7ArcedProofImageURL ({
    $ProjectID,
    $Size,
    $FormType,
    $IncludeDiecutterCalibrationLine,
    $AsScene7SrcValue
}) {
    if (!$IncludeDiecutterCalibrationLine) {
        return New_TervisAdobeScene7ArcedImageURL({
            $Size,
            $FormType,
            $AsScene7SrcValue,
            $DecalSourceValue: New_TervisAdobeScene7CustomyzerArtboardProofImageURL({$ProjectID, $AsScene7SrcValue: true})
        })
    } else {
        var $ArcedImageURLAsSourceValue = await New_TervisAdobeScene7ArcedImageURL({
            $Size,
            $FormType,
            $AsScene7SrcValue: true,
            $DecalSourceValue: New_TervisAdobeScene7CustomyzerArtboardProofImageURL({$ProjectID, $AsScene7SrcValue: true})
        })

        var $RelativeURL = `
            tervisRender?
            &layer=0
            &src=${$ArcedImageURLAsSourceValue}
            &layer=1
            &src=${await New_TervisAdobeScene7DiecutterCalibrationCheckLineImageURL({$Size, $FormType, $AsScene7SrcValue: true})}
        `.replace(/\s/g, "")

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
        $RelativeURL: `tervisRender/${await Get_CustomyzerImageTemplateName({ $Size, $FormType, $TemplateType: "DiecutterCalibrationCheckLine"})}`,
        $AsScene7SrcValue
    })
}

export function New_TervisAdobeScene7CustomyzerProjectProofImageURL({
    $ProjectID,
    $Size,
    $FormType,
    $AsScene7RelativeUrl,
    $AsVirtual
}) {
    var $SizeAndFormTypeMetaData = Get_SizeAndFormTypeMetaDataUsingIndex({$Size, $FormType})
    var $PrintImageDimensions = $SizeAndFormTypeMetaData.PrintImageDimensions
    
//     if ($AsVirtual) {
//         $VignettePositionRelativeToVirtualSampleBackground = $CustomyzerSizeAndFormTypeMetaData.VignettePositionRelativeToVirtualSampleBackground
//         $OutputImageWidth = $VignettePositionRelativeToVirtualSampleBackground.Right - $VignettePositionRelativeToVirtualSampleBackground.Left
//         $OutputImageHeight = $VignettePositionRelativeToVirtualSampleBackground.Bottom - $VignettePositionRelativeToVirtualSampleBackground.Top    
//     }
    
//     $RelativeURL = @"
// tervisRender?
// &layer=0
// &size=$($PrintImageDimensions.Width),$($PrintImageDimensions.Height)
// &layer=1
// &src=$(New-TervisAdobeScene7VignetteProofImageURL @GetTemplateNameParameters -ProjectID $ProjectID -AsScene7RelativeURL)
// &layer=2
// &src=$(New-TervisAdobeScene7DiecutterCalibrationCheckLineImageURL @GetTemplateNameParameters -AsScene7RelativeUrl)
// $(if($AsVirtual) {"&wid=$OutputImageWidth&hid=$OutputImageHeight"})
// "@ | Remove-WhiteSpace
}