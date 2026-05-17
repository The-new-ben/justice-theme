$pw = 'BynE nrDn 6boc xPSW JjLa K9C5'
$bytes = [Text.Encoding]::ASCII.GetBytes("benbatash:$pw")
$b64 = [Convert]::ToBase64String($bytes)
$hdr = @{ 'Authorization' = "Basic $b64" }
$result = Invoke-RestMethod -Uri 'https://jus-tice.co.il/wp-json/justice/v1/fix-category-base' -Method POST -Headers $hdr
$result | ConvertTo-Json
