$r = [System.Net.HttpWebRequest]::Create('https://jus-tice.co.il/practice-areas/criminal-law/')
$r.Method = 'HEAD'
$r.AllowAutoRedirect = $false
try {
    $resp = $r.GetResponse()
    Write-Host "Status: $($resp.StatusCode)"
    Write-Host "Location: $($resp.Headers['Location'])"
    $resp.Close()
} catch {
    $resp = $_.Exception.Response
    Write-Host "Status: $($resp.StatusCode)"
    Write-Host "Location: $($resp.Headers['Location'])"
}
