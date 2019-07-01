import {
    Get_CustomyzerImageTemplateName
} from '@tervis/terviscustomyzerjs/TervisCustomyzerJS.js'

export async function New_TervisAdobeScene7ColorInkImageURL ({
    $ProjectID,
    $Size,
    $FormType
}) {
    let $GetTemplateNameParameters = ({$Size, $FormType})
    if ($FormType !== "SS") {
        return `
http://images.tervis.com/ir/render/tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Vignette"})}?
&obj=group
&decal
&src=is(
    tervis/prj-${$ProjectID}
)
&show
&res=300
&req=object
&fmt=png-alpha,rgb
&scl=1
`.replace(/\s/g, "")
    } else if ($FormType === "SS") {
        return `
http://images.tervis.com/is/image/tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Base"})}?
.BG
&layer=5
&anchor=0,0
&src=is(
tervis/prj-${$ProjectID}
)
&scl=1
&fmt=png-alpha,rgb
`.replace(/\s/g, "")
    }
}


export async function New_TervisAdobeScene7FinalImageURL ({
    $ProjectID,
    $Size,
    $FormType
}) {
    let $GetTemplateNameParameters = ({$Size, $FormType})
    if ($FormType !== "SS") {
        return `
http://images.tervis.com/is/image/tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Final"})}?
layer=1&
src=ir(
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
    &fmt=png-alpha,rgb
)
&scl=1
&fmt=png-alpha,rgb
`.replace(/\s/g, "")
    } else if ($FormType === "SS") {
        return `
http://images.tervis.com/is/image/tervisRender/${await Get_CustomyzerImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Base"})}?
.BG
&layer=5
&anchor=0,0
&src=is(
    tervis/prj-${$ProjectID}
)
&scl=1
&fmt=png-alpha,rgb
`.replace(/\s/g, "")
    }
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

// export function New_TervisAdobeScene7CustomyzerProjectProofImageURL ({
//     $ProjectID,
//     $Size,
//     $FormType,
//     $AsRelativeURL
// }) {
//     let $GetTemplateNameParameters = ({$Size, $FormType})
//     $CustomyzerSizeAndFormTypeMetaData =  Get-CustomyzerSizeAndFormTypeMetaData @GetTemplateNameParameters
//     $PrintImageDimensions = $CustomyzerSizeAndFormTypeMetaData.PrintImageDimensions
//     @"
// http://images.tervis.com/is/image/tervis?
// &layer=0
// &size=$($PrintImageDimensions.Width),$($PrintImageDimensions.Height)
// &layer=1
// &src=($(New-TervisAdobeScene7VignetteProofImageURL @GetTemplateNameParameters -ProjectID $ProjectID))
// &layer=2
// &src=is($(New-TervisAdobeScene7DiecutterCalibrationCheckLineImageURL @GetTemplateNameParameters -AsRelativeURL))
// &scl=1
// &fmt=png-alpha
// "@ | Remove-WhiteSpace
// }

export async function Get_3DTumblerPreviewImageURL({
    $Size,
    $FormType
}) {
    return `
                http://s7d4.scene7.com/is/image/tervis?
                layer=0&
                src=ir{
                  tervisRender/${$Size}${$FormType}1-HERO2?
                  &obj=MAIN/GLARE
                  &show
                  &obj=MAIN/OUTER/${outerform}/${outercolor}
                  &show
                  &obj=MAIN/INNER/${innerform}/${innercolor}
                  &show
                  &obj=MAIN/DECO
                  &decal
                  &src=${codetypeURL}
                  ${res2}
                  &pos=${slider},0
                  &show
                  ${lidColor}
                  ${handle}
                  &obj=MAIN
                  &req=object
                }
                ${preset}`.replace(/\s/g, "");
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
            return `{${$ExternalURL}}`
        }
    } else {
        if ($Type === "ImageServer") {
            return `//images.tervis.com/is/image/${$RelativeURL}
                &scl=1
                &fmt=png-alpha
            `.replace(/\s/g, "")
        } else if ($Type === "ImageRender") {
            return `//images.tervis.com/ir/render/${$RelativeURL}
                &scl=1
                &fmt=png-alpha
            `.replace(/\s/g, "")    
        }
    }
}

export function Get_TervisAdobeScene7VignetteContentsURL({
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

export function Get_TervisAdobeScene7VignettePrintSingleURL ({
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

export function Get_TervisAdobeScene7VignetteWrapDecoration3TimesURL ({
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
        &show
        &obj=DECO
        &req=object
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export function Get_TervisAdobeScene7VignetteVirtual ({
    $Size,
    $FormType,
    $AsScene7SrcValue,
    $WrapImageURL,
    $WrapImageRelativeURL,
    $ElementPathsToShow
}) {
    var $Decoration3TimesScene7RelativeURL = Get_TervisAdobeScene7VignetteWrapDecoration3TimesURL({$WrapImageURL, $WrapImageRelativeURL, $AsScene7RelativeURL: true, $Size, $FormType})

    var $ShowObjectsURLFragment = $ElementPathsToShow.map(
        $ElementPath => `&obj=${$ElementPath}&show`
    )
    .join()

    `
tervisRender/${$Size}${$FormType}1?
${$ShowObjectsURLFragment}
&obj=MAIN/DECO
&decal
&src=${$Decoration3TimesScene7RelativeURL}
`
}