Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\fezai\.gemini\antigravity\scratch\asala-ecommerce\public\hero-asala.jpg"
$destPathModel = "c:\Users\fezai\.gemini\antigravity\scratch\asala-ecommerce\public\hero-model.jpg"
$destPathFull = "c:\Users\fezai\.gemini\antigravity\scratch\asala-ecommerce\public\hero-full.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Crop full hero area (without header and footer service bar)
$yHero = 85
$hHero = 535
$rectFull = New-Object System.Drawing.Rectangle 0, $yHero, $src.Width, $hHero
$cropFull = $src.Clone($rectFull, $src.PixelFormat)
$cropFull.Save($destPathFull, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropFull.Dispose()

# Crop model only
$xModel = 440
$wModel = $src.Width - $xModel
$rectModel = New-Object System.Drawing.Rectangle $xModel, $yHero, $wModel, $hHero
$cropModel = $src.Clone($rectModel, $src.PixelFormat)
$cropModel.Save($destPathModel, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropModel.Dispose()

$src.Dispose()
Write-Output "Successfully saved hero-full.jpg and hero-model.jpg"

